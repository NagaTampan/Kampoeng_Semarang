"use client"

import { useState, useEffect } from 'react'
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog'
import { Trash2, Mail, Shield, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface Admin {
    id: string
    email: string
    created_at: string
    last_sign_in_at?: string
}

export default function AdminsPage() {
    const [admins, setAdmins] = useState<Admin[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; admin: Admin | null; loading: boolean }>({
        isOpen: false,
        admin: null,
        loading: false
    })

    // Fetch admins from API route
    const fetchAdmins = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/users')

            if (!response.ok) {
                throw new Error('Failed to fetch admins')
            }

            const data = await response.json()

            setAdmins(data.users.map((user: any) => ({
                id: user.id,
                email: user.email || '',
                created_at: user.created_at,
                last_sign_in_at: user.last_sign_in_at
            })))
        } catch (error) {
            console.error('Error fetching admins:', error)
            toast.error('Failed to fetch admins. Please check your service role key.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAdmins()
    }, [])

    const handleDeleteClick = (admin: Admin) => {
        setDeleteDialog({ isOpen: true, admin, loading: false })
    }

    const handleDeleteConfirm = async () => {
        if (!deleteDialog.admin) return

        setDeleteDialog(prev => ({ ...prev, loading: true }))

        try {
            const response = await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: deleteDialog.admin.id })
            })

            if (!response.ok) {
                throw new Error('Failed to delete admin')
            }

            toast.success('Admin deleted successfully')
            setDeleteDialog({ isOpen: false, admin: null, loading: false })
            fetchAdmins()
        } catch (error: unknown) {
            toast.error('Failed to delete admin')
            setDeleteDialog(prev => ({ ...prev, loading: false }))
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const columns = [
        {
            header: 'Email',
            cell: (item: Admin) => (
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{item.email}</span>
                </div>
            )
        },
        {
            header: 'Created At',
            cell: (item: Admin) => (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(item.created_at)}
                </span>
            )
        },
        {
            header: 'Last Sign In',
            cell: (item: Admin) => (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.last_sign_in_at ? formatDate(item.last_sign_in_at) : 'Never'}
                </span>
            )
        },
        {
            header: 'Actions',
            cell: (item: Admin) => (
                <div className="flex space-x-2 justify-end">
                    <button
                        onClick={() => handleDeleteClick(item)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="w-6 h-6 text-primary" />
                        Admin Accounts
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Manage admin users who can access this dashboard
                    </p>
                </div>
                <button
                    onClick={fetchAdmins}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                            Admin Management
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                            To add new admin users, please use the Supabase Dashboard → Authentication → Users → "Add User".
                            You can delete admin accounts from this page.
                        </p>
                    </div>
                </div>
            </div>

            {/* Admins Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                {columns.map((column, index) => (
                                    <th
                                        key={index}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                    >
                                        {column.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : admins.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No admin accounts found
                                    </td>
                                </tr>
                            ) : (
                                admins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        {columns.map((column, colIndex) => (
                                            <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                                                {column.cell(admin)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DeleteConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Delete Admin Account?"
                message="Are you sure you want to delete this admin account? This will revoke their access to the dashboard."
                itemName={deleteDialog.admin?.email}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteDialog({ isOpen: false, admin: null, loading: false })}
                loading={deleteDialog.loading}
            />
        </div>
    )
}

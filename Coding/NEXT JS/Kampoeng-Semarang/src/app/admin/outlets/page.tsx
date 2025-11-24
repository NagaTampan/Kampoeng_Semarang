"use client"

import { useState } from 'react'
import { useDataTable } from '@/hooks/useDataTable'
import { DataTable } from '@/components/admin/DataTable'
import { OutletForm } from '@/components/admin/OutletForm'
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog'
import { Pencil, Trash2, MapPin as MapPinIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Image from 'next/image'
import { Outlet } from '@/types'

export default function OutletsPage() {
    const {
        data: outlets,
        count,
        loading,
        page,
        setPage,
        search,
        setSearch,
        refresh
    } = useDataTable<Outlet>({ tableName: 'outlets' })

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null)
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; outlet: Outlet | null; loading: boolean }>({
        isOpen: false,
        outlet: null,
        loading: false
    })

    const handleDeleteClick = (outlet: Outlet) => {
        setDeleteDialog({ isOpen: true, outlet, loading: false })
    }

    const handleDeleteConfirm = async () => {
        if (!deleteDialog.outlet) return

        setDeleteDialog(prev => ({ ...prev, loading: true }))

        try {
            const { error } = await supabase.from('outlets').delete().eq('id', deleteDialog.outlet!.id)
            if (error) throw error
            toast.success('Outlet deleted successfully')
            setDeleteDialog({ isOpen: false, outlet: null, loading: false })
            refresh()
        } catch (error: unknown) {
            toast.error('Failed to delete outlet')
            setDeleteDialog(prev => ({ ...prev, loading: false }))
        }
    }

    const columns = [
        {
            header: 'Image',
            cell: (item: Outlet) => (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {item.image_url ? (
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            <MapPinIcon className="w-5 h-5" />
                        </div>
                    )}
                </div>
            ),
        },
        { header: 'Name', accessorKey: 'name' as keyof Outlet },
        {
            header: 'Address',
            cell: (item: Outlet) => (
                <div className="max-w-xs truncate text-sm text-gray-600 dark:text-gray-400">
                    {item.address}
                </div>
            )
        },
        {
            header: 'Phone',
            cell: (item: Outlet) => item.phone || '-'
        },
        {
            header: 'Actions',
            cell: (item: Outlet) => (
                <div className="flex space-x-2 justify-end">
                    <button
                        onClick={() => {
                            setEditingOutlet(item)
                            setIsFormOpen(true)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
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
                <h1 className="text-2xl font-bold">Outlets</h1>
            </div>

            <DataTable
                data={outlets}
                columns={columns}
                loading={loading}
                page={page}
                count={count}
                onPageChange={setPage}
                search={search}
                onSearchChange={setSearch}
                actionLabel="Add Outlet"
                onAction={() => {
                    setEditingOutlet(null)
                    setIsFormOpen(true)
                }}
            />

            {isFormOpen && (
                <OutletForm
                    initialData={editingOutlet || undefined}
                    onSuccess={() => {
                        setIsFormOpen(false)
                        refresh()
                    }}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}

            <DeleteConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Delete Outlet?"
                message="Are you sure you want to delete this outlet? This will remove it from all listings."
                itemName={deleteDialog.outlet?.name}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteDialog({ isOpen: false, outlet: null, loading: false })}
                loading={deleteDialog.loading}
            />
        </div>
    )
}

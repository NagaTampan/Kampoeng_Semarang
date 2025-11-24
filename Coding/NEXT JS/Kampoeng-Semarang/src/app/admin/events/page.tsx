"use client"

import { useState } from 'react'
import { useDataTable } from '@/hooks/useDataTable'
import { DataTable } from '@/components/admin/DataTable'
import { EventForm } from '@/components/admin/EventForm'
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog'
import { Pencil, Trash2, Star, Calendar as CalendarIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Image from 'next/image'
import { Event } from '@/types'

export default function EventsPage() {
    const {
        data: events,
        count,
        loading,
        page,
        setPage,
        search,
        setSearch,
        refresh
    } = useDataTable<Event>({ tableName: 'events' })

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; event: Event | null; loading: boolean }>({
        isOpen: false,
        event: null,
        loading: false
    })

    const handleDeleteClick = (event: Event) => {
        setDeleteDialog({ isOpen: true, event, loading: false })
    }

    const handleDeleteConfirm = async () => {
        if (!deleteDialog.event) return

        setDeleteDialog(prev => ({ ...prev, loading: true }))

        try {
            const { error } = await supabase.from('events').delete().eq('id', deleteDialog.event!.id)
            if (error) throw error
            toast.success('Event deleted successfully')
            setDeleteDialog({ isOpen: false, event: null, loading: false })
            refresh()
        } catch (error: unknown) {
            toast.error('Failed to delete event')
            setDeleteDialog(prev => ({ ...prev, loading: false }))
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const columns = [
        {
            header: 'Image',
            cell: (item: Event) => (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {item.image_url ? (
                        <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: 'Title',
            cell: (item: Event) => (
                <div className="flex items-center gap-2">
                    <span>{item.title}</span>
                    {item.is_featured && (
                        <div title="Featured">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Date',
            cell: (item: Event) => (
                <div className="text-sm">
                    <div>{formatDate(item.start_date)}</div>
                    {item.start_date !== item.end_date && (
                        <div className="text-xs text-gray-500">to {formatDate(item.end_date)}</div>
                    )}
                </div>
            )
        },
        {
            header: 'Status',
            cell: (item: Event) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                    {item.status}
                </span>
            )
        },
        {
            header: 'Actions',
            cell: (item: Event) => (
                <div className="flex space-x-2 justify-end">
                    <button
                        onClick={() => {
                            setEditingEvent(item)
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
                <h1 className="text-2xl font-bold">Events</h1>
            </div>

            <DataTable
                data={events}
                columns={columns}
                loading={loading}
                page={page}
                count={count}
                onPageChange={setPage}
                search={search}
                onSearchChange={setSearch}
                actionLabel="Add Event"
                onAction={() => {
                    setEditingEvent(null)
                    setIsFormOpen(true)
                }}
            />

            {isFormOpen && (
                <EventForm
                    initialData={editingEvent || undefined}
                    onSuccess={() => {
                        setIsFormOpen(false)
                        refresh()
                    }}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}

            <DeleteConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Delete Event?"
                message="Are you sure you want to delete this event? This will remove it from all listings and the homepage."
                itemName={deleteDialog.event?.title}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteDialog({ isOpen: false, event: null, loading: false })}
                loading={deleteDialog.loading}
            />
        </div>
    )
}

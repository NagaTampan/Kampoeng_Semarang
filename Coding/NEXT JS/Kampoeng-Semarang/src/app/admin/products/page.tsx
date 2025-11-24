"use client"

import { useState } from 'react'
import { useDataTable } from '@/hooks/useDataTable'
import { DataTable } from '@/components/admin/DataTable'
import { ProductForm } from '@/components/admin/ProductForm'
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog'
import { Pencil, Trash2, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Image from 'next/image'
import { Product } from '@/types'

export default function ProductsPage() {
    const {
        data: products,
        count,
        loading,
        page,
        setPage,
        search,
        setSearch,
        refresh
    } = useDataTable<Product>({ tableName: 'products' })

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; product: Product | null; loading: boolean }>({
        isOpen: false,
        product: null,
        loading: false
    })

    const handleDeleteClick = (product: Product) => {
        setDeleteDialog({ isOpen: true, product, loading: false })
    }

    const handleDeleteConfirm = async () => {
        if (!deleteDialog.product) return

        setDeleteDialog(prev => ({ ...prev, loading: true }))

        try {
            const { error } = await supabase.from('products').delete().eq('id', deleteDialog.product!.id)
            if (error) throw error
            toast.success('Product deleted successfully')
            setDeleteDialog({ isOpen: false, product: null, loading: false })
            refresh()
        } catch (error: unknown) {
            toast.error('Failed to delete product')
            setDeleteDialog(prev => ({ ...prev, loading: false }))
        }
    }

    const columns = [
        {
            header: 'Image',
            cell: (item: Product) => (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {item.image_url ? (
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                </div>
            ),
        },
        {
            header: 'Name',
            cell: (item: Product) => (
                <div className="flex items-center gap-2">
                    <span>{item.name}</span>
                    {item.is_featured && (
                        <div title="Featured">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        </div>
                    )}
                </div>
            )
        },
        { header: 'Category', accessorKey: 'category' as keyof Product },
        {
            header: 'Price',
            cell: (item: Product) => `Rp ${item.price?.toLocaleString('id-ID')}`
        },
        {
            header: 'Actions',
            cell: (item: Product) => (
                <div className="flex space-x-2 justify-end">
                    <button
                        onClick={() => {
                            setEditingProduct(item)
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
                <h1 className="text-2xl font-bold">Products</h1>
            </div>

            <DataTable
                data={products}
                columns={columns}
                loading={loading}
                page={page}
                count={count}
                onPageChange={setPage}
                search={search}
                onSearchChange={setSearch}
                actionLabel="Add Product"
                onAction={() => {
                    setEditingProduct(null)
                    setIsFormOpen(true)
                }}
            />

            {isFormOpen && (
                <ProductForm
                    initialData={editingProduct || undefined}
                    onSuccess={() => {
                        setIsFormOpen(false)
                        refresh()
                    }}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}

            <DeleteConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Delete Product?"
                message="Are you sure you want to delete this product? This will remove it from all listings."
                itemName={deleteDialog.product?.name}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteDialog({ isOpen: false, product: null, loading: false })}
                loading={deleteDialog.loading}
            />
        </div>
    )
}

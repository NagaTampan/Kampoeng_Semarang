"use client"

import { useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase/client'
import { Loader2, Upload, X, Star } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Product } from '@/types'
import dynamic from 'next/dynamic'

// Dynamically import SimpleMDE to avoid SSR issues
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })
import 'easymde/dist/easymde.min.css'

const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    price: z.coerce.number().min(1, 'Price is required'),
    category: z.string().min(1, 'Category is required'),
    is_featured: z.boolean().default(false),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
    initialData?: Product
    onSuccess: () => void
    onCancel: () => void
}

export function ProductForm({ initialData, onSuccess, onCancel }: ProductFormProps) {
    const [loading, setLoading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)

    const { register, handleSubmit, control, formState: { errors } } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            price: initialData?.price || 0,
            category: initialData?.category || '',
            is_featured: initialData?.is_featured || false,
        },
    })

    const editorOptions = useMemo(() => ({
        spellChecker: false,
        placeholder: 'Tulis deskripsi produk dengan Markdown...',
        status: false,
        toolbar: ['bold', 'italic', 'heading', '|', 'unordered-list', 'ordered-list', '|', 'link', 'preview'] as any,
    }), [])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const onSubmit = async (data: ProductFormValues) => {
        setLoading(true)
        try {
            let imageUrl = initialData?.image_url

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(fileName, imageFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(fileName)

                imageUrl = publicUrl
            }

            const productData = {
                ...data,
                image_url: imageUrl,
            }

            if (initialData) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', initialData.id)
                if (error) throw error
                toast.success('Product updated successfully')
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData])
                if (error) throw error
                toast.success('Product created successfully')
            }

            onSuccess()
        } catch (error: unknown) {
            console.error('Error saving product:', error)
            toast.error((error as Error).message || 'Failed to save product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full my-8 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{initialData ? 'Edit Product' : 'Add Product'}</h2>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Product Image</label>
                        <div className="flex items-center space-x-4">
                            <div className="relative w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 border-2 border-dashed border-gray-300 dark:border-gray-600">
                                {imagePreview ? (
                                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <Upload className="w-8 h-8 mb-1" />
                                        <span className="text-xs">Upload</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                />
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Product Name *</label>
                            <input
                                {...register('name')}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                placeholder="e.g., Batik Tulis Premium"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Category *</label>
                            <select
                                {...register('category')}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            >
                                <option value="">Select Category</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Food">Food</option>
                                <option value="Craft">Craft</option>
                                <option value="Souvenir">Souvenir</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Price (Rp) *</label>
                        <input
                            type="number"
                            {...register('price')}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            placeholder="e.g., 150000"
                        />
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                    </div>

                    {/* Featured Toggle */}
                    <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center space-x-3">
                            <Star className="w-5 h-5 text-amber-500" />
                            <div>
                                <label className="block text-sm font-semibold text-amber-900 dark:text-amber-100">Featured Product</label>
                                <p className="text-xs text-amber-700 dark:text-amber-300">Show this product on the homepage</p>
                            </div>
                        </div>
                        <Controller
                            name="is_featured"
                            control={control}
                            render={({ field }) => (
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
                                </label>
                            )}
                        />
                    </div>

                    {/* Description with Markdown */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Description (Markdown supported)</label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <SimpleMDE
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    options={editorOptions}
                                />
                            )}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Gunakan Markdown untuk formatting: **bold**, *italic*, # heading, - list
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>{initialData ? 'Update Product' : 'Create Product'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

"use client"

import { useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase/client'
import { Loader2, Upload, X, MapPin } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Outlet } from '@/types'
import dynamic from 'next/dynamic'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })
import 'easymde/dist/easymde.min.css'

const outletSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    address: z.string().min(1, 'Address is required'),
    phone: z.string().optional(),
    operating_hours: z.string().optional(),
    map_url: z.string().url('Invalid URL').optional().or(z.literal('')),
})

type OutletFormValues = z.infer<typeof outletSchema>

interface OutletFormProps {
    initialData?: Outlet
    onSuccess: () => void
    onCancel: () => void
}

export function OutletForm({ initialData, onSuccess, onCancel }: OutletFormProps) {
    const [loading, setLoading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)

    const { register, handleSubmit, control, formState: { errors } } = useForm<OutletFormValues>({
        resolver: zodResolver(outletSchema),
        defaultValues: {
            name: initialData?.name || '',
            address: initialData?.address || '',
            phone: initialData?.phone || '',
            operating_hours: initialData?.operating_hours || '',
            map_url: initialData?.map_url || '',
        },
    })

    const editorOptions = useMemo(() => ({
        spellChecker: false,
        placeholder: 'Tulis alamat lengkap dengan Markdown...',
        status: false,
        toolbar: ['bold', 'italic', '|', 'unordered-list', 'ordered-list', '|', 'link', 'preview'] as any,
    }), [])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const onSubmit = async (data: OutletFormValues) => {
        setLoading(true)
        try {
            let imageUrl = initialData?.image_url

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const { error: uploadError } = await supabase.storage
                    .from('outlets')
                    .upload(fileName, imageFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('outlets')
                    .getPublicUrl(fileName)

                imageUrl = publicUrl
            }

            const outletData = {
                ...data,
                image_url: imageUrl,
            }

            if (initialData) {
                const { error } = await supabase
                    .from('outlets')
                    .update(outletData)
                    .eq('id', initialData.id)
                if (error) throw error
                toast.success('Outlet updated successfully')
            } else {
                const { error } = await supabase
                    .from('outlets')
                    .insert([outletData])
                if (error) throw error
                toast.success('Outlet created successfully')
            }

            onSuccess()
        } catch (error: unknown) {
            console.error('Error saving outlet:', error)
            toast.error((error as Error).message || 'Failed to save outlet')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full my-8 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <MapPin className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">{initialData ? 'Edit Outlet' : 'Add Outlet'}</h2>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Outlet Photo</label>
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

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Outlet Name *</label>
                        <input
                            {...register('name')}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            placeholder="e.g., Kampoeng Semarang - Simpang Lima"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number</label>
                            <input
                                {...register('phone')}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                placeholder="e.g., +62 24 1234567"
                            />
                        </div>

                        {/* Operating Hours */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Operating Hours</label>
                            <input
                                {...register('operating_hours')}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                placeholder="e.g., 09:00 - 21:00 WIB"
                            />
                        </div>
                    </div>

                    {/* Google Maps URL */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Google Maps URL</label>
                        <input
                            {...register('map_url')}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            placeholder="https://maps.google.com/..."
                        />
                        {errors.map_url && <p className="text-red-500 text-xs mt-1">{errors.map_url.message}</p>}
                        <p className="text-xs text-gray-500 mt-1">Paste the Google Maps share link</p>
                    </div>

                    {/* Address with Markdown */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Full Address * (Markdown supported)</label>
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <SimpleMDE
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    options={editorOptions}
                                />
                            )}
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                        <p className="text-xs text-gray-500 mt-1">
                            Gunakan Markdown untuk formatting: **bold**, *italic*, - list
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
                            <span>{initialData ? 'Update Outlet' : 'Create Outlet'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

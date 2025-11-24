"use client"

import { useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase/client'
import { Loader2, Upload, X, Star, Calendar } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Event } from '@/types'
import dynamic from 'next/dynamic'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })
import 'easymde/dist/easymde.min.css'

const eventSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    start_time: z.string().optional(),
    location: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(['active', 'inactive']).default('active'),
    is_featured: z.boolean().default(false),
})

type EventFormValues = z.infer<typeof eventSchema>

interface EventFormProps {
    initialData?: Event
    onSuccess: () => void
    onCancel: () => void
}

export function EventForm({ initialData, onSuccess, onCancel }: EventFormProps) {
    const [loading, setLoading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)

    const { register, handleSubmit, control, formState: { errors } } = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            start_date: initialData?.start_date?.split('T')[0] || '',
            end_date: initialData?.end_date?.split('T')[0] || '',
            start_time: initialData?.start_time || '',
            location: initialData?.location || '',
            category: initialData?.category || '',
            status: initialData?.status || 'active',
            is_featured: initialData?.is_featured || false,
        },
    })

    const editorOptions = useMemo(() => ({
        spellChecker: false,
        placeholder: 'Tulis deskripsi event dengan Markdown...',
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

    const onSubmit = async (data: EventFormValues) => {
        setLoading(true)
        try {
            let imageUrl = initialData?.image_url

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const { error: uploadError } = await supabase.storage
                    .from('events')
                    .upload(fileName, imageFile)

                if (uploadError) {
                    console.error('Upload error:', uploadError)
                    throw new Error(`Image upload failed: ${uploadError.message}`)
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('events')
                    .getPublicUrl(fileName)

                imageUrl = publicUrl
            }

            const eventData = {
                ...data,
                image_url: imageUrl,
            }

            if (initialData) {
                const { error } = await supabase
                    .from('events')
                    .update(eventData)
                    .eq('id', initialData.id)

                if (error) {
                    console.error('Supabase update error:', error)
                    throw new Error(error.message || 'Failed to update event')
                }
                toast.success('Event updated successfully')
            } else {
                const { error } = await supabase
                    .from('events')
                    .insert([eventData])

                if (error) {
                    console.error('Supabase insert error:', error)
                    throw new Error(error.message || 'Failed to create event')
                }
                toast.success('Event created successfully')
            }

            onSuccess()
        } catch (error: unknown) {
            console.error('Error saving event:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to save event'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full my-8 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <Calendar className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">{initialData ? 'Edit Event' : 'Add Event'}</h2>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Event Banner</label>
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

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Event Title *</label>
                        <input
                            {...register('title')}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            placeholder="e.g., Semarang Night Carnival"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Date *</label>
                            <input
                                type="date"
                                {...register('start_date')}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            />
                            {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date.message}</p>}
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium mb-1">End Date *</label>
                            <input
                                type="date"
                                {...register('end_date')}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            />
                            {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Start Time */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Time</label>
                            <input
                                type="time"
                                {...register('start_time')}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                                {...register('category')}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            >
                                <option value="">Select Category</option>
                                <option value="Festival">Festival</option>
                                <option value="Exhibition">Exhibition</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Performance">Performance</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                {...register('status')}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input
                            {...register('location')}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            placeholder="e.g., Outdoor Plaza, Kampoeng Semarang"
                        />
                    </div>

                    {/* Featured Toggle */}
                    <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center space-x-3">
                            <Star className="w-5 h-5 text-amber-500" />
                            <div>
                                <label className="block text-sm font-semibold text-amber-900 dark:text-amber-100">Featured Event</label>
                                <p className="text-xs text-amber-700 dark:text-amber-300">Show this event on the homepage</p>
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
                            <span>{initialData ? 'Update Event' : 'Create Event'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

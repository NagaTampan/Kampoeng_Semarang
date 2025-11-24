"use client"

import { AlertTriangle, Trash2, X } from 'lucide-react'

interface DeleteConfirmDialogProps {
    isOpen: boolean
    title: string
    message: string
    itemName?: string
    onConfirm: () => void
    onCancel: () => void
    loading?: boolean
}

export function DeleteConfirmDialog({
    isOpen,
    title,
    message,
    itemName,
    onConfirm,
    onCancel,
    loading = false
}: DeleteConfirmDialogProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">
                    {title}
                </h3>

                {/* Message */}
                <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
                    {message}
                </p>

                {/* Item Name */}
                {itemName && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
                        <p className="text-sm font-semibold text-red-900 dark:text-red-100 text-center break-words">
                            "{itemName}"
                        </p>
                    </div>
                )}

                {/* Warning */}
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6">
                    ⚠️ This action cannot be undone
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

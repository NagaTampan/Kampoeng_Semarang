import { ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react'

interface Column<T> {
    header: string
    accessorKey?: keyof T
    cell?: (item: T) => React.ReactNode
    className?: string
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    loading: boolean
    page: number
    pageSize?: number
    count: number
    onPageChange: (page: number) => void
    search: string
    onSearchChange: (search: string) => void
    actionLabel?: string
    onAction?: () => void
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    loading,
    page,
    pageSize = 10,
    count,
    onPageChange,
    search,
    onSearchChange,
    actionLabel,
    onAction,
}: DataTableProps<T>) {
    const totalPages = Math.ceil(count / pageSize)

    return (
        <div className="space-y-4">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
                {actionLabel && onAction && (
                    <button
                        onClick={onAction}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                        {actionLabel}
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                {columns.map((col, idx) => (
                                    <th
                                        key={idx}
                                        className={`px-6 py-4 font-medium text-gray-500 dark:text-gray-400 ${col.className || ''}`}
                                    >
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                                        No data found.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        {columns.map((col, idx) => (
                                            <td key={idx} className="px-6 py-4">
                                                {col.cell
                                                    ? col.cell(item)
                                                    : col.accessorKey
                                                        ? (item[col.accessorKey] as React.ReactNode)
                                                        : null}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && count > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Showing {Math.min((page - 1) * pageSize + 1, count)} to{' '}
                            {Math.min(page * pageSize, count)} of {count} results
                        </p>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => onPageChange(page - 1)}
                                disabled={page === 1}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm font-medium">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => onPageChange(page + 1)}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { PostgrestError } from '@supabase/supabase-js'

interface UseDataTableProps {
    tableName: string
    pageSize?: number
    searchColumn?: string
}

interface UseDataTableReturn<T> {
    data: T[]
    count: number
    loading: boolean
    error: PostgrestError | null
    page: number
    setPage: (page: number) => void
    search: string
    setSearch: (search: string) => void
    refresh: () => void
}

export function useDataTable<T>({
    tableName,
    pageSize = 10,
    searchColumn = 'name'
}: UseDataTableProps): UseDataTableReturn<T> {
    const [data, setData] = useState<T[]>([])
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<PostgrestError | null>(null)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                let query = supabase
                    .from(tableName)
                    .select('*', { count: 'exact' })
                    .range((page - 1) * pageSize, page * pageSize - 1)
                    .order('created_at', { ascending: false })

                if (search) {
                    query = query.ilike(searchColumn, `%${search}%`)
                }

                const { data: resultData, error: resultError, count: resultCount } = await query

                if (resultError) throw resultError

                setData(resultData as T[])
                setCount(resultCount || 0)
            } catch (err: unknown) {
                const pgError = err as PostgrestError
                setError(pgError)
                console.error(`Error fetching ${tableName}:`, pgError)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [tableName, page, pageSize, search, searchColumn, refreshTrigger])

    const refresh = () => setRefreshTrigger(prev => prev + 1)

    return {
        data,
        count,
        loading,
        error,
        page,
        setPage,
        search,
        setSearch,
        refresh
    }
}

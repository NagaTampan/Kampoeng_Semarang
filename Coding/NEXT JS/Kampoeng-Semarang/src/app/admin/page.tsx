"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Package, Calendar, MapPin, TrendingUp, Star, Users } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
    totalProducts: number
    totalEvents: number
    totalOutlets: number
    featuredProducts: number
    featuredEvents: number
    activeEvents: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        totalEvents: 0,
        totalOutlets: 0,
        featuredProducts: 0,
        featuredEvents: 0,
        activeEvents: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            // Fetch all stats in parallel
            const [
                { count: totalProducts },
                { count: totalEvents },
                { count: totalOutlets },
                { count: featuredProducts },
                { count: featuredEvents },
                { count: activeEvents }
            ] = await Promise.all([
                supabase.from('products').select('*', { count: 'exact', head: true }),
                supabase.from('events').select('*', { count: 'exact', head: true }),
                supabase.from('outlets').select('*', { count: 'exact', head: true }),
                supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true),
                supabase.from('events').select('*', { count: 'exact', head: true }).eq('is_featured', true),
                supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'active')
            ])

            setStats({
                totalProducts: totalProducts || 0,
                totalEvents: totalEvents || 0,
                totalOutlets: totalOutlets || 0,
                featuredProducts: featuredProducts || 0,
                featuredEvents: featuredEvents || 0,
                activeEvents: activeEvents || 0
            })
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            color: 'bg-blue-500',
            link: '/admin/products',
            subtitle: `${stats.featuredProducts} featured`
        },
        {
            title: 'Total Events',
            value: stats.totalEvents,
            icon: Calendar,
            color: 'bg-purple-500',
            link: '/admin/events',
            subtitle: `${stats.activeEvents} active`
        },
        {
            title: 'Total Outlets',
            value: stats.totalOutlets,
            icon: MapPin,
            color: 'bg-green-500',
            link: '/admin/outlets',
            subtitle: 'Locations'
        },
        {
            title: 'Featured Items',
            value: stats.featuredProducts + stats.featuredEvents,
            icon: Star,
            color: 'bg-amber-500',
            link: '/admin/products',
            subtitle: 'On homepage'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Welcome back! Here's what's happening with your store.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <Link
                        key={index}
                        href={card.link}
                        className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                    >
                        {/* Background Icon */}
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <card.icon className="w-32 h-32" />
                        </div>

                        {/* Content */}
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${card.color} p-3 rounded-lg`}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                                {card.title}
                            </h3>

                            {loading ? (
                                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                            ) : (
                                <p className="text-3xl font-bold mb-1">{card.value}</p>
                            )}

                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                {card.subtitle}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <Package className="w-8 h-8 mb-4 opacity-80" />
                    <h3 className="text-lg font-semibold mb-2">Manage Products</h3>
                    <p className="text-sm opacity-90 mb-4">
                        Add, edit, or remove products from your catalog
                    </p>
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center text-sm font-medium hover:underline"
                    >
                        Go to Products →
                    </Link>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <Calendar className="w-8 h-8 mb-4 opacity-80" />
                    <h3 className="text-lg font-semibold mb-2">Manage Events</h3>
                    <p className="text-sm opacity-90 mb-4">
                        Create and manage upcoming events and promotions
                    </p>
                    <Link
                        href="/admin/events"
                        className="inline-flex items-center text-sm font-medium hover:underline"
                    >
                        Go to Events →
                    </Link>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <MapPin className="w-8 h-8 mb-4 opacity-80" />
                    <h3 className="text-lg font-semibold mb-2">Manage Outlets</h3>
                    <p className="text-sm opacity-90 mb-4">
                        Update outlet information and locations
                    </p>
                    <Link
                        href="/admin/outlets"
                        className="inline-flex items-center text-sm font-medium hover:underline"
                    >
                        Go to Outlets →
                    </Link>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                            <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="font-semibold text-lg">Featured Content</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Featured Products</span>
                            <span className="font-semibold">{stats.featuredProducts}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Featured Events</span>
                            <span className="font-semibold">{stats.featuredEvents}</span>
                        </div>
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                Featured items appear on the homepage to attract more visitors
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="font-semibold text-lg">Event Status</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Active Events</span>
                            <span className="font-semibold text-green-600">{stats.activeEvents}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Inactive Events</span>
                            <span className="font-semibold text-gray-500">{stats.totalEvents - stats.activeEvents}</span>
                        </div>
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                Keep your events updated to engage your audience
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

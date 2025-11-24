"use client"

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Calendar, Clock, MapPin, Sparkles, Filter, Ticket, ArrowRight, CalendarDays } from 'lucide-react'
import { Event } from '@/types'

// --- UTILS ---

// Formatter Tanggal yang robust
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

// Ambil tanggal dan bulan terpisah untuk desain poster
const getDateParts = (dateString: string) => {
    const date = new Date(dateString);
    return {
        day: date.toLocaleDateString('id-ID', { day: '2-digit' }),
        month: date.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase(),
        year: date.getFullYear()
    }
}

// Status Checker Logic
const getEventStatus = (start: string, end?: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date(start); // Jika tidak ada end, anggap 1 hari

    // Set end date to end of day
    endDate.setHours(23, 59, 59);

    if (now > endDate) return 'past';
    if (now >= startDate && now <= endDate) return 'ongoing';
    return 'upcoming';
}

type FilterType = 'all' | 'upcoming' | 'ongoing' | 'past'

export default function EventsPage() {
    // --- STATE ---
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<FilterType>('all')

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .order('start_date', { ascending: true }) // Urutkan dari yang terdekat

                if (error) throw error
                setEvents(data || [])
            } catch (error) {
                console.error('Error fetching events:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    }, [])

    // --- FILTER LOGIC (Memoized) ---
    const filteredEvents = useMemo(() => {
        const sorted = [...events].sort((a, b) => {
            // Logic sorting: Upcoming/Ongoing dulu, baru Past
            const statusA = getEventStatus(a.start_date, a.end_date);
            const statusB = getEventStatus(b.start_date, b.end_date);
            if (statusA === 'past' && statusB !== 'past') return 1;
            if (statusA !== 'past' && statusB === 'past') return -1;
            return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        });

        if (filter === 'all') return sorted;
        return sorted.filter(event => getEventStatus(event.start_date, event.end_date) === filter);
    }, [events, filter]);

    return (
        <main className="min-h-screen bg-[#F9F5F1] dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 transition-colors duration-500 font-sans selection:bg-orange-200 dark:selection:bg-cyan-900">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-16 px-6 overflow-hidden">
                {/* Background FX */}
                <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply dark:mix-blend-overlay"></div>
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-400/20 dark:bg-cyan-900/30 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-400/20 dark:bg-blue-900/30 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>

                <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-stone-200 dark:border-slate-700 text-xs font-bold uppercase tracking-widest text-orange-700 dark:text-cyan-400 shadow-sm">
                        <CalendarDays size={14} />
                        Agenda & Festival
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-slate-900 dark:text-white leading-tight">
                        Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-500 dark:from-cyan-400 dark:to-blue-500">& Story</span>
                    </h1>
                    <p className="text-xl text-stone-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                        Jangan lewatkan berbagai festival, pameran seni, dan promo spesial yang kami hadirkan khusus untuk Anda.
                    </p>
                </div>
            </section>

            {/* --- FILTER TABS --- */}
            <section className="px-6 mb-12 sticky top-24 z-30 pointer-events-none">
                <div className="max-w-7xl mx-auto pointer-events-auto">
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-white/5 p-2 rounded-2xl shadow-lg shadow-stone-200/50 dark:shadow-black/50 inline-flex flex-wrap gap-2">
                        {[
                            { id: 'all', label: 'Semua Agenda' },
                            { id: 'upcoming', label: 'Akan Datang' },
                            { id: 'ongoing', label: 'Sedang Berjalan' },
                            { id: 'past', label: 'Selesai' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id as FilterType)}
                                className={`
                                    px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                                    ${filter === tab.id
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                                        : 'text-stone-500 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- EVENTS GRID --- */}
            <section className="px-6 pb-24 min-h-[50vh]">
                <div className="max-w-7xl mx-auto">

                    {/* Status Info */}
                    <div className="flex justify-between items-end mb-8 border-b border-stone-200 dark:border-slate-800 pb-4">
                        <p className="text-sm font-medium text-stone-500 dark:text-slate-400">
                            Menampilkan <span className="text-slate-900 dark:text-white font-bold">{filteredEvents.length}</span> acara
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => <EventSkeleton key={i} />)}
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <EmptyState reset={() => setFilter('all')} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEvents.map((event) => {
                                const status = getEventStatus(event.start_date, event.end_date);
                                const dateParts = getDateParts(event.start_date);

                                return (
                                    <Link
                                        key={event.id}
                                        href={`/events/${event.id}`}
                                        className="group block h-full"
                                    >
                                        <article className={`
                                            relative h-full flex flex-col bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden border transition-all duration-500 hover:-translate-y-2
                                            ${status === 'past'
                                                ? 'opacity-70 grayscale hover:grayscale-0 border-stone-200 dark:border-slate-700'
                                                : 'border-stone-100 dark:border-slate-700 hover:border-orange-500/50 dark:hover:border-cyan-500/50 shadow-sm hover:shadow-2xl hover:shadow-orange-900/10 dark:hover:shadow-cyan-900/20'
                                            }
                                        `}>

                                            {/* Image Poster Area */}
                                            <div className="relative h-64 overflow-hidden">
                                                {/* Date Badge (Floating Paper Style) */}
                                                <div className="absolute top-4 left-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-3 rounded-2xl shadow-lg flex flex-col items-center min-w-[70px] border border-stone-100 dark:border-slate-700 text-center">
                                                    <span className="text-xs font-bold text-orange-600 dark:text-cyan-500 uppercase tracking-widest">{dateParts.month}</span>
                                                    <span className="text-3xl font-serif font-bold text-slate-900 dark:text-white leading-none my-0.5">{dateParts.day}</span>
                                                    <span className="text-[10px] font-medium text-stone-400">{dateParts.year}</span>
                                                </div>

                                                {/* Status Badge */}
                                                <div className="absolute top-4 right-4 z-20">
                                                    {status === 'upcoming' && (
                                                        <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">Akan Datang</span>
                                                    )}
                                                    {status === 'ongoing' && (
                                                        <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg animate-pulse">Berlangsung</span>
                                                    )}
                                                    {status === 'past' && (
                                                        <span className="px-3 py-1 bg-stone-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">Selesai</span>
                                                    )}
                                                </div>

                                                {/* Image */}
                                                {event.image_url ? (
                                                    <Image
                                                        src={event.image_url}
                                                        alt={event.title}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-stone-200 dark:bg-slate-700 flex items-center justify-center">
                                                        <Ticket className="w-12 h-12 text-stone-400" />
                                                    </div>
                                                )}

                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                            </div>

                                            {/* Content Area */}
                                            <div className="p-6 flex-1 flex flex-col">
                                                <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-cyan-400 transition-colors">
                                                    {event.title}
                                                </h3>

                                                {event.description && (
                                                    <p className="text-stone-500 dark:text-slate-400 text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">
                                                        {event.description}
                                                    </p>
                                                )}

                                                {/* Meta Info */}
                                                <div className="space-y-3 pt-4 border-t border-stone-100 dark:border-slate-700/50 text-sm">

                                                    {/* Location */}
                                                    <div className="flex items-start gap-3 text-stone-600 dark:text-slate-300">
                                                        <MapPin className="w-4 h-4 text-orange-500 dark:text-cyan-500 mt-0.5 shrink-0" />
                                                        <span className="font-medium line-clamp-1">{event.location || 'Kampoeng Semarang'}</span>
                                                    </div>

                                                    {/* Time (Start - End) */}
                                                    <div className="flex items-center gap-3 text-stone-600 dark:text-slate-300">
                                                        <Clock className="w-4 h-4 text-orange-500 dark:text-cyan-500 shrink-0" />
                                                        <time className="font-medium">
                                                            {event.start_time ? event.start_time.slice(0, 5) : '09:00'} WIB
                                                            {event.end_date && ` - ${formatDate(event.end_date)}`}
                                                        </time>
                                                    </div>
                                                </div>

                                                {/* Footer Action */}
                                                <div className="mt-6 flex items-center justify-between">
                                                    <span className="text-xs font-bold uppercase tracking-wide text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">
                                                        Lihat Detail
                                                    </span>
                                                    <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-orange-500 dark:group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                                                        <ArrowRight size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    )
}

// --- SUB-COMPONENTS ---

const EventSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden border border-stone-200 dark:border-slate-700 h-full animate-pulse">
        <div className="h-64 bg-stone-200 dark:bg-slate-700 w-full relative">
            <div className="absolute top-4 left-4 w-16 h-20 bg-white/50 dark:bg-slate-600/50 rounded-2xl"></div>
        </div>
        <div className="p-6">
            <div className="h-6 bg-stone-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-stone-200 dark:bg-slate-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-stone-200 dark:bg-slate-700 rounded w-2/3 mb-6"></div>
            <div className="border-t border-stone-100 dark:border-slate-700 pt-4 space-y-3">
                <div className="h-4 bg-stone-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-4 bg-stone-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
        </div>
    </div>
)

const EmptyState = ({ reset }: { reset: () => void }) => (
    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-stone-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Calendar className="text-stone-400 dark:text-slate-500 w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Tidak ada agenda</h3>
        <p className="text-stone-500 dark:text-slate-400 mb-6 max-w-md">
            Belum ada acara yang sesuai dengan filter yang Anda pilih saat ini.
        </p>
        <button
            onClick={reset}
            className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
        >
            Lihat Semua Agenda
        </button>
    </div>
)
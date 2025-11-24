"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
    ArrowLeft, Calendar, Clock, MapPin, Share2,
    CalendarPlus, CheckCircle2, AlertCircle
} from 'lucide-react'
import { Event } from '@/types'

// --- UTILS ---
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    }) + ' WIB'
}

const getEventStatus = (start: string, end?: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date(start);
    endDate.setHours(23, 59, 59);

    if (now > endDate) return 'ended';
    if (now >= startDate && now <= endDate) return 'live';
    return 'upcoming';
}

export default function EventDetailPage() {
    const params = useParams()
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)
    const [isCopied, setIsCopied] = useState(false)

    useEffect(() => {
        if (params.id) fetchEvent(params.id as string)
    }, [params.id])

    const fetchEvent = async (id: string) => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            setEvent(data)
        } catch (error) {
            console.error('Error fetching event:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleShare = () => {
        const url = window.location.href
        if (navigator.share) {
            navigator.share({ title: event?.title, url })
        } else {
            navigator.clipboard.writeText(url)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        }
    }

    const handleAddToCalendar = () => {
        if (!event) return;
        // Simulasi link Google Calendar
        const text = encodeURIComponent(event.title);
        const dates = new Date(event.start_date).toISOString().replace(/-|:|\.\d\d\d/g, "");
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}/${dates}`;
        window.open(url, '_blank');
    }

    if (loading) return <EventSkeleton />
    if (!event) return <NotFoundState />

    const status = getEventStatus(event.start_date, event.end_date)

    return (
        <main className="min-h-screen bg-[#F9F5F1] dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 transition-colors duration-500 selection:bg-orange-200 dark:selection:bg-cyan-900 font-sans">
            <Navbar />

            {/* --- BACKGROUND FX --- */}
            <div className="fixed inset-0 opacity-[0.4] dark:opacity-[0.1] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply dark:mix-blend-overlay z-0"></div>

            {/* --- HERO HEADER --- */}
            <div className="relative z-10 pt-32 pb-12 border-b border-stone-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                    {/* Breadcrumb */}
                    <Link
                        href="/events"
                        className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-cyan-400 transition-colors uppercase tracking-wider mb-8"
                    >
                        <ArrowLeft size={14} /> Kembali ke Agenda
                    </Link>

                    <div className="flex flex-col gap-4 max-w-4xl">
                        {/* Status Badge */}
                        <div className="flex items-center gap-3">
                            {status === 'upcoming' && <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-bold uppercase tracking-widest border border-blue-200 dark:border-blue-700">Akan Datang</span>}
                            {status === 'live' && <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs font-bold uppercase tracking-widest border border-green-200 dark:border-green-700 animate-pulse">Sedang Berlangsung</span>}
                            {status === 'ended' && <span className="px-3 py-1 rounded-full bg-stone-200 dark:bg-slate-800 text-stone-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest border border-stone-300 dark:border-slate-700">Selesai</span>}

                            <span className="text-stone-400 dark:text-slate-500 text-sm font-medium px-2 border-l border-stone-300 dark:border-slate-700">
                                {event.category || 'Event Umum'}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
                            {event.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT GRID --- */}
            <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 max-w-7xl">
                <div className="grid lg:grid-cols-12 gap-12">

                    {/* LEFT COLUMN: IMAGE & DESCRIPTION (Span 8) */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* Hero Image */}
                        <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden bg-stone-200 dark:bg-slate-800 shadow-xl">
                            {event.image_url ? (
                                <Image
                                    src={event.image_url}
                                    alt={event.title}
                                    fill
                                    className={`object-cover ${status === 'ended' ? 'grayscale' : ''}`}
                                    priority
                                    sizes="(max-width: 768px) 100vw, 70vw"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-400 dark:text-slate-600">
                                    <Calendar size={64} strokeWidth={1} />
                                </div>
                            )}
                        </div>

                        {/* Description Prose */}
                        <article className="prose prose-lg prose-stone dark:prose-invert max-w-none">
                            <h3 className="font-serif font-bold text-2xl">Tentang Acara Ini</h3>
                            <div className="whitespace-pre-wrap leading-relaxed text-stone-600 dark:text-slate-300">
                                {event.description || "Belum ada deskripsi detail untuk acara ini."}
                            </div>
                        </article>

                        {/* Organizer / Additional Info (Example) */}
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700">
                            <h4 className="font-bold mb-2 text-sm uppercase tracking-wide text-stone-500 dark:text-slate-400">Penyelenggara</h4>
                            <p className="font-serif text-xl font-bold text-slate-900 dark:text-white">Kampoeng Semarang Official</p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: STICKY INFO CARD (Span 4) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28 flex flex-col gap-6">

                            {/* Ticket / Info Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-stone-200/50 dark:shadow-black/50 border border-stone-200 dark:border-slate-800">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold">Detail Jadwal</h3>
                                    <button
                                        onClick={handleShare}
                                        className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-400 hover:text-orange-600 transition-colors relative group"
                                        title="Share Event"
                                    >
                                        {isCopied ? <CheckCircle2 size={20} className="text-green-500" /> : <Share2 size={20} />}
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Date */}
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-slate-800 flex items-center justify-center text-orange-600 dark:text-cyan-500 shrink-0">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-stone-500 dark:text-slate-400 mb-1">Tanggal</p>
                                            <p className="font-medium text-slate-900 dark:text-white">{formatDate(event.start_date)}</p>
                                            {event.end_date && (
                                                <p className="text-sm text-stone-500 dark:text-slate-400 mt-1">
                                                    sampai {formatDate(event.end_date)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-stone-500 dark:text-slate-400 mb-1">Waktu</p>
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {event.start_time ? `${event.start_time.slice(0, 5)} WIB` : formatTime(event.start_date)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-stone-500 dark:text-slate-400 mb-1">Lokasi</p>
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {event.location || 'Kampoeng Semarang'}
                                            </p>
                                            <a
                                                href={`https://maps.google.com/?q=${event.location || 'Kampoeng Semarang'}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-orange-600 dark:text-cyan-400 hover:underline mt-1 inline-block"
                                            >
                                                Lihat di Peta
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="my-8 border-t border-dashed border-stone-200 dark:border-slate-700"></div>

                                {/* CTA Actions */}
                                <div className="space-y-3">
                                    {status !== 'ended' ? (
                                        <>
                                            <Link
                                                href="/contact"
                                                className="block w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-center font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
                                            >
                                                Hubungi Kami
                                            </Link>
                                            <button
                                                onClick={handleAddToCalendar}
                                                className="block w-full py-3.5 bg-transparent border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-200 text-center font-bold rounded-xl hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <CalendarPlus size={18} />
                                                Add to Calendar
                                            </button>
                                        </>
                                    ) : (
                                        <div className="w-full py-3.5 bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-slate-400 text-center font-bold rounded-xl border border-stone-200 dark:border-slate-700 flex items-center justify-center gap-2 cursor-not-allowed">
                                            <AlertCircle size={18} />
                                            Event Telah Berakhir
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mini Map Placeholder (Optional Enhancement) */}
                            <div className="h-32 w-full rounded-2xl bg-stone-200 dark:bg-slate-800 overflow-hidden relative group cursor-pointer">
                                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                    <span className="px-3 py-1 bg-white/80 backdrop-blur text-xs font-bold rounded-full shadow-sm">Buka Google Maps</span>
                                </div>
                                {/* Idealnya gunakan Google Maps Embed API disini */}
                                <div className="absolute inset-0 bg-[url('https://assets.website-files.com/5e832e12eb7ca02ee9064d42/5f7db426b676b95755fb2844_Map%20Placeholder.jpg')] bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity"></div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    )
}

// --- SUB COMPONENTS ---

const EventSkeleton = () => (
    <div className="min-h-screen bg-[#F9F5F1] dark:bg-[#0F172A] pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-7xl animate-pulse">
            <div className="h-4 w-32 bg-stone-200 dark:bg-slate-800 rounded mb-8"></div>
            <div className="h-16 w-3/4 bg-stone-200 dark:bg-slate-800 rounded mb-12"></div>
            <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                    <div className="aspect-video bg-stone-200 dark:bg-slate-800 rounded-[2rem] mb-8"></div>
                    <div className="space-y-4">
                        <div className="h-4 w-full bg-stone-200 dark:bg-slate-800 rounded"></div>
                        <div className="h-4 w-5/6 bg-stone-200 dark:bg-slate-800 rounded"></div>
                        <div className="h-4 w-full bg-stone-200 dark:bg-slate-800 rounded"></div>
                    </div>
                </div>
                <div className="lg:col-span-4">
                    <div className="h-96 bg-stone-200 dark:bg-slate-800 rounded-3xl"></div>
                </div>
            </div>
        </div>
    </div>
)

const NotFoundState = () => (
    <main className="min-h-screen bg-[#F9F5F1] dark:bg-[#0F172A] flex flex-col items-center justify-center text-center p-4">
        <div className="w-24 h-24 bg-stone-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <Calendar size={40} className="text-stone-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Acara Tidak Ditemukan</h1>
        <p className="text-stone-500 mb-8">Mungkin acara telah dihapus atau link yang Anda tuju salah.</p>
        <Link href="/events" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:opacity-90">
            Kembali ke Agenda
        </Link>
    </main>
)
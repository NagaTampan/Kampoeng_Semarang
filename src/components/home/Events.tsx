"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Calendar, MapPin, ArrowRight, Clock, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Event } from '@/types'

gsap.registerPlugin(ScrollTrigger)

// Helper function untuk format tanggal
const getDateParts = (dateString: string) => {
    const date = new Date(dateString);
    return {
        day: date.toLocaleDateString('id-ID', { day: '2-digit' }),
        month: date.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase(),
        year: date.getFullYear()
    }
}

export default function Events() {
    const sectionRef = useRef<HTMLElement>(null)
    const blob1Ref = useRef<HTMLDivElement>(null)
    const blob2Ref = useRef<HTMLDivElement>(null)
    const blob3Ref = useRef<HTMLDivElement>(null)

    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFeaturedEvents = async () => {
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('is_featured', true)
                    .order('start_date', { ascending: true })
                    .limit(2)

                if (error) {
                    console.error('Supabase error:', error)
                    throw error
                }
                setEvents(data || [])
            } catch (error) {
                console.error('Error fetching featured events:', error)
                // Set empty array on error so component still renders
                setEvents([])
            } finally {
                setLoading(false)
            }
        }

        fetchFeaturedEvents()
    }, [])

    useEffect(() => {
        if (loading || events.length === 0) return

        const ctx = gsap.context(() => {
            // Background Animation
            const floatAnim = (target: any, duration: number, delay: number) => {
                gsap.to(target, {
                    x: "random(-100, 100)",
                    y: "random(-50, 50)",
                    scale: "random(0.8, 1.2)",
                    rotation: "random(-20, 20)",
                    duration: duration,
                    delay: delay,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                })
            }

            floatAnim(blob1Ref.current, 10, 0)
            floatAnim(blob2Ref.current, 15, 1)
            floatAnim(blob3Ref.current, 12, 2)

            // Header Animation
            gsap.from(".event-header-anim", {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".event-header-wrapper",
                    start: "top 85%",
                }
            })

            // Card Animation
            const cards = gsap.utils.toArray<HTMLElement>(".event-card")
            cards.forEach((card) => {
                gsap.fromTo(card,
                    { x: -50, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                        }
                    }
                )
            })

        }, sectionRef)

        return () => ctx.revert()
    }, [loading, events])

    return (
        <section
            ref={sectionRef}
            className="relative py-24 overflow-hidden bg-[#0F172A] text-slate-200"
        >
            {/* --- ANIMATED BACKGROUND SHAPES --- */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div ref={blob1Ref} className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-cyan-900/30 rounded-full blur-[100px] mix-blend-screen" />
                <div ref={blob2Ref} className="absolute -bottom-[10%] -left-[10%] w-[700px] h-[700px] bg-indigo-900/30 rounded-full blur-[120px] mix-blend-screen" />
                <div ref={blob3Ref} className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[90px] mix-blend-screen" />
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* --- HEADER --- */}
                <div className="event-header-wrapper flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-slate-700/50 pb-8">
                    <div className="max-w-2xl">
                        <div className="event-header-anim flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                            <span className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-xs shadow-glow">
                                Event Pilihan
                            </span>
                        </div>
                        <h2 className="event-header-anim font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
                            Agenda Budaya<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
                                & Updates Terbaru
                            </span>
                        </h2>
                    </div>

                    <Link href="/events" className="event-header-anim">
                        <button className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-full border border-slate-600 hover:border-cyan-500 transition-colors duration-300">
                            <div className="absolute inset-0 w-0 bg-gradient-to-r from-cyan-600 to-blue-600 transition-all duration-[250ms] ease-out group-hover:w-full opacity-20"></div>
                            <span className="relative flex items-center gap-2 font-semibold text-slate-300 group-hover:text-white transition-colors">
                                Lihat Semua Event
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </button>
                    </Link>
                </div>

                {/* --- EVENT LIST --- */}
                <div className="flex flex-col gap-8">
                    {loading ? (
                        [...Array(2)].map((_, i) => (
                            <div key={i} className="rounded-[2rem] border border-slate-700/50 bg-slate-800/20 h-[280px] animate-pulse"></div>
                        ))
                    ) : events.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 mx-auto text-slate-500 mb-4" />
                            <p className="text-slate-400">Belum ada event unggulan</p>
                        </div>
                    ) : events.map((event) => {
                        const dateParts = getDateParts(event.start_date)

                        return (
                            <div
                                key={event.id}
                                className="event-card group relative overflow-hidden rounded-[2rem] border border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/40 backdrop-blur-md transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)]"
                            >
                                <div className="flex flex-col md:flex-row min-h-[280px]">

                                    {/* 1. DATE SECTION */}
                                    <div className="md:w-[180px] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 p-6 flex flex-row md:flex-col items-center justify-center gap-2 md:gap-4 border-b md:border-b-0 md:border-r border-slate-700/50 relative group-hover:from-cyan-950/30 group-hover:to-slate-900 transition-colors duration-500">
                                        <span className="text-xs font-bold tracking-[0.2em] text-cyan-500 uppercase rotate-0 md:-rotate-90 whitespace-nowrap md:absolute md:left-4 md:top-1/2 md:-translate-y-1/2 md:-translate-x-1/2">
                                            {dateParts.month} {dateParts.year}
                                        </span>
                                        <span className="text-6xl md:text-7xl font-serif font-bold text-white md:ml-6 group-hover:scale-110 transition-transform duration-500">
                                            {dateParts.day}
                                        </span>
                                    </div>

                                    {/* 2. CONTENT SECTION */}
                                    <div className="flex-1 p-8 flex flex-col justify-center relative z-10">
                                        <div className="w-fit mb-4 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                                            {event.category || 'Event'}
                                        </div>

                                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                                            {event.title}
                                        </h3>

                                        <p className="text-slate-400 mb-6 font-light leading-relaxed max-w-xl line-clamp-2">
                                            {event.description || 'Bergabunglah dengan kami untuk pengalaman budaya yang tak terlupakan.'}
                                        </p>

                                        <div className="flex flex-wrap gap-6 text-sm text-slate-400">
                                            <div className="flex items-center gap-2 group-hover:text-cyan-200 transition-colors">
                                                <Clock className="w-4 h-4 text-cyan-500" />
                                                <span>{event.start_time ? `${event.start_time.slice(0, 5)} WIB` : '09:00 WIB'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 group-hover:text-cyan-200 transition-colors">
                                                <MapPin className="w-4 h-4 text-cyan-500" />
                                                <span>{event.location || 'Kampoeng Semarang'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. IMAGE SECTION */}
                                    <div className="md:w-[400px] relative h-56 md:h-auto overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#0F172A] via-transparent to-transparent z-10 pointer-events-none"></div>

                                        {event.image_url ? (
                                            <Image
                                                src={event.image_url}
                                                alt={event.title}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-60 group-hover:opacity-100"
                                                sizes="(max-width: 768px) 100vw, 30vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                                                <Calendar size={64} />
                                            </div>
                                        )}

                                        <div className="absolute bottom-6 right-6 z-20 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                            <Link href={`/events/${event.id}`} className="flex items-center gap-2 text-white font-bold text-sm bg-cyan-600/80 backdrop-blur-md px-4 py-2 rounded-full hover:bg-cyan-500">
                                                Details
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
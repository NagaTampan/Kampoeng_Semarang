"use client"

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Phone, Clock, ArrowUpRight } from 'lucide-react'

// Register plugin
gsap.registerPlugin(ScrollTrigger)

const outlets = [
    {
        id: 1,
        name: "Kampoeng Semarang Pusat",
        category: "Main Gallery & Souvenir",
        address: "Jl. Raya Kaligawe Km.1 No.96, Semarang",
        phone: "(024) 6580015",
        hours: "08:00 - 21:00 WIB",
        map_url: "https://goo.gl/maps/example1",
        image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Webe Bags",
        category: "Bag",
        address: "Jl. Raya Kaligawe Km.1 No.96, Semarang",
        phone: "(024) 6580015",
        hours: "08:00 - 21:00 WIB",
        map_url: "https://goo.gl/maps/example1",
        image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop"
    }
]

export default function Outlets() {
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {

            // 1. Animasi Judul (Tetap sama)
            gsap.from(".animate-title", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".title-wrapper",
                    start: "top 90%", // Muncul lebih cepat
                }
            })

            // 2. Animasi Kartu (PERBAIKAN: LOOPING INDIVIDUAL)
            // Alih-alih satu animasi besar, kita loop setiap kartu.
            // Ini menjamin setiap kartu punya trigger sendiri.
            const cards = gsap.utils.toArray<HTMLElement>('.outlet-card')

            cards.forEach((card, i) => {
                gsap.fromTo(card,
                    {
                        opacity: 0,
                        y: 50 // Jarak geser dikurangi biar lebih cepat sampai posisi asli
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6, // Durasi dipercepat (sebelumnya 1.2s terlalu lama)
                        delay: i * 0.1, // Delay statis kecil (0.1s) agar tetap ada efek urutan tapi sangat cepat
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card, // Trigger adalah kartu itu sendiri!
                            start: "top 95%", // Begitu pucuk kartu masuk layar, langsung animasi
                            toggleActions: "play none none reverse"
                        }
                    }
                )
            })

        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            className="relative py-24 bg-white dark:bg-emerald-950 transition-colors duration-500 overflow-hidden"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* --- HEADER --- */}
                <div className="title-wrapper text-center mb-16 max-w-3xl mx-auto">
                    <div className="animate-title inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold tracking-wider uppercase">
                        <MapPin size={14} />
                        Destinasi Kami
                    </div>

                    <h2 className="animate-title font-serif text-4xl md:text-5xl font-bold mb-6 text-emerald-950 dark:text-white">
                        Temukan Kami di <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-500 dark:from-yellow-300 dark:to-yellow-500">
                            Pusat Semarang
                        </span>
                    </h2>

                    <p className="animate-title text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        Kunjungi lokasi strategis kami. Rasakan keramahan otentik dan suasana yang tak terlupakan di setiap sudutnya. Kami adalah destinasi One Stop Shopping & Leisure terbesar di Semarang.
                    </p>
                </div>

                {/* --- CARDS GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {outlets.map((outlet) => (
                        <div
                            key={outlet.id}
                            // Class 'outlet-card' digunakan di loop JS di atas
                            className="outlet-card group relative bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] overflow-hidden hover:border-yellow-500 dark:hover:border-yellow-500 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-yellow-500/10"
                        >
                            {/* --- IMAGE --- */}
                            <div className="relative h-72 w-full overflow-hidden">
                                <div className="absolute top-4 left-4 z-20 px-4 py-1.5 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-emerald-900 dark:text-yellow-400 shadow-lg">
                                    {outlet.category}
                                </div>

                                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse -z-10" />

                                <Image
                                    src={outlet.image_url}
                                    alt={outlet.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                            </div>

                            {/* --- CONTENT --- */}
                            <div className="p-8 relative">
                                <div className="absolute top-0 right-8 -translate-y-1/2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 text-emerald-950 z-10">
                                    <MapPin size={24} />
                                </div>

                                <h3 className="text-2xl font-serif font-bold mb-2 text-emerald-950 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-yellow-400 transition-colors">
                                    {outlet.name}
                                </h3>

                                <p className="text-gray-500 dark:text-gray-400 mb-6 border-l-2 border-yellow-500 pl-3 line-clamp-2">
                                    {outlet.address}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                                        <Phone className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                        <span>{outlet.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                                        <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                        <span>{outlet.hours}</span>
                                    </div>
                                </div>

                                <Link
                                    href={outlet.map_url}
                                    target="_blank"
                                    className="block w-full"
                                >
                                    <button className="w-full py-4 rounded-xl bg-emerald-900 dark:bg-white text-white dark:text-emerald-950 font-bold flex items-center justify-center gap-2 group-hover:bg-yellow-500 dark:group-hover:bg-yellow-400 group-hover:text-emerald-950 transition-all duration-300 shadow-md">
                                        Buka Google Maps
                                        <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}
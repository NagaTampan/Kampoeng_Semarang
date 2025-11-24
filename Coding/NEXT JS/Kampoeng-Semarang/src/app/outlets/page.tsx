"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { MapPin, Phone, ExternalLink, Compass, Clock, ArrowRight } from 'lucide-react'
import { Outlet } from '@/types'

export default function OutletsPage() {
    const [outlets, setOutlets] = useState<Outlet[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOutlets()
    }, [])

    const fetchOutlets = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('outlets')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setOutlets(data || [])
        } catch (error) {
            console.error('Error fetching outlets:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#ECFDF5] dark:bg-[#022C22] text-slate-800 dark:text-emerald-50 transition-colors duration-500 font-sans selection:bg-emerald-200 dark:selection:bg-emerald-800">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Texture (Emerald Flow) */}
                <div className="absolute inset-0 opacity-[0.6] dark:opacity-[0.2] pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-200/50 via-transparent to-transparent"></div>
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-widest shadow-sm">
                        <Compass size={14} />
                        Lokasi Kami
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-emerald-950 dark:text-white leading-tight">
                        Jelajahi <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Destinasi</span>
                    </h1>
                    <p className="text-xl text-emerald-800/70 dark:text-emerald-200/70 max-w-2xl leading-relaxed">
                        Kunjungi outlet kami yang tersebar di titik strategis Semarang. Rasakan pengalaman belanja yang nyaman dengan nuansa khas Jawa.
                    </p>
                </div>
            </section>

            {/* --- OUTLETS GRID --- */}
            <section className="px-6 pb-24">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-emerald-900/20 rounded-[2rem] h-[450px] border border-emerald-100 dark:border-emerald-800 animate-pulse" />
                            ))}
                        </div>
                    ) : outlets.length === 0 ? (
                        <div className="text-center py-20 bg-white/50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-800">
                            <MapPin className="w-16 h-16 mx-auto text-emerald-300 mb-4" />
                            <p className="text-2xl font-serif font-bold text-emerald-900 dark:text-white">Belum ada lokasi</p>
                            <p className="text-emerald-600 dark:text-emerald-400 mt-2">Silakan cek kembali nanti untuk pembaruan lokasi.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {outlets.map((outlet) => (
                                <div
                                    key={outlet.id}
                                    className="group relative bg-white dark:bg-[#064E3B] rounded-[2rem] overflow-hidden border border-emerald-100 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-200/50 dark:hover:shadow-black/40 hover:-translate-y-2 flex flex-col"
                                >
                                    {/* Image Container */}
                                    <div className="relative h-64 w-full overflow-hidden bg-emerald-100 dark:bg-emerald-900">
                                        {outlet.image_url ? (
                                            <Image
                                                src={outlet.image_url}
                                                alt={outlet.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-emerald-400 dark:text-emerald-700">
                                                <MapPin className="w-12 h-12 mb-2 opacity-50" />
                                                <span className="text-xs font-bold uppercase tracking-widest">Kampoeng Semarang</span>
                                            </div>
                                        )}

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                                        {/* Floating Badge */}
                                        <div className="absolute bottom-4 left-4">
                                            <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                                                Buka Setiap Hari
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-serif font-bold mb-4 text-emerald-950 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                                            {outlet.name}
                                        </h3>

                                        <div className="space-y-5 mb-8 flex-1">
                                            {/* Address */}
                                            <div className="flex items-start gap-4 group/icon">
                                                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover/icon:bg-emerald-600 group-hover/icon:text-white transition-colors duration-300">
                                                    <MapPin size={18} />
                                                </div>
                                                <p className="text-sm text-emerald-800/80 dark:text-emerald-100/70 leading-relaxed pt-1">
                                                    {outlet.address}
                                                </p>
                                            </div>

                                            {/* Phone */}
                                            {outlet.phone && (
                                                <div className="flex items-center gap-4 group/icon">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover/icon:bg-emerald-600 group-hover/icon:text-white transition-colors duration-300">
                                                        <Phone size={18} />
                                                    </div>
                                                    <a href={`tel:${outlet.phone}`} className="text-sm font-medium text-emerald-900 dark:text-emerald-100 hover:text-emerald-600 transition-colors">
                                                        {outlet.phone}
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        {outlet.map_url && (
                                            <a
                                                href={outlet.map_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-auto w-full py-3.5 rounded-xl bg-emerald-900 dark:bg-white text-white dark:text-emerald-950 font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-200 transition-all shadow-md hover:shadow-lg"
                                            >
                                                <span>Buka di Google Maps</span>
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* --- INFO BANNER (Replacing Empty Map) --- */}
            {outlets.length > 0 && (
                <section className="px-6 pb-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative bg-emerald-900 rounded-[2.5rem] p-8 md:p-12 overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-emerald-900/30">
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3"></div>
                            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal-500/20 rounded-full blur-[60px] -translate-x-1/3 translate-y-1/3"></div>

                            <div className="relative z-10 max-w-2xl">
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                                    Kemudahan Akses & Parkir Luas
                                </h2>
                                <p className="text-emerald-100/80 text-lg leading-relaxed">
                                    Seluruh outlet kami dilengkapi dengan area parkir yang luas untuk bus pariwisata dan kendaraan pribadi. Lokasi strategis dekat dengan pintu tol dan pusat kota.
                                </p>
                            </div>

                            <div className="relative z-10 shrink-0">
                                <div className="w-20 h-20 bg-emerald-800 rounded-full flex items-center justify-center border border-emerald-700 animate-bounce">
                                    <MapPin className="w-8 h-8 text-emerald-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </main>
    )
}
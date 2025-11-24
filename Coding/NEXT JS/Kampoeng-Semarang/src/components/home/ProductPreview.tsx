"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowUpRight, Tag, Sparkles, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Product } from '@/types'

gsap.registerPlugin(ScrollTrigger)

export default function ProductPreview() {
    const sectionRef = useRef<HTMLElement>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_featured', true)
                    .order('created_at', { ascending: false })
                    .limit(4)

                if (error) throw error
                setProducts(data || [])
            } catch (error) {
                console.error('Error fetching featured products:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchFeaturedProducts()
    }, [])

    useEffect(() => {
        if (loading || products.length === 0) return

        const ctx = gsap.context(() => {
            gsap.from(".prod-header", {
                y: 30, opacity: 0, duration: 0.8, ease: "power2.out",
                scrollTrigger: { trigger: ".prod-header", start: "top 90%" }
            })
            gsap.from(".prod-card", {
                y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out",
                scrollTrigger: { trigger: ".prod-grid", start: "top 85%" }
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [loading, products])

    return (
        <section
            ref={sectionRef}
            className="relative py-24 overflow-hidden transition-colors duration-500 bg-[#F9F5F1] dark:bg-[#0F172A]"
        >
            {/* --- UNIQUE BACKGROUND: NOISE TEXTURE --- */}
            <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15] pointer-events-none mix-blend-multiply dark:mix-blend-overlay">
                <svg className='w-full h-full'>
                    <filter id='noiseFilter'>
                        <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch' />
                    </filter>
                    <rect width='100%' height='100%' filter='url(#noiseFilter)' />
                </svg>
            </div>

            {/* 2. Soft Gradient Blobs (Pewarnaan Atmosfer) */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 dark:hidden"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4"></div>

            <div className="container relative z-10 mx-auto px-4 md:px-6">

                {/* --- HEADER --- */}
                <div className="prod-header flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-orange-600 dark:text-yellow-400" />
                            <span className="text-orange-800 dark:text-indigo-200 font-bold uppercase tracking-[0.2em] text-xs">
                                Produk Unggulan
                            </span>
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Produk <span className="text-orange-700 dark:text-indigo-400 italic font-serif">Terpilih</span> Minggu Ini
                        </h2>
                    </div>

                    <Link
                        href="/products"
                        className="group hidden md:flex items-center gap-2 text-gray-600 dark:text-slate-300 font-medium text-sm hover:text-orange-700 dark:hover:text-white transition-colors"
                    >
                        <span>Lihat Semua Produk</span>
                        <div className="w-8 h-[1px] bg-gray-300 dark:bg-slate-600 group-hover:bg-orange-600 dark:group-hover:bg-white transition-colors"></div>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* --- PRODUCT GRID --- */}
                <div className="prod-grid flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 md:pb-0 scrollbar-hide">

                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="min-w-[260px] md:min-w-0 snap-center animate-pulse">
                                <div className="aspect-[3/4] rounded-[1.5rem] bg-stone-200 dark:bg-slate-800"></div>
                            </div>
                        ))
                    ) : products.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <ShoppingBag className="w-12 h-12 mx-auto text-stone-400 mb-4" />
                            <p className="text-stone-500 dark:text-slate-400">Belum ada produk unggulan</p>
                        </div>
                    ) : products.map((product) => (
                        <Link
                            href={`/products/${product.id}`}
                            key={product.id}
                            className="prod-card group relative min-w-[260px] md:min-w-0 snap-center cursor-pointer"
                        >
                            {/* Card Container */}
                            <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-orange-900/10 dark:hover:shadow-indigo-500/20 transition-all duration-500 bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-white/5">

                                {/* Badge Kategori */}
                                <div className="absolute top-4 left-4 z-20">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-white/40 dark:border-slate-700/50 rounded-full text-[10px] font-bold text-stone-800 dark:text-slate-200 uppercase tracking-wider shadow-sm">
                                        <Tag size={10} className="text-orange-600 dark:text-indigo-400" />
                                        {product.category}
                                    </div>
                                </div>

                                {/* Image */}
                                {product.image_url ? (
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-stone-200 dark:bg-slate-700 text-stone-400">
                                        <ShoppingBag size={48} />
                                    </div>
                                )}

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                {/* --- CONTENT --- */}
                                <div className="absolute bottom-0 left-0 w-full p-6 text-white transform transition-transform duration-500">
                                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="font-serif text-xl font-medium leading-tight mb-3 group-hover:text-orange-200 dark:group-hover:text-indigo-300 transition-colors line-clamp-2">
                                            {product.name}
                                        </h3>

                                        <div className="flex items-center justify-between border-t border-white/20 pt-3">
                                            <p className="font-medium text-stone-100">
                                                Rp {product.price?.toLocaleString('id-ID')}
                                            </p>
                                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                <ArrowUpRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* Mobile View All Button */}
                    <div className="md:hidden min-w-[150px] snap-center flex items-center justify-center">
                        <Link href="/products" className="flex flex-col items-center gap-3 text-stone-500 dark:text-slate-400">
                            <div className="w-14 h-14 rounded-full bg-stone-200 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 shadow-inner flex items-center justify-center">
                                <ArrowRight size={24} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest">Semua</span>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    )
}
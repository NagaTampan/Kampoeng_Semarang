"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ArrowLeft, Tag, Share2, ShieldCheck, ArrowUpRight, Truck, Check, MessageCircle } from 'lucide-react'
import { Product } from '@/types'

export default function ProductDetailPage() {
    const params = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    // State untuk fitur Share
    const [isCopied, setIsCopied] = useState(false)

    useEffect(() => {
        if (params.id) {
            fetchProduct(params.id as string)
        }
    }, [params.id])

    const fetchProduct = async (id: string) => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            setProduct(data)

            if (data) {
                const { data: related } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category', data.category)
                    .neq('id', id)
                    .limit(4)

                setRelatedProducts(related || [])
            }
        } catch (error) {
            console.error('Error fetching product:', error)
        } finally {
            setLoading(false)
        }
    }

    // --- FITUR SHARE (Native + Copy Fallback) ---
    const handleShare = async () => {
        const url = window.location.href
        const title = product?.name || 'Produk Kampoeng Semarang'

        // Cek apakah browser mendukung fitur Share Native (biasanya di HP)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Lihat produk ${title} di Kampoeng Semarang!`,
                    url: url,
                })
            } catch (error) {
                console.log('Error sharing:', error)
            }
        } else {
            // Fallback ke Copy Clipboard untuk Desktop
            try {
                await navigator.clipboard.writeText(url)
                setIsCopied(true)
                setTimeout(() => setIsCopied(false), 2000) // Reset icon setelah 2 detik
            } catch (err) {
                console.error('Failed to copy:', err)
            }
        }
    }

    // --- FITUR HUBUNGI TOKO (WhatsApp) ---
    const handleContactStore = () => {
        if (!product) return
        const phoneNumber = "6281234567890" // Ganti dengan nomor WA Toko asli
        const message = `Halo Kampoeng Semarang, saya tertarik dengan produk "${product.name}" yang ada di website. Apakah masih tersedia?`
        const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
        window.open(waUrl, '_blank')
    }

    if (loading) return <DetailSkeleton />
    if (!product) return <NotFoundState />

    return (
        <main className="min-h-screen bg-[#F9F5F1] dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 transition-colors duration-500 font-sans selection:bg-orange-200 dark:selection:bg-cyan-900">
            <Navbar />

            {/* Background FX */}
            <div className="fixed inset-0 opacity-[0.4] dark:opacity-[0.1] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply dark:mix-blend-overlay z-0"></div>
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-orange-300/20 dark:bg-cyan-900/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none z-0"></div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 py-32 max-w-7xl">

                {/* Breadcrumb */}
                <div className="mb-8">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-sm font-bold text-stone-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-cyan-400 transition-colors uppercase tracking-wider group"
                    >
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 flex items-center justify-center group-hover:border-orange-500 dark:group-hover:border-cyan-500 transition-colors">
                            <ArrowLeft size={14} />
                        </div>
                        Kembali ke Katalog
                    </Link>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 mb-24">

                    {/* --- LEFT: IMAGE (CLEAN - NO BADGES) --- */}
                    <div className="lg:col-span-7">
                        <div className="sticky top-24">
                            <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden bg-white dark:bg-slate-800 border-[8px] border-white dark:border-slate-800 shadow-2xl shadow-stone-300/50 dark:shadow-black/50 group">
                                {product.image_url ? (
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                        priority
                                        sizes="(max-width: 768px) 100vw, 60vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-stone-100 dark:bg-slate-900 text-stone-300 dark:text-slate-600">
                                        No Image Available
                                    </div>
                                )}
                            </div>

                            {/* Trust Signals */}
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-stone-100 dark:border-slate-700">
                                    <ShieldCheck className="text-orange-500 dark:text-cyan-400" />
                                    <div className="text-xs">
                                        <p className="font-bold text-stone-900 dark:text-white">100% Otentik</p>
                                        <p className="text-stone-500 dark:text-slate-400">Jaminan Asli</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-stone-100 dark:border-slate-700">
                                    <Truck className="text-orange-500 dark:text-cyan-400" />
                                    <div className="text-xs">
                                        <p className="font-bold text-stone-900 dark:text-white">Pengiriman Aman</p>
                                        <p className="text-stone-500 dark:text-slate-400">Ke Seluruh Indonesia</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT: INFO & ACTIONS --- */}
                    <div className="lg:col-span-5 flex flex-col h-full">
                        {/* Header */}
                        <div className="mb-8 border-b border-stone-200 dark:border-slate-700 pb-8">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2 text-orange-600 dark:text-cyan-500 font-bold text-xs uppercase tracking-widest">
                                    <Tag size={14} />
                                    <span>{product.category}</span>
                                </div>

                                {/* SHARE BUTTON (FUNCTIONAL) */}
                                <button
                                    onClick={handleShare}
                                    className="group relative p-2 rounded-full hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-400 hover:text-orange-600 dark:hover:text-cyan-400 transition-all"
                                    aria-label="Share product"
                                >
                                    {isCopied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}

                                    {/* Tooltip Link Copied */}
                                    <span className={`absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-[10px] rounded whitespace-nowrap transition-opacity ${isCopied ? 'opacity-100' : 'opacity-0'}`}>
                                        Link Disalin!
                                    </span>
                                </button>
                            </div>

                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6">
                                {product.name}
                            </h1>

                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-orange-600 dark:text-cyan-400">
                                    Rp {product.price?.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose prose-stone dark:prose-invert max-w-none mb-10 flex-grow">
                            <h3 className="text-lg font-bold font-serif mb-3 text-slate-900 dark:text-white">Tentang Produk</h3>
                            <p className="text-stone-600 dark:text-slate-300 leading-relaxed text-base">
                                {product.description || "Deskripsi detail produk ini sedang disiapkan. Silakan hubungi toko untuk informasi lebih lanjut."}
                            </p>
                        </div>

                        {/* SINGLE CTA BUTTON */}
                        <div className="mt-auto bg-white dark:bg-slate-800 p-6 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-xl shadow-stone-200/50 dark:shadow-black/20">
                            <button
                                onClick={handleContactStore}
                                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-lg text-center hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg"
                            >
                                <MessageCircle size={20} />
                                Hubungi Toko
                            </button>
                            <p className="text-[10px] text-center text-stone-400 dark:text-slate-500 mt-3">
                                Anda akan diarahkan ke WhatsApp admin Kampoeng Semarang.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- RELATED PRODUCTS (CONDITIONAL RENDERING) --- */}
                {relatedProducts.length > 0 && (
                    <section className="pt-16 border-t border-stone-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
                                Produk Sejenis
                            </h2>
                            <Link href="/products" className="group hidden md:flex items-center gap-2 text-sm font-bold text-orange-600 dark:text-cyan-400">
                                <span className="group-hover:underline underline-offset-4">Lihat Katalog</span>
                                <ArrowUpRight size={14} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((related) => (
                                <RelatedProductCard key={related.id} product={related} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <Footer />
        </main>
    )
}

// --- SUB-COMPONENTS ---

// Desain Baru Related Product: Lebih Clean & Minimalis (Tanpa Badge overlay)
const RelatedProductCard = ({ product }: { product: Product }) => (
    <Link href={`/products/${product.id}`} className="group block">
        <div className="flex flex-col bg-transparent rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-2">
            {/* Clean Image Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-200 dark:bg-slate-800 rounded-2xl shadow-md group-hover:shadow-xl transition-shadow duration-300">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">No Image</div>
                )}

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Minimalist Info */}
            <div className="pt-4 px-1">
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1 mb-1">
                    {product.name}
                </h3>
                <div className="flex items-center justify-between">
                    <p className="text-stone-500 dark:text-slate-400 text-sm font-medium">
                        Rp {product.price?.toLocaleString('id-ID')}
                    </p>
                    <div className="w-6 h-6 rounded-full bg-stone-100 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                        <ArrowUpRight size={12} className="text-slate-900 dark:text-white" />
                    </div>
                </div>
            </div>
        </div>
    </Link>
)

const DetailSkeleton = () => (
    <div className="min-h-screen bg-[#F9F5F1] dark:bg-[#0F172A] py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 animate-pulse">
            <div className="lg:col-span-7">
                <div className="aspect-square bg-stone-200 dark:bg-slate-800 rounded-[2rem]"></div>
            </div>
            <div className="lg:col-span-5 space-y-6">
                <div className="h-8 bg-stone-200 dark:bg-slate-800 w-1/4 rounded"></div>
                <div className="h-16 bg-stone-200 dark:bg-slate-800 w-3/4 rounded"></div>
                <div className="h-10 bg-stone-200 dark:bg-slate-800 w-1/3 rounded"></div>
                <div className="h-40 bg-stone-200 dark:bg-slate-800 w-full rounded"></div>
            </div>
        </div>
    </div>
)

const NotFoundState = () => (
    <main className="min-h-screen bg-[#F9F5F1] dark:bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">Produk Tidak Ditemukan</h1>
            <Link href="/products" className="text-orange-600 dark:text-cyan-400 hover:underline">Kembali ke Katalog</Link>
        </div>
    </main>
)
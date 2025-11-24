"use client"

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Search, X, ShoppingBag, Sparkles, ArrowUpRight, SlidersHorizontal } from 'lucide-react'
import { Product } from '@/types'

// --- UTILS & HOOKS ---

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value) }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const sanitizeInput = (input: string) => {
    return input.replace(/[^a-zA-Z0-9\s.,-]/g, "").trim();
}

const categories = ['All', 'Fashion', 'Food', 'Craft', 'Souvenir']

export default function ProductsPage() {
    // --- STATE ---
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const debouncedSearch = useDebounce(searchQuery, 300)

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('is_featured', { ascending: false })
                    .order('created_at', { ascending: false })

                if (error) throw error
                setProducts(data || [])
            } catch (error) {
                console.error('Fetch error:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    // --- FILTER LOGIC ---
    const filteredProducts = useMemo(() => {
        let result = products

        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category === selectedCategory)
        }

        if (debouncedSearch) {
            const cleanQuery = sanitizeInput(debouncedSearch).toLowerCase()
            result = result.filter(p =>
                p.name.toLowerCase().includes(cleanQuery) ||
                p.description?.toLowerCase().includes(cleanQuery)
            )
        }

        return result
    }, [products, selectedCategory, debouncedSearch])

    return (
        <main className="min-h-screen bg-[#F9F5F1] dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 transition-colors duration-500 font-sans selection:bg-orange-200 dark:selection:bg-cyan-900">
            <Navbar />

            {/* --- HERO HEADER --- */}
            <section className="relative pt-32 pb-16 px-6">
                <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply dark:mix-blend-overlay"></div>
                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="flex flex-col items-start gap-4">
                        <span className="px-4 py-1.5 rounded-full border border-stone-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-xs font-bold uppercase tracking-widest text-orange-700 dark:text-cyan-400 flex items-center gap-2">
                            <Sparkles size={12} /> Katalog 2025
                        </span>
                        <h1 className="font-serif text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Temukan <span className="italic text-orange-600 dark:text-cyan-500 font-light">Produk</span>
                        </h1>
                    </div>
                </div>
            </section>

            {/* --- FILTER BAR --- */}
            <div className="sticky top-24 z-40 px-4 md:px-6 mb-12 pointer-events-none">
                <div className="container mx-auto max-w-7xl">
                    <div className="pointer-events-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-xl shadow-stone-200/50 dark:shadow-black/50 p-2 flex flex-col md:flex-row gap-3 md:items-center justify-between transition-all duration-300">
                        {/* Desktop Categories */}
                        <div className="hidden md:flex items-center bg-stone-100 dark:bg-slate-800 rounded-xl p-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`
                                        px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                                        ${selectedCategory === cat
                                            ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-cyan-400 shadow-sm'
                                            : 'text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
                                        }
                                    `}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Toggle */}
                        <div className="md:hidden flex gap-2">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${isFilterOpen ? 'bg-orange-600 text-white' : 'bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300'}`}
                            >
                                <SlidersHorizontal size={16} /> Filter
                            </button>
                        </div>

                        {/* Search */}
                        <div className="flex-1 md:max-w-xs">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-orange-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Cari produk..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 bg-stone-50 dark:bg-slate-800 border-2 border-transparent focus:border-orange-500/20 dark:focus:border-cyan-500/20 rounded-xl text-sm font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-stone-400"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-stone-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <X size={12} className="text-stone-500" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Category Drawer */}
                    <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isFilterOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                        <div className="pointer-events-auto bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-700 p-2 shadow-lg flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => { setSelectedCategory(cat); setIsFilterOpen(false) }}
                                    className={`
                                        px-4 py-2 rounded-lg text-xs font-bold border transition-all
                                        ${selectedCategory === cat
                                            ? 'bg-orange-50 dark:bg-cyan-900/20 border-orange-200 dark:border-cyan-800 text-orange-700 dark:text-cyan-400'
                                            : 'bg-transparent border-transparent text-stone-500 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800'
                                        }
                                    `}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- PRODUCT GRID --- */}
            <section className="px-4 md:px-6 pb-24 min-h-[60vh]">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex justify-between items-end mb-8 border-b border-stone-200 dark:border-slate-800 pb-4">
                        <p className="text-sm font-medium text-stone-500 dark:text-slate-400">
                            Menampilkan <span className="text-stone-900 dark:text-white font-bold">{filteredProducts.length}</span> hasil
                        </p>
                        {loading && <LoaderSkeletonSmall />}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <EmptyState reset={() => { setSearchQuery(''); setSelectedCategory('All') }} />
                    ) : (
                        // Menggunakan 'items-stretch' agar kartu punya tinggi yang sama dalam satu baris
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    )
}

// --- SUB-COMPONENTS ---

const ProductCard = ({ product }: { product: Product }) => (
    // 'h-full' penting di sini agar Link mengisi tinggi grid cell
    <Link href={`/products/${product.id}`} className="group block h-full">
        {/* Container Utama: Layer Background Solid */}
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-[1.5rem] border border-stone-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-orange-900/10 dark:hover:shadow-cyan-900/20 transition-all duration-300 ease-out group-hover:-translate-y-1.5">

            {/* 1. Image Area (Atas) */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100 dark:bg-slate-900 border-b border-stone-100 dark:border-slate-700/50">

                {/* Badges */}
                <div className="absolute top-3 left-3 z-20 flex gap-2">
                    <span className="px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-md text-[10px] font-bold uppercase tracking-wider text-stone-800 dark:text-slate-200 shadow-sm border border-stone-200 dark:border-slate-700">
                        {product.category}
                    </span>
                    {product.is_featured && (
                        <span className="px-2.5 py-1 bg-orange-500 text-white rounded-md text-[10px] font-bold uppercase tracking-wider shadow-md">
                            Unggulan
                        </span>
                    )}
                </div>

                {/* Image */}
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <ShoppingBag size={32} />
                    </div>
                )}

                {/* Hover Action (Visual Hint) */}
                <div className="absolute bottom-3 right-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-lg text-orange-600 dark:text-cyan-400">
                        <ArrowUpRight size={18} />
                    </div>
                </div>
            </div>

            {/* 2. Content Area (Bawah) - Menggunakan flex-1 untuk mengisi ruang sisa */}
            <div className="p-5 flex flex-col flex-1">

                {/* Header Produk */}
                <div className="mb-2">
                    <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                    <p className="text-orange-600 dark:text-cyan-500 font-bold text-sm mt-1">
                        Rp {product.price?.toLocaleString('id-ID')}
                    </p>
                </div>

                {/* Description Preview (Uniform Height Logic) */}
                {/* Flex-1 disini mendorong footer ke bawah jika deskripsi pendek */}
                {/* line-clamp-2 membatasi teks max 2 baris */}
                <p className="text-xs text-stone-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">
                    {product.description || "Deskripsi produk belum tersedia. Klik untuk melihat detail lebih lanjut mengenai produk ini."}
                </p>

                {/* Footer Card (Action Text) */}
                {/* mt-auto memastikan ini selalu di dasar kartu */}
                <div className="mt-auto pt-3 border-t border-stone-100 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wide text-stone-400 group-hover:text-stone-800 dark:group-hover:text-white transition-colors">
                        Lihat Detail
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-slate-600 group-hover:bg-orange-500 dark:group-hover:bg-cyan-400 transition-colors"></div>
                </div>
            </div>
        </div>
    </Link>
)

const CardSkeleton = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-[1.5rem] border border-stone-200 dark:border-slate-700 p-0 overflow-hidden animate-pulse">
        <div className="aspect-[4/5] bg-stone-200 dark:bg-slate-700 w-full"></div>
        <div className="p-5 flex flex-col flex-1">
            <div className="h-5 bg-stone-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-stone-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
            <div className="h-3 bg-stone-200 dark:bg-slate-700 rounded w-full mb-1"></div>
            <div className="h-3 bg-stone-200 dark:bg-slate-700 rounded w-2/3 mb-4 flex-1"></div>
            <div className="mt-auto h-px bg-stone-100 dark:bg-slate-700 w-full mb-3"></div>
            <div className="h-3 bg-stone-200 dark:bg-slate-700 rounded w-1/3"></div>
        </div>
    </div>
)

const LoaderSkeletonSmall = () => (
    <div className="flex gap-1">
        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></div>
        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
    </div>
)

const EmptyState = ({ reset }: { reset: () => void }) => (
    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-stone-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Search className="text-stone-400 dark:text-slate-500 w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Tidak ditemukan</h3>
        <p className="text-stone-500 dark:text-slate-400 mb-6 max-w-md">
            Kami tidak dapat menemukan produk yang sesuai dengan kriteria pencarian Anda.
        </p>
        <button
            onClick={reset}
            className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
        >
            Reset Semua Filter
        </button>
    </div>
)
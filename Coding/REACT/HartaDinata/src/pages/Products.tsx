import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import { Product } from '@/types/product';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    ArrowUpDown,
    Loader2,
    Sparkles,
    Package,
    ChevronDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ITEMS_PER_PAGE = 8;

const banners = [
    {
        image: "https://images.unsplash.com/photo-1515562141522-b3427430d6b5?auto=format&fit=crop&w=1920&q=80",
        category: "Edisi Terbatas • 2024",
        title: "Kemurnian <br /> <span class='italic text-gold-gradient'>Sempurna</span> Dalam Detail",
        description: "Koleksi perhiasan eksklusif yang memadukan keahlian maestro dengan kemurnian emas batangan bersertifikat.",
        cta: "Buka Katalog Premium"
    },
    {
        image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1920&q=80",
        category: "Investasi Cerdas",
        title: "Logam Mulia <br /> <span class='italic text-gold-gradient'>Pilihan</span> Dunia",
        description: "Tabungan masa depan yang aman dengan emas batangan berkemurnian 99.99% standar internasional.",
        cta: "Mulai Menabung"
    },
    {
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3f8ad?auto=format&fit=crop&w=1920&q=80",
        category: "Momen Spesial",
        title: "Kilau <br /> <span class='italic text-gold-gradient'>Abadi</span> Untuk Anda",
        description: "Hadirkan kebahagiaan dalam setiap momen berharga dengan koleksi cincin dan kalung berlian terbaik.",
        cta: "Cek Koleksi Perhiasan"
    }
];

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [currentSlide, setCurrentSlide] = useState(0);
    const { ref, inView } = useInView();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Debounce Logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const fetchProducts = async (pageNumber: number, isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            else setLoadingMore(true);

            let query = supabase
                .from('products')
                .select('*');

            // Search by Name or Category
            if (debouncedSearch) {
                query = query.or(`name.ilike.%${debouncedSearch}%,category.ilike.%${debouncedSearch}%`);
            }

            // Apply Sorting
            if (sortBy === 'newest') {
                query = query.order('created_at', { ascending: false });
            } else if (sortBy === 'price-low') {
                query = query.order('price', { ascending: true });
            } else if (sortBy === 'price-high') {
                query = query.order('price', { ascending: false });
            }

            // Pagination
            query = query.range(pageNumber * ITEMS_PER_PAGE, (pageNumber + 1) * ITEMS_PER_PAGE - 1);

            const { data, error } = await query;

            if (error) throw error;

            const formattedData: Product[] = (data || []).map(item => ({
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                originalPrice: item.original_price,
                category: item.category,
                imageUrl: item.image_url,
                stock: item.stock,
                isFeatured: item.is_featured,
                isPromo: item.is_promo,
                isBundle: item.is_bundle,
                badge: item.badge,
                certification: item.certification,
                rating: item.rating,
                reviews: item.reviews,
                createdAt: item.created_at,
            }));

            if (isInitial) {
                setProducts(formattedData);
            } else {
                setProducts(prev => [...prev, ...formattedData]);
            }

            setHasMore(formattedData.length === ITEMS_PER_PAGE);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProducts(0, true);
        setPage(0);
    }, [debouncedSearch, sortBy]);

    useEffect(() => {
        if (inView && hasMore && !loadingMore && !loading) {
            const nextPage = page + 1;
            fetchProducts(nextPage);
            setPage(nextPage);
        }
    }, [inView, hasMore, loadingMore, loading]);

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Header />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    {/* Hero Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Koleksi Eksklusif</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                                Jelajahi <span className="text-gold-gradient">Produk Kami</span>
                            </h1>
                            <p className="text-white/40 max-w-xl text-lg leading-relaxed">
                                Temukan berbagai koleksi emas batangan dan perhiasan dengan standar kualitas internasional dan sertifikasi resmi.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-4 w-full md:w-auto"
                        >
                            <div className="relative flex-1 md:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Cari perhiasan atau emas..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-white/5 border-white/10 h-14 pl-12 rounded-2xl focus:border-primary/50 focus:ring-primary/20 transition-all text-white"
                                />
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="h-14 px-6 rounded-2xl bg-white/10 border border-white/20 hover:border-primary/50 transition-all flex items-center gap-3 group">
                                        <ArrowUpDown className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-bold uppercase tracking-widest text-white">
                                            {sortBy === 'newest' ? 'Terbaru' : sortBy === 'price-low' ? 'Termurah' : 'Termahal'}
                                        </span>
                                        <ChevronDown className="w-4 h-4 text-white/40 group-data-[state=open]:rotate-180 transition-transform" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-[#0f0f0f] border border-white/20 shadow-2xl p-2 rounded-2xl z-[100] min-w-[200px]">
                                    <DropdownMenuItem
                                        onClick={() => setSortBy('newest')}
                                        className="rounded-xl p-3 cursor-pointer hover:bg-white/10 focus:bg-white/10 transition-colors text-white font-bold tracking-wide outline-none"
                                    >
                                        Urutkan Terbaru
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setSortBy('price-low')}
                                        className="rounded-xl p-3 cursor-pointer hover:bg-white/10 focus:bg-white/10 transition-colors text-white font-bold tracking-wide outline-none"
                                    >
                                        Harga Terendah
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setSortBy('price-high')}
                                        className="rounded-xl p-3 cursor-pointer hover:bg-white/10 focus:bg-white/10 transition-colors text-white font-bold tracking-wide outline-none"
                                    >
                                        Harga Tertinggi
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </motion.div>
                    </div>

                    {/* Promotional Banner Carousel - Premium Luxury */}
                    <div className="relative mb-20 group">
                        <div className="relative h-[450px] md:h-[550px] w-full rounded-[3.5rem] overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 1, ease: "easeInOut" }}
                                    className="absolute inset-0"
                                >
                                    {/* Background Image */}
                                    <img
                                        src={banners[currentSlide].image}
                                        alt={banners[currentSlide].title}
                                        className="w-full h-full object-cover transition-transform duration-[5s] scale-110 group-hover:scale-100 brightness-[0.6]"
                                    />

                                    {/* Gradient Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

                                    {/* Content Wrapper */}
                                    <div className="absolute inset-0 flex flex-col justify-center p-10 md:p-20 z-10">
                                        <motion.div
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3, duration: 0.8 }}
                                            className="max-w-2xl space-y-8"
                                        >
                                            <div className="space-y-2">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "80px" }}
                                                    transition={{ delay: 0.6, duration: 1 }}
                                                    className="h-1 bg-primary rounded-full"
                                                />
                                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary block">
                                                    {banners[currentSlide].category}
                                                </span>
                                            </div>

                                            <div className="space-y-4">
                                                <h2 className="text-4xl md:text-7xl font-display font-bold text-white leading-[1.1] font-cinzel tracking-tight"
                                                    dangerouslySetInnerHTML={{ __html: banners[currentSlide].title }}
                                                />
                                                <p className="text-white/40 text-base md:text-xl font-light leading-relaxed max-w-lg">
                                                    {banners[currentSlide].description}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-6 pt-4">
                                                <Button className="btn-luxury px-10 h-14 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-gold hover:scale-105 transition-transform">
                                                    {banners[currentSlide].cta}
                                                </Button>
                                                <Button variant="ghost" className="text-white/60 hover:text-primary group/link text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                                    Detail Koleksi
                                                    <div className="w-8 h-[1px] bg-white/20 group-hover/link:w-12 group-hover/link:bg-primary transition-all" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Carousel Navigation Dots */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                            {banners.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-12 bg-primary shadow-gold' : 'w-3 bg-white/20 hover:bg-white/40'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <p className="text-white/40 animate-pulse font-medium tracking-widest uppercase text-xs">Menyiapkan Koleksi...</p>
                        </div>
                    ) : (
                        <>
                            {products.length === 0 ? (
                                <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                                    <Package className="w-16 h-16 text-white/10 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold mb-2">Produk Tidak Ditemukan</h3>
                                    <p className="text-white/40">Coba gunakan kata kunci pencarian yang lain.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {products.map((product, index) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            index={index}
                                            onClick={() => setSelectedProduct(product)}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Infinite Scroll Trigger */}
                            {hasMore && (
                                <div ref={ref} className="flex justify-center mt-20">
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Memuat Lebih Banyak</p>
                                    </div>
                                </div>
                            )}

                            {!hasMore && products.length > 0 && (
                                <div className="text-center mt-20 py-10 border-t border-white/5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Semua koleksi telah ditampilkan</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <ProductDetailModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
            />

            <Footer />
        </div>
    );
};

export default Products;

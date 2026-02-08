import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    BookOpen,
    Loader2,
    Calendar,
    User,
    ArrowRight,
    FileText,
    Play,
    Sparkles,
    ChevronRight,
    Film,
    ChevronDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Article } from '@/types/cms';
import { useNavigate } from 'react-router-dom';
import VideoModal from '@/components/VideoModal';

const KnowledgeHub = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [sortBy, setSortBy] = useState('Terbaru');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

    const navigate = useNavigate();

    const categories = ['Semua', 'Emas', 'Edukasi', 'Bisnis', 'Mitra', 'Promo', 'Tutorial'];
    const sortOptions = ['Terbaru', 'Terlama', 'Terpopuler'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);

        // Fetch Articles
        const { data: articlesData, error: articlesError } = await supabase
            .from('articles')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false });

        // Fetch Videos
        const { data: videosData, error: videosError } = await supabase
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false });

        if (!articlesError) {
            setArticles(articlesData.map(item => ({
                id: item.id,
                title: item.title,
                content: item.content,
                author: item.author,
                category: item.category,
                imageUrl: item.image_url,
                isPublished: item.is_published,
                createdAt: item.created_at,
                updatedAt: item.updated_at
            })));
        }

        if (!videosError) {
            setVideos(videosData || []);
        }

        setLoading(false);
    };

    const filterAndSort = (items: any[]) => {
        let filtered = items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === 'Semua' || item.category === activeCategory;
            return matchesSearch && matchesCategory;
        });

        if (sortBy === 'Terbaru') {
            filtered.sort((a, b) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime());
        } else if (sortBy === 'Terlama') {
            filtered.sort((a, b) => new Date(a.createdAt || a.created_at).getTime() - new Date(b.createdAt || b.created_at).getTime());
        } else if (sortBy === 'Terpopuler') {
            filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        }

        return filtered;
    };

    const sortedArticles = filterAndSort(articles);
    const sortedVideos = filterAndSort(videos);

    const featuredArticle = sortedArticles[0];
    const otherArticles = sortedArticles.slice(1);

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Header />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    {/* Hero Section */}
                    <div className="mb-20 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
                        >
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span className="text-xs font-black uppercase tracking-widest text-primary">Knowledge Hub</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-display font-bold mb-6 font-cinzel"
                        >
                            Artikel <span className="text-gold-gradient">&</span> Berita
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed font-light"
                        >
                            Pusat informasi, edukasi, dan berita terbaru seputar dunia emas, investasi, dan peluang bisnis bersama Hartadinata.
                        </motion.p>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {categories.map((cat, i) => (
                                <motion.button
                                    key={cat}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${activeCategory === cat
                                        ? 'bg-primary text-black border-primary shadow-gold'
                                        : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'
                                        }`}
                                >
                                    {cat}
                                </motion.button>
                            ))}
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Cari konten..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-white/5 border-white/10 h-14 pl-12 rounded-2xl focus:border-primary/50 focus:ring-primary/20 transition-all text-white"
                                />
                            </div>

                            {/* Custom Premium Sort Dropdown */}
                            <div className="relative w-full md:w-48">
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all focus:border-primary/50"
                                >
                                    <span className="text-white/40 mr-2">Sortir:</span>
                                    <span>{sortBy}</span>
                                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isSortOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setIsSortOpen(false)}
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute top-full left-0 right-0 mt-2 p-2 bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl z-50 backdrop-blur-xl"
                                            >
                                                {sortOptions.map((opt) => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => {
                                                            setSortBy(opt);
                                                            setIsSortOpen(false);
                                                        }}
                                                        className={`w-full px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === opt
                                                                ? 'bg-primary text-black'
                                                                : 'text-white/40 hover:bg-white/5 hover:text-white'
                                                            }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <p className="text-white/40 animate-pulse font-medium tracking-widest uppercase text-xs">Singkronisasi Data...</p>
                        </div>
                    ) : (
                        <div className="space-y-32">

                            {/* 1. VIDEOS SECTION */}
                            {sortedVideos.length > 0 && (
                                <section className="space-y-12">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                            <Film className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-display font-bold font-cinzel tracking-wider">Video Academy</h2>
                                            <p className="text-white/20 text-sm">Panduan visual dan tutorial eksklusif.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                        {sortedVideos.map((video, idx) => (
                                            <motion.div
                                                key={video.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: (idx % 3) * 0.1 }}
                                                className="group cursor-pointer"
                                                onClick={() => setSelectedVideo(video)}
                                            >
                                                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-6 border border-white/5 shadow-2xl">
                                                    <img
                                                        src={video.thumbnail || `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`}
                                                        alt={video.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-50"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                                                            <Play className="w-6 h-6 text-primary fill-primary" />
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-6 left-6">
                                                        <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-primary">{video.category}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="px-4 space-y-3">
                                                    <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-primary transition-colors leading-snug">
                                                        {video.title}
                                                    </h3>
                                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/30">
                                                        <span className="flex items-center gap-1.5">
                                                            <Sparkles className="w-3 h-3 text-primary/40" />
                                                            {video.duration || 'Premium'}
                                                        </span>
                                                        <div className="flex items-center gap-2 group-hover:text-primary transition-all">
                                                            Tonton Video <ChevronRight className="w-3 h-3" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* 2. ARTICLES SECTION */}
                            {sortedArticles.length > 0 && (
                                <section className="space-y-16">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-display font-bold font-cinzel tracking-wider">Artikel & Berita</h2>
                                            <p className="text-white/20 text-sm">Wawasan mendalam dan kabar industri emas.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-20">
                                        {/* Featured Post */}
                                        {activeCategory === 'Semua' && searchTerm === '' && featuredArticle && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 40 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                className="group relative h-[500px] md:h-[600px] rounded-[3.5rem] overflow-hidden cursor-pointer shadow-3xl"
                                                onClick={() => navigate(`/articles/${featuredArticle.id}`)}
                                            >
                                                <img
                                                    src={featuredArticle.imageUrl || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1920&q=80'}
                                                    alt={featuredArticle.title}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                                                    <div className="flex items-center gap-4 mb-6">
                                                        <span className="px-4 py-1.5 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-full">Terbaru</span>
                                                        <span className="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                                            <div className="w-1 h-1 rounded-full bg-primary" />
                                                            {featuredArticle.category}
                                                        </span>
                                                    </div>
                                                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 max-w-4xl line-clamp-2">
                                                        {featuredArticle.title}
                                                    </h2>
                                                    <div className="flex items-center gap-8">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-black text-xs">
                                                                {featuredArticle.author.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white">{featuredArticle.author}</p>
                                                                <p className="text-[10px] text-white/40 uppercase tracking-widest">Penulis</p>
                                                            </div>
                                                        </div>
                                                        <Button className="btn-luxury h-12 px-8 rounded-xl ml-auto group-hover:bg-primary transition-all">
                                                            Baca Artikel <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Grid of Other Articles */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                            {(activeCategory === 'Semua' && searchTerm === '' ? otherArticles : sortedArticles).map((art, idx) => (
                                                <motion.div
                                                    key={art.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: (idx % 3) * 0.1 }}
                                                    className="group cursor-pointer"
                                                    onClick={() => navigate(`/articles/${art.id}`)}
                                                >
                                                    <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-6 border border-white/5 shadow-xl">
                                                        <img
                                                            src={art.imageUrl || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80'}
                                                            alt={art.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                        <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{art.category}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4 px-2">
                                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/30">
                                                            <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-primary" />{new Date(art.createdAt).toLocaleDateString('id-ID')}</span>
                                                            <span className="flex items-center gap-1.5"><User className="w-3 h-3 text-primary" />{art.author}</span>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-primary transition-colors leading-snug">{art.title}</h3>
                                                        <p className="text-white/40 text-sm line-clamp-2 font-light leading-relaxed">
                                                            {art.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {!sortedArticles.length && !sortedVideos.length && (
                                <div className="text-center py-40 bg-white/5 rounded-[4rem] border border-dashed border-white/10">
                                    <FileText className="w-16 h-16 text-white/10 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold mb-2">Konten Tidak Ditemukan</h3>
                                    <p className="text-white/40">Maaf, kami tidak menemukan video atau artikel dengan filter ini.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Video Modal Integration */}
            {selectedVideo && (
                <VideoModal
                    isOpen={!!selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                    videoId={selectedVideo.video_id}
                    title={selectedVideo.title}
                />
            )}

            <Footer />
        </div>
    );
};

export default KnowledgeHub;

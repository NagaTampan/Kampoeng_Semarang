import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    User,
    Share2,
    Clock,
    TrendingUp,
    ChevronRight,
    Loader2,
    BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Article } from '@/types/cms';
import { toast } from 'sonner';
import { sanitizeHtml } from '@/utils/sanitize';

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

    useEffect(() => {
        if (id) {
            fetchArticleDetail();
        }
    }, [id]);

    const fetchArticleDetail = async () => {
        setLoading(true);
        try {
            // Fetch main article
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            const artData = {
                id: data.id,
                title: data.title,
                content: data.content,
                author: data.author,
                category: data.category,
                imageUrl: data.image_url,
                isPublished: data.is_published,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            };
            setArticle(artData);

            // Fetch related articles
            const { data: related, error: relError } = await supabase
                .from('articles')
                .select('*')
                .eq('is_published', true)
                .eq('category', data.category)
                .neq('id', id)
                .limit(3);

            if (!relError) {
                setRelatedArticles(related.map(r => ({
                    id: r.id,
                    title: r.title,
                    content: r.content,
                    author: r.author,
                    category: r.category,
                    imageUrl: r.image_url,
                    isPublished: r.is_published,
                    createdAt: r.created_at,
                    updatedAt: r.updated_at
                })));
            }

        } catch (err) {
            console.error('Error fetching article:', err);
            toast.error('Gagal memuat artikel.');
            navigate('/articles');
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link artikel berhasil disalin!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-white/20 font-black uppercase tracking-[0.3em] text-xs">Membuka Halaman...</p>
            </div>
        );
    }

    if (!article) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Header />

            <main className="pt-32 pb-20">
                <article className="container mx-auto px-6 max-w-4xl">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20 mb-12">
                        <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Beranda</button>
                        <ChevronRight className="w-3 h-3" />
                        <button onClick={() => navigate('/articles')} className="hover:text-primary transition-colors">Artikel</button>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-white/40 truncate">{article.category}</span>
                    </nav>

                    {/* Article Header */}
                    <header className="mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg mb-6">
                                {article.category}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight font-cinzel">
                                {article.title}
                            </h1>

                            <div className="flex flex-wrap items-center justify-between gap-6 border-y border-white/5 py-8">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gold-gradient p-px overflow-hidden">
                                            <div className="w-full h-full bg-[#0A0A0A] rounded-full flex items-center justify-center font-bold text-primary">
                                                {article.author.charAt(0)}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{article.author}</p>
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest">Penulis Terverifikasi</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block h-8 w-px bg-white/10" />
                                    <div className="hidden sm:flex flex-col">
                                        <p className="text-sm font-bold flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Dipublikasikan</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button onClick={handleShare} variant="ghost" className="h-12 w-12 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                        <Share2 className="w-5 h-5 text-white/60" />
                                    </Button>
                                    <Button onClick={() => navigate('/articles')} variant="ghost" className="h-12 w-12 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                        <ArrowLeft className="w-5 h-5 text-white/60" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </header>

                    {/* Feature Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden mb-16 border border-white/5"
                    >
                        <img
                            src={article.imageUrl || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1920&q=80'}
                            alt={article.title}
                            className="w-full h-full object-cover grayscale-[0.2]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </motion.div>

                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="prose prose-invert prose-gold max-w-none mb-20"
                    >
                        <div
                            className="rich-text-container text-white/70 leading-relaxed text-lg font-light space-y-6"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
                        />
                    </motion.div>

                    {/* Author Footer Card */}
                    <div className="p-8 md:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 mb-20">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <div className="w-24 h-24 rounded-full bg-gold-gradient p-1 flex-shrink-0">
                                <div className="w-full h-full rounded-full bg-[#0A0A0A] flex items-center justify-center font-bold text-3xl text-primary">
                                    {article.author.charAt(0)}
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h4 className="text-2xl font-bold mb-2">{article.author}</h4>
                                <p className="text-white/40 mb-6 text-sm">Editor & Content Creator Hartadinata Abadi. Berfokus pada edukasi pasar emas dan pertumbuhan bisnis mitra reseller di seluruh Indonesia.</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <Button className="btn-luxury h-10 px-6 rounded-xl text-xs font-bold uppercase tracking-widest">Ikuti Penulis</Button>
                                    <Button variant="ghost" className="h-10 px-6 rounded-xl text-xs font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10">Lihat Profil</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Articles Section */}
                    {relatedArticles.length > 0 && (
                        <div className="border-t border-white/5 pt-20">
                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-2xl md:text-3xl font-display font-bold">Artikel <span className="text-primary italic">Terkait</span></h3>
                                <Button onClick={() => navigate('/articles')} variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-transparent p-0 flex items-center gap-2">
                                    Lihat Semua <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {relatedArticles.map((rel) => (
                                    <div
                                        key={rel.id}
                                        className="group cursor-pointer"
                                        onClick={() => {
                                            navigate(`/articles/${rel.id}`);
                                            window.scrollTo(0, 0);
                                        }}
                                    >
                                        <div className="aspect-video rounded-3xl overflow-hidden mb-4 border border-white/5">
                                            <img src={rel.imageUrl} alt={rel.title} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                                        </div>
                                        <h4 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">{rel.title}</h4>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest mt-2">{rel.category}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default ArticleDetail;

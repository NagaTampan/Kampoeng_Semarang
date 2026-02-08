import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Package,
    Users,
    TrendingUp,
    Bell,
    AlertTriangle,
    Diamond,
    ArrowUpRight,
    Search
} from 'lucide-react';
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import { Product } from '@/types/product';

const AdminDashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStock: 0,
        featuredItems: 0,
        totalStockValue: 0
    });
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/admin/login');
            } else {
                setUser(user);
                fetchStats();
            }
            setLoading(false);
        };

        checkUser();
    }, [navigate]);

    const fetchStats = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const total = data.length;
                const low = data.filter(p => p.stock < 10).length;
                const featured = data.filter(p => p.is_featured).length;
                const stockValue = data.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);

                setStats({
                    totalProducts: total,
                    lowStock: low,
                    featuredItems: featured,
                    totalStockValue: stockValue
                });

                setRecentProducts(data.slice(0, 5).map(item => ({
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
                })));
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Diamond className="w-6 h-6 text-primary animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Katalog',
            value: stats.totalProducts,
            unit: 'Produk',
            growth: '+3% MoM',
            icon: Package,
            color: 'from-blue-500/10 to-blue-500/5',
            iconColor: 'text-blue-400'
        },
        {
            label: 'Aset Premium',
            value: stats.featuredItems,
            unit: 'Featured',
            growth: 'Top Quality',
            icon: Diamond,
            color: 'from-primary/20 to-primary/5',
            iconColor: 'text-primary'
        },
        {
            label: 'Peringatan Stok',
            value: stats.lowStock,
            unit: 'Item Menipis',
            growth: 'Penyetokan Ulang',
            icon: AlertTriangle,
            color: 'from-destructive/20 to-destructive/5',
            iconColor: 'text-destructive'
        },
        {
            label: 'Nilai Inventory',
            value: `Rp ${(stats.totalStockValue / 1000000).toFixed(1)}M`,
            unit: 'Estimasi Total',
            growth: 'Live Value',
            icon: TrendingUp,
            color: 'from-success/20 to-success/5',
            iconColor: 'text-success'
        },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            <Sidebar />

            <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                    <div>
                        <h1 className="text-4xl font-display font-bold font-cinzel tracking-wider mb-2">Dashboard Pengelolaan</h1>
                        <p className="text-white/40 text-sm max-w-md">Ringkasan inventaris dan performa katalog Hartadinata secara real-time.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <div className="flex -space-x-3 pl-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full bg-[#111] border-2 border-[#050505] flex items-center justify-center">
                                    <Users className="w-4 h-4 text-white/40" />
                                </div>
                            ))}
                        </div>
                        <div className="px-4 border-l border-white/10">
                            <p className="text-xs font-black uppercase tracking-widest text-white/20">Online Admin</p>
                            <p className="text-sm font-bold">{user?.email?.split('@')[0]}</p>
                        </div>
                        <Button variant="ghost" className="w-12 h-12 rounded-xl p-0 hover:bg-white/10 relative">
                            <Bell className="w-5 h-5 text-white/40" />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full ring-4 ring-[#050505]" />
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statCards.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`glass-card rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all`}
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} blur-[50px] -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity`} />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 ${stat.iconColor}`}>
                                        <stat.icon className="w-7 h-7" />
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-white/10 group-hover:text-primary transition-colors" />
                                </div>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                                <div className="flex flex-col">
                                    <h3 className="text-3xl font-bold mb-1 font-mono-price">{stat.value}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{stat.unit}</span>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${i === 2 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                                            {stat.growth}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Summary Section */}
                        <div className="glass-card rounded-[3rem] p-10 border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <LayoutDashboard className="w-48 h-48" />
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                                <div className="flex-1">
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">Analisis Strategis</span>
                                    <h3 className="text-4xl font-display font-bold mb-4 leading-tight">Optimasi Inventaris & Ekosistem Bisnis</h3>
                                    <p className="text-white/60 leading-relaxed mb-8">
                                        Perbaharui katalog Anda secara berkala untuk menjaga minat mitra. Saat ini, terdapat <span className="text-primary font-bold">{stats.lowStock} item</span> yang memerlukan perhatian segera untuk penyetokan ulang.
                                    </p>
                                    <Button onClick={() => navigate('/admin/products')} className="btn-luxury h-14 px-8 rounded-2xl font-bold shadow-gold group">
                                        Kelola Katalog
                                        <Package className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </div>

                                <div className="w-full md:w-64 aspect-square rounded-[2rem] bg-gold-gradient p-1 shadow-gold">
                                    <div className="w-full h-full rounded-[1.8rem] bg-[#0A0A0A] flex flex-col items-center justify-center text-center p-6">
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/20 mb-2">Total Aset</h4>
                                        <span className="text-5xl font-bold font-mono-price text-gold-gradient mb-2">{stats.totalProducts}</span>
                                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest lh-2">Unit Terdaftar</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Items Table Preview */}
                        <div className="glass-card rounded-[3rem] p-10 border border-white/5">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h4 className="text-xl font-bold font-cinzel tracking-widest">Produk Terbaru</h4>
                                    <p className="text-sm text-white/40 mt-1">Item terakhir yang ditambahkan ke katalog.</p>
                                </div>
                                <Button variant="ghost" onClick={() => navigate('/admin/products')} className="text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5">Lihat Semua</Button>
                            </div>

                            <div className="space-y-4">
                                {recentProducts.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/5">
                                                {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-white/10" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{product.name}</p>
                                                <p className="text-[10px] text-white/40 uppercase tracking-widest">{product.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold font-mono-price text-primary">Rp {product.price.toLocaleString('id-ID')}</p>
                                            <p className={`text-[10px] uppercase font-black ${product.stock < 10 ? 'text-destructive' : 'text-white/20'}`}>Stok: {product.stock}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Quick Actions / Shortcuts */}
                        <div className="glass-card rounded-[2.5rem] p-8 border border-white/5">
                            <h4 className="font-bold font-cinzel tracking-widest mb-6">Akses Cepat</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => navigate('/admin/products')} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all group">
                                    <Package className="w-8 h-8 text-white/20 mb-3 group-hover:text-primary transition-colors" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Tambah Item</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all group opacity-50 cursor-not-allowed">
                                    <Users className="w-8 h-8 text-white/20 mb-3" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Kelola Mitra</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all group opacity-50 cursor-not-allowed">
                                    <Search className="w-8 h-8 text-white/20 mb-3" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Log Audit</span>
                                </button>
                                <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all group">
                                    <ArrowUpRight className="w-8 h-8 text-white/20 mb-3 group-hover:text-primary transition-colors" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Lihat Situs</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity Real Sync Placeholder */}
                        <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 min-h-[400px]">
                            <h4 className="font-bold font-cinzel tracking-widest mb-6">Aktivitas Sistem</h4>
                            <div className="space-y-8">
                                {[
                                    { msg: 'Sinkronisasi katalog emas ke public berhasil.', time: 'Sekarang', icon: TrendingUp, color: 'text-success' },
                                    { msg: 'Sesi Admin didefinisikan sebagai Super Admin.', time: '10 menit lalu', icon: Diamond, color: 'text-primary' },
                                    { msg: 'Terdapat pembaruan pada stok kategori bundle.', time: '2 jam lalu', icon: Package, color: 'text-white/40' },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start group">
                                        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 mt-1 transition-transform group-hover:scale-110 border border-white/5`}>
                                            <item.icon className={`w-5 h-5 ${item.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm leading-relaxed">{item.msg}</p>
                                            <p className="text-[10px] text-white/20 mt-1 uppercase font-black tracking-widest tracking-widest">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/5">
                                <p className="text-[10px] text-white/10 uppercase font-black text-center tracking-[0.3em]">HARTADINATA SECURE PANEL v1.0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

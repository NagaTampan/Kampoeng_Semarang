import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
    LayoutDashboard,
    Package,
    Settings,
    LogOut,
    FileText,
    Video
} from 'lucide-react';
import { toast } from 'sonner';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success('Berhasil logout.');
        navigate('/admin/login');
    };

    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { label: 'Produk Emas', icon: Package, path: '/admin/products' },
        { label: 'Artikel & Berita', icon: FileText, path: '/admin/articles' },
        { label: 'Video Edukasi', icon: Video, path: '/admin/videos' },
        { label: 'Pengaturan', icon: Settings, path: '/admin/settings' },
    ];

    return (
        <aside className="w-72 bg-[#0A0A0A] border-r border-white/5 p-8 flex flex-col hidden lg:flex h-screen sticky top-0">
            <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
                    <span className="text-black font-cinzel font-black text-lg">H</span>
                </div>
                <div>
                    <h2 className="font-cinzel text-sm font-bold tracking-widest text-white">ADMIN CMS</h2>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.label}
                            onClick={() => item.path !== '#' && navigate(item.path)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-primary text-black font-bold shadow-gold'
                                : 'text-white/40 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-sm">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <button
                onClick={handleLogout}
                className="mt-auto flex items-center gap-4 px-4 py-3 rounded-xl text-white/40 hover:bg-destructive/10 hover:text-destructive transition-all"
            >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-bold">Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
    Settings as SettingsIcon,
    User,
    Lock,
    Bell,
    Globe,
    Shield,
    Save,
    Mail,
    Phone,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';

const Settings = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    // Form states
    const [whatsappNumber, setWhatsappNumber] = useState('6281234567890');
    const [contactEmail, setContactEmail] = useState('cs@hartadinata.co.id');
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/admin/login');
            } else {
                setUser(user);
            }
            setLoading(false);
        };
        checkUser();
    }, [navigate]);

    const handleSaveSettings = async () => {
        setSaving(true);
        // Simulating a save to DB or Supabase Metadata
        setTimeout(() => {
            toast.success('Konfigurasi berhasil disimpan!');
            setSaving(false);
        }, 1000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            <Sidebar />

            <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <header className="mb-12">
                    <h1 className="text-3xl font-display font-bold font-cinzel tracking-wider">Pengaturan Sistem</h1>
                    <p className="text-white/40 text-sm mt-1">Konfigurasi profile, kontak, dan keamanan panel Admin.</p>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Navigation Tabs Sidebar (Simplified for now) */}
                    <div className="space-y-4">
                        {[
                            { id: 'profile', label: 'Profil Admin', icon: User, active: true },
                            { id: 'site', label: 'Konfigurasi Situs', icon: Globe },
                            { id: 'security', label: 'Keamanan', icon: Shield },
                            { id: 'notif', label: 'Notifikasi', icon: Bell },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 border ${tab.active
                                        ? 'bg-primary/10 border-primary/20 text-primary shadow-gold-sm'
                                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                <span className="text-sm font-bold uppercase tracking-widest">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Right Column: Settings Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Section */}
                        <section className="glass-card rounded-[2.5rem] p-8 lg:p-10 border border-white/5">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold font-cinzel tracking-widest">Informasi Profil</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Email Terdaftar</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <Input
                                            value={user?.email}
                                            disabled
                                            className="bg-white/5 border-white/10 h-14 pl-12 rounded-2xl text-white/40 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Role Akses</Label>
                                    <div className="relative">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                        <Input
                                            value="Super Administrator"
                                            disabled
                                            className="bg-white/5 border-white/10 h-14 pl-12 rounded-2xl text-primary/60 font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Site Config Section */}
                        <section className="glass-card rounded-[2.5rem] p-8 lg:p-10 border border-white/5">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center border border-success/20">
                                    <Globe className="w-6 h-6 text-success" />
                                </div>
                                <h3 className="text-xl font-bold font-cinzel tracking-widest">Interaksi & Kontak</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Nomor WhatsApp (CS)</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <Input
                                            value={whatsappNumber}
                                            onChange={(e) => setWhatsappNumber(e.target.value)}
                                            placeholder="Contoh: 6281..."
                                            className="bg-white/5 border-white/10 h-14 pl-12 rounded-2xl focus:border-primary/50"
                                        />
                                    </div>
                                    <p className="text-[10px] text-white/20 italic">Gunakan format kode negara (misal: 62...)</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Email Support</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <Input
                                            value={contactEmail}
                                            onChange={(e) => setContactEmail(e.target.value)}
                                            className="bg-white/5 border-white/10 h-14 pl-12 rounded-2xl focus:border-primary/50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* System Preference */}
                        <section className="glass-card rounded-[2.5rem] p-8 lg:p-10 border border-white/5">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                    <SettingsIcon className="w-6 h-6 text-orange-500" />
                                </div>
                                <h3 className="text-xl font-bold font-cinzel tracking-widest">Preferensi Sistem</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
                                    <div>
                                        <p className="text-sm font-bold">Mode Pemeliharaan</p>
                                        <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mt-1">Nonaktifkan akses publik sementara</p>
                                    </div>
                                    <Switch
                                        checked={maintenanceMode}
                                        onCheckedChange={setMaintenanceMode}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
                                    <div>
                                        <p className="text-sm font-bold">Notifikasi Email</p>
                                        <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mt-1">Terima laporan stok setiap pagi</p>
                                    </div>
                                    <Switch
                                        checked={notifications}
                                        onCheckedChange={setNotifications}
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={handleSaveSettings}
                                disabled={saving}
                                className="btn-luxury h-16 px-10 rounded-2xl font-bold shadow-gold group min-w-[200px]"
                            >
                                {saving ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Simpan Perubahan
                                        <Save className="ml-2 w-5 h-5 opacity-40 group-hover:opacity-100 transition-all" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;

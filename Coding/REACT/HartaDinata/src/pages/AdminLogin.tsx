import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data) {
                toast.success('Login berhasil! Selamat datang Admin.');
                navigate('/admin/dashboard');
            }
        } catch (error: any) {
            toast.error(error.message || 'Gagal login. Periksa kembali email dan password Anda.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a_0%,transparent_70%)] opacity-50" />
            <div className="absolute top-0 rotate-180 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card rounded-[2.5rem] p-8 lg:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gold-gradient flex items-center justify-center mb-6 shadow-gold animate-glow">
                            <span className="text-black font-cinzel font-black text-2xl">H</span>
                        </div>
                        <h1 className="font-cinzel text-2xl font-bold text-white tracking-widest mb-2">ADMIN PORTAL</h1>
                        <p className="text-sm text-white/40 uppercase tracking-[0.2em] font-medium">HartaDinata Abadi Tbk</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-white/60 ml-1">Email Address</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@hartadinata.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-white/5 border-white/10 pl-12 h-14 rounded-2xl focus:border-primary/50 focus:ring-primary/20 transition-all text-white placeholder:text-white/10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-white/60">Password</Label>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-white/5 border-white/10 pl-12 h-14 rounded-2xl focus:border-primary/50 focus:ring-primary/20 transition-all text-white placeholder:text-white/10"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 btn-luxury rounded-2xl text-base font-bold shadow-gold group transition-all"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Akses Admin
                                    <Lock className="ml-2 w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                                </>
                            )}
                        </Button>
                    </form>


                </div>

                {/* Footer Link */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-[11px] font-black uppercase tracking-widest text-white/20 hover:text-primary transition-colors"
                    >
                        ← Kembali ke Website Utama
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;

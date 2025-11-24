"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Facebook, Instagram, Twitter, Mail, Phone, MapPin,
    ArrowRight, Check, AlertCircle, Loader2, Send, ShieldCheck
} from 'lucide-react'

export default function Footer() {
    // --- STATE MANAGEMENT ---
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'limited'>('idle')
    const [message, setMessage] = useState('')

    // Honeypot state untuk anti-bot
    const [honeypot, setHoneypot] = useState('')

    // --- RATE LIMITER CHECK ON MOUNT ---
    useEffect(() => {
        const lastSent = localStorage.getItem('ks_last_email_sent')
        if (lastSent) {
            const timePassed = Date.now() - parseInt(lastSent)
            if (timePassed < 60000) { // Limit 1 menit
                setStatus('limited')
                setMessage('Tunggu sebentar sebelum mengirim lagi.')
            }
        }
    }, [])

    // --- SECURITY & HANDLING LOGIC ---
    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()

        // 1. HONEYPOT CHECK (Bot Protection)
        if (honeypot) {
            // Jika field tersembunyi diisi, anggap itu bot dan reject diam-diam
            return
        }

        // 2. RATE LIMITING CHECK
        if (status === 'limited') return

        // 3. INPUT SANITIZATION
        const cleanEmail = email.trim().replace(/[<>]/g, "") // Hapus tag HTML

        // 4. VALIDATION
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(cleanEmail)) {
            setStatus('error')
            setMessage('Format email tidak valid.')
            return
        }

        // 5. SIMULASI API CALL
        setStatus('loading')
        setMessage('')

        // Simulasi delay network
        setTimeout(() => {
            // Sukses
            setStatus('success')
            setMessage('Terima kasih! Anda telah berlangganan.')
            setEmail('')

            // Set Rate Limit Timestamp
            localStorage.setItem('ks_last_email_sent', Date.now().toString())

            // Reset status setelah 3 detik
            setTimeout(() => {
                setStatus('limited')
                setMessage('Sesi pengiriman dibatasi sementara.')
            }, 3000)
        }, 1500)
    }

    return (
        <footer className="relative bg-[#0b0f19] text-gray-300 pt-24 pb-12 overflow-hidden border-t border-white/5">

            {/* --- BACKGROUND TEXTURE --- */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>

            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">

                {/* --- TOP SECTION: BRAND & NEWSLETTER --- */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-20">

                    {/* Brand Identity */}
                    <div className="lg:w-1/3">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center text-black font-bold font-serif text-xl shadow-lg shadow-orange-500/20">
                                K
                            </div>
                            <span className="text-2xl font-serif font-bold text-white tracking-wide">
                                Kampoeng <br />
                                <span className="text-sm font-sans font-light text-gray-400 tracking-[0.3em] uppercase block -mt-1">Semarang</span>
                            </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-8 max-w-sm">
                            Destinasi 'One Stop Shopping & Leisure' terbaik. Merangkul warisan budaya, kuliner legendaris, dan kerajinan tangan dalam satu atap yang megah.
                        </p>

                        {/* Social Icons (Minimalist Circle) */}
                        <div className="flex space-x-3">
                            {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                                <Link key={idx} href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-500/50 flex items-center justify-center transition-all duration-300 group">
                                    <Icon size={18} className="text-gray-400 group-hover:text-yellow-500" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter (The "Cyber" Secure Input) */}
                    <div className="lg:w-1/2 w-full">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group hover:border-white/20 transition-colors">
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <ShieldCheck className="w-16 h-16 text-emerald-500" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">Berlangganan Kabar Terbaru</h3>
                            <p className="text-sm text-gray-400 mb-6">Dapatkan info promo eksklusif dan event budaya. Bebas spam.</p>

                            <form onSubmit={handleSubscribe} className="relative">
                                {/* Honeypot Field (Hidden) */}
                                <input
                                    type="text"
                                    className="hidden"
                                    value={honeypot}
                                    onChange={(e) => setHoneypot(e.target.value)}
                                    tabIndex={-1}
                                    autoComplete="off"
                                />

                                <div className="relative flex items-center">
                                    <Mail className="absolute left-4 w-5 h-5 text-gray-500 pointer-events-none" />
                                    <input
                                        type="email"
                                        placeholder="Alamat email Anda..."
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            if (status !== 'loading' && status !== 'limited') setStatus('idle')
                                        }}
                                        disabled={status === 'loading' || status === 'limited' || status === 'success'}
                                        className={`
                                            w-full pl-12 pr-32 py-4 bg-black/40 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all
                                            ${status === 'error' ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10 focus:border-yellow-500/50 focus:ring-yellow-500/20'}
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                        `}
                                    />

                                    {/* Action Button */}
                                    <button
                                        type="submit"
                                        disabled={status === 'loading' || status === 'limited' || status === 'success' || !email}
                                        className={`
                                            absolute right-2 top-2 bottom-2 px-4 rounded-lg font-medium text-sm transition-all flex items-center gap-2
                                            ${status === 'success'
                                                ? 'bg-emerald-600 text-white cursor-default'
                                                : status === 'limited'
                                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-black hover:bg-yellow-400'
                                            }
                                            disabled:opacity-70
                                        `}
                                    >
                                        {status === 'loading' ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : status === 'success' ? (
                                            <>Terikirim <Check size={14} /></>
                                        ) : (
                                            <>Kirim <Send size={14} /></>
                                        )}
                                    </button>
                                </div>

                                {/* Status Message */}
                                {message && (
                                    <div className={`mt-3 text-xs flex items-center gap-1.5 ${status === 'error' ? 'text-red-400' :
                                            status === 'success' ? 'text-emerald-400' :
                                                status === 'limited' ? 'text-yellow-500/80' : 'text-gray-400'
                                        }`}>
                                        {status === 'error' && <AlertCircle size={12} />}
                                        {message}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                {/* --- GRID LINKS SECTION --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-12 mb-12">
                    {/* Column 1 */}
                    <div>
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <span className="w-1 h-4 bg-yellow-500 rounded-sm"></span>
                            Navigasi
                        </h4>
                        <ul className="space-y-3 text-sm font-medium">
                            {['Beranda', 'Tentang Kami', 'Katalog Produk', 'Event & Promo'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-yellow-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-0 group-hover:w-2 h-[1px] bg-yellow-500 transition-all duration-300"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <span className="w-1 h-4 bg-cyan-500 rounded-sm"></span>
                            Kategori
                        </h4>
                        <ul className="space-y-3 text-sm font-medium">
                            {['Batik & Fashion', 'Kuliner Khas', 'Kerajinan Tangan', 'Souvenir'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-0 group-hover:w-2 h-[1px] bg-cyan-500 transition-all duration-300"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 & 4 (Merged for Contact) */}
                    <div className="col-span-2 md:col-span-2">
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <span className="w-1 h-4 bg-emerald-500 rounded-sm"></span>
                            Hubungi Kami
                        </h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <div className="p-2 bg-white/5 rounded-lg text-emerald-400">
                                    <MapPin size={18} />
                                </div>
                                <span className="leading-relaxed">
                                    Jl. Raya Kaligawe Km.1 No.96, <br />
                                    Semarang, Jawa Tengah, Indonesia
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded-lg text-emerald-400">
                                    <Phone size={18} />
                                </div>
                                <span>(024) 6580015</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded-lg text-emerald-400">
                                    <Mail size={18} />
                                </div>
                                <span>info@kampoengsemarang.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* --- BOTTOM BAR --- */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Kampoeng Semarang. Dibuat dengan bangga di Indonesia.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </div>

            </div>
        </footer>
    )
}
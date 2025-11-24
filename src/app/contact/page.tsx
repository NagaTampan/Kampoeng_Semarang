"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { PublicLayout } from '@/components/layout/PublicLayout'

// --- Validation Schema ---
const contactSchema = z.object({
    name: z.string().min(2, "Nama terlalu pendek"),
    email: z.string().email("Format email tidak valid"),
    subject: z.string().min(5, "Subjek terlalu pendek"),
    message: z.string().min(10, "Pesan terlalu pendek (min. 10 karakter)"),
    honeypot: z.string().max(0, "Spam terdeteksi"), // Hidden field must be empty
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [mountTime, setMountTime] = useState(0)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        honeypot: '' // Hidden field for bots
    })

    // Set mount time for security check (bot usually submits instantly)
    useEffect(() => {
        setMountTime(Date.now())
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // 1. Security Check: Time-based (Anti-bot)
        const timeElapsed = Date.now() - mountTime
        if (timeElapsed < 2000) {
            // If submitted in less than 2 seconds, treat as bot
            console.warn("Submission too fast, likely a bot")
            return
        }

        // 2. Security Check: Rate Limiting (Client-side)
        const lastSubmit = localStorage.getItem('last_contact_submit')
        if (lastSubmit) {
            const timeSinceLast = Date.now() - parseInt(lastSubmit)
            if (timeSinceLast < 60000) { // 1 minute cooldown
                toast.error("Mohon tunggu sebentar sebelum mengirim pesan lagi.")
                return
            }
        }

        setIsSubmitting(true)

        try {
            // 3. Validation
            const validatedData = contactSchema.parse(formData)

            // Simulate API Delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Success Handling
            toast.success("Pesan terkirim! Terima kasih telah menghubungi kami.")
            localStorage.setItem('last_contact_submit', Date.now().toString())
            setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' })

        } catch (error) {
            if (error instanceof z.ZodError) {
                // Show first error
                toast.error(error.errors[0].message)
            } else {
                toast.error("Terjadi kesalahan. Silakan coba lagi.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <PublicLayout>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">

                {/* --- HERO SECTION --- */}
                <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-emerald-900 dark:bg-emerald-950">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/batik-pattern.png')]"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-950"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-sm font-bold tracking-wider mb-4 uppercase">
                                Hubungi Kami
                            </span>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
                                Mari Terhubung
                            </h1>
                            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                                Punya pertanyaan tentang produk, event, atau ingin berkolaborasi?
                                Tim Kampoeng Semarang siap membantu Anda.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* --- MAIN CONTENT --- */}
                <section className="container mx-auto px-4 -mt-20 relative z-20 pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN: Contact Info Cards */}
                        <motion.div
                            className="lg:col-span-1 space-y-6"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {/* Info Card 1 */}
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Lokasi Kami</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                    Jl. Raya Kaligawe Km.1 No.96<br />
                                    Semarang, Jawa Tengah<br />
                                    Indonesia
                                </p>
                            </div>

                            {/* Info Card 2 */}
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Telepon & WhatsApp</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-4">
                                    Senin - Minggu (08:00 - 21:00)
                                </p>
                                <a href="tel:0246580015" className="block text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                                    (024) 6580015
                                </a>
                            </div>

                            {/* Info Card 3 */}
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Email</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-4">
                                    Untuk kerjasama & pertanyaan umum
                                </p>
                                <a href="mailto:info@kampoengsemarang.com" className="block text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                                    info@kampoengsemarang.com
                                </a>
                            </div>
                        </motion.div>

                        {/* RIGHT COLUMN: Contact Form */}
                        <motion.div
                            className="lg:col-span-2"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                                <div className="p-8 md:p-12">
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white mb-2">Kirim Pesan</h2>
                                        <p className="text-slate-500 dark:text-slate-400">Isi formulir di bawah ini dan kami akan segera membalasnya.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Honeypot Field (Hidden) */}
                                        <div className="hidden">
                                            <input
                                                type="text"
                                                name="honeypot"
                                                value={formData.honeypot}
                                                onChange={handleChange}
                                                tabIndex={-1}
                                                autoComplete="off"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Nama Lengkap</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-slate-800 dark:text-white placeholder:text-slate-400"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-slate-800 dark:text-white placeholder:text-slate-400"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Subjek</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-slate-800 dark:text-white placeholder:text-slate-400"
                                                placeholder="Apa yang ingin Anda tanyakan?"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Pesan</label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={6}
                                                className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-slate-800 dark:text-white placeholder:text-slate-400 resize-none"
                                                placeholder="Tulis pesan Anda di sini..."
                                            ></textarea>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span>Mengirim...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Kirim Pesan</span>
                                                        <Send className="w-5 h-5" />
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <p className="text-xs text-slate-400 text-center mt-6 flex items-center justify-center gap-2">
                                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                                            Data Anda aman dan terenkripsi. Kami tidak membagikan email Anda.
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* --- MAP SECTION --- */}
                <section className="h-[400px] w-full relative grayscale hover:grayscale-0 transition-all duration-700">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.226077618846!2d110.44426537587663!3d-6.982626368377764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708cbf9583701b%3A0x627253549644e450!2sKampoeng%20Semarang!5e0!3m2!1sen!2sid!4v1700900000000!5m2!1sen!2sid"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <div className="absolute inset-0 bg-emerald-900/10 pointer-events-none"></div>
                </section>

            </div>
        </PublicLayout>
    )
}

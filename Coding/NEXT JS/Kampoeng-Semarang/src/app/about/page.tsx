"use client"

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Star, Heart, Users, Coffee, MapPin } from 'lucide-react'
import { PublicLayout } from '@/components/layout/PublicLayout'



const TEAM = [
    { name: "Budi Santoso", role: "Founder", img: "https://picsum.photos/seed/person1/400/400" },
    { name: "Siti Aminah", role: "Head Curator", img: "https://picsum.photos/seed/person2/400/400" },
    { name: "Joko Widodo", role: "Community Manager", img: "https://picsum.photos/seed/person3/400/400" },
]

const GALLERY = [
    "https://picsum.photos/seed/batik/600/800",
    "https://picsum.photos/seed/craft/600/600",
    "https://picsum.photos/seed/food/600/800",
    "https://picsum.photos/seed/place/600/600",
]

export default function AboutPage() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    return (
        <PublicLayout>
            <div ref={containerRef} className="bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">

                {/* --- HERO SECTION (Parallax) --- */}
                <section className="relative h-screen flex items-center justify-center overflow-hidden">
                    {/* Background Image with Parallax */}
                    <motion.div
                        style={{ y: yHero, opacity: opacityHero }}
                        className="absolute inset-0 z-0"
                    >
                        <Image
                            src="https://picsum.photos/seed/semarang_view/1920/1080"
                            alt="Kampoeng Semarang Background"
                            fill
                            className="object-cover brightness-[0.4] dark:brightness-[0.3]"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-50 dark:to-slate-950"></div>
                    </motion.div>

                    {/* Hero Content */}
                    <div className="relative z-10 container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            <span className="inline-block py-1 px-4 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white/90 text-sm font-bold tracking-[0.2em] uppercase mb-6">
                                Est. 2010
                            </span>
                            <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold text-white mb-8 leading-tight tracking-tight">
                                The Soul of <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Java</span>
                            </h1>
                            <p className="text-lg md:text-2xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
                                Lebih dari sekadar destinasi. Kami adalah penjaga warisan,
                                merayakan kekayaan budaya Semarang dalam setiap detil.
                            </p>
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <span className="text-[10px] uppercase tracking-widest">Scroll to Explore</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
                    </motion.div>
                </section>

                {/* --- STORY SECTION --- */}
                <section className="py-24 px-4 relative z-10">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-8">
                                    Merajut Kembali <br />
                                    <span className="text-emerald-600 dark:text-emerald-400 italic">Benang Sejarah</span>
                                </h2>
                                <div className="space-y-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                    <p>
                                        Kampoeng Semarang bermula dari sebuah kegelisahan: melihat perlahan lunturnya kebanggaan akan budaya lokal di tengah arus modernisasi.
                                    </p>
                                    <p>
                                        Kami membangun tempat ini bukan hanya sebagai pusat perbelanjaan, tetapi sebagai <strong>ruang temu</strong>. Di sini, pengrajin batik bertemu dengan desainer muda. Resep kuliner kuno bertemu dengan lidah milenial. Tradisi bertemu dengan inovasi.
                                    </p>
                                    <p>
                                        Setiap sudut Kampoeng Semarang bercerita. Dari arsitektur yang memadukan gaya kolonial dan Jawa, hingga aroma rempah yang menyambut Anda di pintu masuk.
                                    </p>
                                </div>


                            </motion.div>

                            <motion.div
                                className="relative h-[600px] w-full"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="absolute inset-0 bg-emerald-900/10 rounded-[2rem] rotate-3 transform translate-x-4 translate-y-4"></div>
                                <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-2xl">
                                    <Image
                                        src="https://picsum.photos/seed/interior/800/1200"
                                        alt="Interior Kampoeng Semarang"
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Quote Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                                        <p className="font-serif text-xl italic">
                                            "Kami tidak hanya menjual produk, kami menjual cerita dan kebanggaan."
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* --- VALUES SECTION (Horizontal Scroll Feel) --- */}
                <section className="py-24 bg-emerald-900 text-white relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/batik-pattern.png')]"></div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-16">
                            <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm">Nilai Kami</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4">Pilar Kehidupan Kami</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: Heart, title: "Cinta Budaya", desc: "Melestarikan warisan leluhur dengan bangga." },
                                { icon: Users, title: "Pemberdayaan", desc: "Tumbuh bersama 150+ UMKM lokal." },
                                { icon: Star, title: "Kualitas Premium", desc: "Kurasi terbaik untuk kepuasan Anda." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2, duration: 0.6 }}
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group"
                                >
                                    <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <item.icon className="w-7 h-7 text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-emerald-200/70 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- GALLERY MASONRY --- */}
                <section className="py-24 px-4 bg-white dark:bg-slate-950">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                                Galeri Momen
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">Sekilas keindahan di setiap sudut Kampoeng Semarang</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px] md:h-[500px]">
                            {GALLERY.map((src, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`relative rounded-2xl overflow-hidden group ${i === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
                                        }`}
                                >
                                    <Image
                                        src={src}
                                        alt="Gallery"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- CTA SECTION --- */}
                <section className="py-24 px-4">
                    <div className="container mx-auto max-w-5xl">
                        <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white p-12 md:p-24 text-center">
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src="https://picsum.photos/seed/night/1920/800"
                                    alt="Night View"
                                    fill
                                    className="object-cover opacity-30"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8">
                                    Siap Menjelajah?
                                </h2>
                                <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                                    Datang dan rasakan sendiri kehangatan budaya Jawa yang sesungguhnya.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/contact"
                                        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        <MapPin size={20} />
                                        Rencanakan Kunjungan
                                    </Link>
                                    <Link
                                        href="/products"
                                        className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full font-bold transition-all hover:scale-105"
                                    >
                                        Lihat Katalog Online
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </PublicLayout>
    )
}
"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { ArrowRight, MapPin, ChevronLeft, ChevronRight } from "lucide-react"

// Mendaftarkan plugin
gsap.registerPlugin(ScrollTrigger)

// Data Gambar Carousel (Menggunakan Picsum)
const CAROUSEL_IMAGES = [
    { src: "https://ik.imagekit.io/scz4g7szo/KS/oleh.svg", label: "Pusat Oleh-Oleh" },
    { src: "https://ik.imagekit.io/scz4g7szo/KS/taman-ks.jpg", label: "Taman Asri" },
    { src: "https://ik.imagekit.io/scz4g7szo/KS/batik-ks.svg", label: "Galeri Batik" },
    { src: "https://ik.imagekit.io/scz4g7szo/KS/resto.svg", label: "Resto Cafe Asem Jawa" },
]

export default function Hero() {
    // Refs
    const heroRef = useRef<HTMLElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const bgImageRef = useRef<HTMLDivElement>(null)
    const decorationRef = useRef<HTMLDivElement>(null)
    const floatingImageRef = useRef<HTMLDivElement>(null)

    // State untuk Carousel
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    // Handler Next/Prev Image
    const handleNext = () => {
        if (isAnimating) return
        setIsAnimating(true)
        setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
        setTimeout(() => setIsAnimating(false), 500)
    }

    const handlePrev = () => {
        if (isAnimating) return
        setIsAnimating(true)
        setCurrentIndex((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length)
        setTimeout(() => setIsAnimating(false), 500)
    }

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline()

            // 1. Setup Awal
            gsap.set(bgImageRef.current, { scale: 1.2 })

            // 2. Animasi Intro
            tl.to(bgImageRef.current, {
                opacity: 1,
                duration: 1.5,
                ease: "power2.inOut",
            })
                .from(decorationRef.current, {
                    rotation: -45,
                    opacity: 0,
                    scale: 0.8,
                    duration: 1.5,
                    ease: "power3.out"
                }, "-=1")
                .from(contentRef.current?.querySelectorAll(".animate-item") || [], {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power3.out",
                }, "-=1")
                .from(floatingImageRef.current, {
                    x: 50,
                    opacity: 0,
                    duration: 1.2,
                    ease: "power3.out"
                }, "-=1.2")

            // 3. Parallax Scroll
            gsap.to(bgImageRef.current, {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            })

            // Parallax Gambar Kanan (Lebih cepat = efek 3D)
            gsap.to(floatingImageRef.current, {
                yPercent: -15,
                ease: "none",
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            })

            // 4. Dekorasi Putar
            gsap.to(decorationRef.current, {
                rotation: 360,
                duration: 60,
                repeat: -1,
                ease: "linear"
            })

        }, heroRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center overflow-hidden transition-colors duration-500 bg-emerald-50 dark:bg-emerald-950"
        >
            {/* --- 1. BACKGROUND LAYER --- */}
            <div ref={bgImageRef} className="absolute inset-0 z-0 w-full h-[120%] -top-[10%] opacity-0">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/95 via-emerald-50/80 to-emerald-50/30 dark:from-emerald-950/95 dark:via-emerald-950/80 dark:to-emerald-950/40 z-10" />
                <Image
                    src="https://picsum.photos/seed/bg_texture/1920/1080"
                    alt="Background Texture"
                    fill
                    priority
                    className="object-cover opacity-50 dark:opacity-40 grayscale-[20%]"
                    sizes="100vw"
                />
            </div>

            {/* --- 2. DECORATIVE ELEMENT (Batik) --- */}
            <div
                ref={decorationRef}
                className="absolute -right-20 md:right-0 top-1/4 w-[500px] h-[500px] md:w-[800px] md:h-[800px] z-0 pointer-events-none opacity-10 dark:opacity-20"
            >
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path
                        className="fill-emerald-600 dark:fill-yellow-500"
                        d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.3,82.2,22.9,71.3,34.3C60.4,45.7,49.9,54.9,38.3,61.9C26.7,68.9,14,73.7,-0.4,74.4C-14.8,75.1,-28.1,71.7,-40.5,65.1C-52.9,58.5,-64.4,48.7,-72.7,36.5C-81,24.3,-86.1,9.7,-84.3,-4.2C-82.5,-18.1,-73.8,-31.3,-63.3,-41.8C-52.8,-52.3,-40.5,-60.1,-27.7,-68.2C-14.9,-76.3,-1.6,-84.7,13.2,-86.3C28,-87.9,56,-82.8,44.7,-76.4Z"
                        transform="translate(100 100)"
                    />
                </svg>
            </div>

            {/* --- 3. CONTENT CONTAINER --- */}
            <div className="container relative z-20 mx-auto px-4 md:px-6 pt-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* --- KOLOM KIRI: TEKS & BUTTON --- */}
                    <div ref={contentRef} className="max-w-2xl">
                        {/* Badge */}
                        <div className="animate-item inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-yellow-600/10 dark:bg-yellow-500/20 border border-yellow-600/30 dark:border-yellow-500/50 backdrop-blur-sm mt-6">
                            <span className="w-2 h-2 rounded-full bg-yellow-600 dark:bg-yellow-400 animate-pulse"></span>
                            <span className="text-yellow-700 dark:text-yellow-300 text-sm font-bold tracking-wider uppercase">
                                Pusat Oleh-oleh Semarang
                            </span>
                        </div>

                        <h1 className="animate-item font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-emerald-950 dark:text-white transition-colors duration-300">
                            One Stop<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-500 dark:from-yellow-300 dark:to-yellow-500">
                                Shopping
                            </span>
                        </h1>

                        <p className="animate-item text-lg md:text-xl text-emerald-800/80 dark:text-gray-300 mb-8 leading-relaxed border-l-4 border-yellow-500 pl-6">
                            Jelajahi keindahan budaya, cita rasa kuliner legendaris, dan kerajinan tangan terbaik Semarang dalam satu destinasi.
                        </p>

                        {/* BUTTONS */}
                        <div className="animate-item flex flex-col sm:flex-row gap-4 mb-8">
                            <Link
                                href="/contact"
                                className="group relative w-full sm:w-auto min-w-[200px] py-3 bg-emerald-800 dark:bg-yellow-500 text-white dark:text-emerald-950 rounded-full font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Belanja Sekarang
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>

                            <a
                                href="https://www.google.com/maps?sca_esv=0b1aadbb54d51ce1&output=search&q=Kampoeng+Semarang&source=lnms&fbs=AIIjpHwYn5PYZFUMfY6GOBRRFeKwIhsYlvQ8TQO08Ar3Kuk2WjsVNYrp-OGcZSb_GqBizAZR6vKROFNLhETxb1icv9rAsBpTBlue0_HfzaXZ70cIgjl-Njb0TrbE5Bj9SLoGG02GI7NEEmWiXw7HI8XWcfq8h0ZKGMrF_Hs8kKxcrSJHfPf3K6qzExbpGuMOmz4Xod20ferAUeuybpL3uqG3dW_mmd0G8A&entry=mc&ved=1t:200715&ictx=111"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group w-full sm:w-auto min-w-[200px] py-3 bg-transparent border border-emerald-800/30 dark:border-white/30 hover:bg-emerald-100 dark:hover:bg-white/10 text-emerald-900 dark:text-white rounded-full font-semibold text-base transition-all duration-300 active:scale-95 flex items-center justify-center"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <MapPin className="w-4 h-4 text-emerald-700 dark:text-yellow-400" />
                                    Kunjungi Kami
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* --- KOLOM KANAN: CAROUSEL IMAGE --- */}
                    <div ref={floatingImageRef} className="relative hidden lg:block h-[550px] w-full max-w-[500px] mx-auto">
                        {/* Frame Border Artistik */}
                        <div className="absolute inset-4 border-2 border-yellow-500/30 rounded-[2rem] z-0 rotate-3 translate-x-4 translate-y-4"></div>

                        {/* Main Image Container */}
                        <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-900/20 dark:shadow-black/50 bg-gray-200 dark:bg-gray-800">

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent z-10 pointer-events-none"></div>

                            {/* Dynamic Image from Picsum */}
                            {CAROUSEL_IMAGES.map((img, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'}`}
                                >
                                    <Image
                                        src={img.src}
                                        alt={img.label}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                </div>
                            ))}

                            {/* --- CAROUSEL CONTROLS & INFO --- */}
                            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 flex items-end justify-between">
                                {/* Label Text */}
                                <div>
                                    <p className="text-yellow-300 text-xs font-bold uppercase tracking-wider mb-1 animate-pulse">
                                        Featured Spot
                                    </p>
                                    <p className="font-serif text-2xl text-white drop-shadow-md">
                                        {CAROUSEL_IMAGES[currentIndex].label}
                                    </p>
                                </div>

                                {/* Navigation Buttons (Swipe Look) */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrev}
                                        className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all active:scale-90"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="w-12 h-12 rounded-full bg-yellow-500 hover:bg-yellow-400 text-emerald-950 shadow-lg flex items-center justify-center transition-all active:scale-90 transform hover:rotate-3"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- 4. SCROLL INDICATOR --- */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-50 dark:opacity-70 animate-bounce">
                <span className="text-[10px] uppercase tracking-widest text-emerald-800 dark:text-white/80">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-emerald-800 dark:from-yellow-400 to-transparent"></div>
            </div>
        </section>
    )
}
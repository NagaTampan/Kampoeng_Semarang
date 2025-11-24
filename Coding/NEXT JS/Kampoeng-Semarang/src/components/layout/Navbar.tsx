'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
    Home,
    Info,
    ShoppingBag,
    Calendar,
    Phone,
    Menu,
    X,
    Leaf,
    Sun,
    Moon
} from 'lucide-react'

const NAV_ITEMS = [
    { label: 'Beranda', href: '/', icon: Home },
    { label: 'Tentang', href: '/about', icon: Info },
    { label: 'Produk', href: '/products', icon: ShoppingBag },
    { label: 'Acara', href: '/events', icon: Calendar },
    { label: 'Kontak', href: '/contact', icon: Phone },
]

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav
            className={`
                fixed top-0 z-50 w-full transition-all duration-500 ease-out
                border-b-2 
                ${isScrolled
                    ? 'bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md border-yellow-500 shadow-lg py-2'
                    : 'bg-white/10 dark:bg-black/20 backdrop-blur-sm border-transparent py-4'
                }
            `}
        >
            <div className="container mx-auto px-4 md:px-6 max-w-screen-2xl">
                <div className="flex items-center justify-between">

                    {/* --- LOGO SECTION --- */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 group"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <div className={`
                            relative flex items-center justify-center w-10 h-10 rounded-xl shadow-sm transition-all duration-300
                            bg-emerald-700 text-yellow-400
                            group-hover:bg-yellow-400 group-hover:text-emerald-800 group-hover:scale-110
                        `}>
                            <Leaf size={20} className="fill-current" />
                        </div>
                        <div className="flex flex-col">
                            <span className={`
                                font-serif text-xl font-bold leading-none tracking-wide transition-colors
                                ${isScrolled ? 'text-emerald-900 dark:text-emerald-50' : 'text-emerald-900 dark:text-white'}
                                group-hover:text-yellow-600 dark:group-hover:text-yellow-400
                            `}>
                                Kampoeng
                            </span>
                            <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 tracking-[0.2em] uppercase">
                                Semarang
                            </span>
                        </div>
                    </Link>

                    {/* --- DESKTOP MENU (UPDATED HOVER) --- */}
                    <div className="hidden md:flex items-center space-x-1 bg-white/80 dark:bg-black/40 p-1.5 rounded-full border border-emerald-100 dark:border-emerald-900 shadow-sm">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out
                                        flex items-center gap-2 group
                                        
                                        /* Logic Warna: Active vs Inactive vs Hover */
                                        ${isActive
                                            ? 'bg-emerald-700 text-yellow-400 shadow-md translate-y-0'
                                            // Perubahan disini: Hover menggunakan warna kuning terang agar kontras
                                            : 'text-emerald-800 dark:text-emerald-100 hover:bg-yellow-100 hover:text-yellow-700 dark:hover:bg-emerald-800 dark:hover:text-yellow-300 hover:-translate-y-0.5'
                                        }
                                    `}
                                >
                                    <span className={`
                                        transition-transform duration-300 
                                        ${isActive ? 'scale-100' : 'group-hover:scale-110'}
                                    `}>
                                        {item.label}
                                    </span>

                                    {/* Efek titik kecil saat hover (non-aktif) */}
                                    {!isActive && (
                                        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-1 bg-yellow-500 rounded-full transition-all duration-300 group-hover:w-1/2 opacity-0 group-hover:opacity-100"></span>
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {/* --- TOGGLE & MOBILE BTN --- */}
                    <div className="flex items-center gap-3">
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className={`
                                    relative w-14 h-7 rounded-full p-1 transition-all duration-300 shadow-inner border
                                    ${theme === 'dark'
                                        ? 'bg-emerald-950 border-emerald-800 hover:border-yellow-400'
                                        : 'bg-yellow-100 border-yellow-300 hover:border-emerald-400'
                                    }
                                `}
                            >
                                <div
                                    className={`
                                        absolute top-1 w-5 h-5 rounded-full shadow-md transform transition-transform duration-500 flex items-center justify-center
                                        ${theme === 'dark' ? 'translate-x-7 bg-emerald-500 text-white' : 'translate-x-0 bg-white text-orange-500'}
                                    `}
                                >
                                    {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
                                </div>
                            </button>
                        )}

                        <button
                            className="md:hidden p-2 text-emerald-800 dark:text-yellow-400 bg-white/50 dark:bg-black/20 hover:bg-yellow-100 dark:hover:bg-emerald-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MOBILE MENU (UPDATED HOVER) --- */}
            <div
                className={`
                    md:hidden absolute top-[100%] left-0 w-full 
                    bg-white dark:bg-emerald-950 
                    border-b-4 border-yellow-500 shadow-xl
                    transition-all duration-300 ease-in-out origin-top
                    ${isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}
                `}
            >
                <div className="p-4 space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                                    flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                                    ${isActive
                                        ? 'bg-emerald-700 text-yellow-400 font-bold pl-6 shadow-md'
                                        // Hover Mobile dibuat sangat terang backgroundnya
                                        : 'text-emerald-800 dark:text-emerald-100 hover:bg-yellow-50 dark:hover:bg-emerald-900 hover:text-yellow-700 dark:hover:text-yellow-400 hover:pl-6 hover:font-semibold'
                                    }
                                `}
                            >
                                <Icon size={20} className={isActive ? "animate-pulse" : ""} />
                                {item.label}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
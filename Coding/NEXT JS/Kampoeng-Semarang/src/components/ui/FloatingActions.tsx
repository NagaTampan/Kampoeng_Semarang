"use client"

import { useState, useEffect } from 'react'
import { ArrowUp, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FloatingActionsProps {
    whatsappNumber?: string
    whatsappMessage?: string
}

export function FloatingActions({
    whatsappNumber = "6281234567890", // Ganti dengan nomor WA Kampoeng Semarang
    whatsappMessage = "Halo! Saya tertarik dengan Kampoeng Semarang"
}: FloatingActionsProps) {
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [isHoveringWA, setIsHoveringWA] = useState(false)

    // Detect scroll position
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    // WhatsApp click handler
    const handleWhatsAppClick = () => {
        const encodedMessage = encodeURIComponent(whatsappMessage)
        const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
        window.open(waUrl, '_blank')
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0, opacity: 0, y: 20 }}
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollToTop}
                        className="group relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center overflow-hidden"
                        aria-label="Scroll to top"
                    >
                        {/* Animated background pulse */}
                        <span className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></span>

                        {/* Icon */}
                        <ArrowUp className="w-6 h-6 text-white relative z-10 group-hover:animate-bounce" />

                        {/* Tooltip */}
                        <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                            Kembali ke Atas
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* WhatsApp Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWhatsAppClick}
                onMouseEnter={() => setIsHoveringWA(true)}
                onMouseLeave={() => setIsHoveringWA(false)}
                className="group relative w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center overflow-hidden"
                aria-label="Chat on WhatsApp"
            >
                {/* Animated ripple effect */}
                <motion.span
                    className="absolute inset-0 bg-white/30 rounded-full"
                    animate={isHoveringWA ? {
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* Icon with subtle animation */}
                <MessageCircle className="w-6 h-6 text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" />

                {/* Notification badge */}
                <motion.span
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Tooltip */}
                <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                    Chat via WhatsApp
                </span>
            </motion.button>

            {/* Decorative glow effect */}
            <div className="absolute inset-0 -z-10 blur-xl opacity-30">
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-emerald-500 rounded-full"></div>
                <div className="absolute bottom-16 right-0 w-20 h-20 bg-green-500 rounded-full"></div>
            </div>
        </div>
    )
}

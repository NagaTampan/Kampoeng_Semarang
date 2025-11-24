"use client"

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { FloatingActions } from '@/components/ui/FloatingActions'

export function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <FloatingActions
                whatsappNumber="6281234567890" // Ganti dengan nomor WA Kampoeng Semarang
                whatsappMessage="Halo! Saya tertarik dengan produk dan event di Kampoeng Semarang 🎨"
            />
        </>
    )
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kampoeng Semarang | One Stop Shopping & Leisure",
    template: "%s | Kampoeng Semarang",
  },
  description:
    "Experience the best of Semarang's culture, culinary delights, and craftsmanship. One Stop Shopping & Leisure destination in Central Java.",
  keywords: ["Semarang", "Oleh-oleh", "Batik", "Wisata Semarang", "Kuliner Semarang", "Shopping", "Leisure"],
  openGraph: {
    title: "Kampoeng Semarang | One Stop Shopping & Leisure",
    description:
      "Experience the best of Semarang's culture, culinary delights, and craftsmanship.",
    url: "https://kampoengsemarang.com",
    siteName: "Kampoeng Semarang",
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",            // Favicon utama
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",  // opsional jika punya
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

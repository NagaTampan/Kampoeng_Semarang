import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Konfigurasi gambar eksternal
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "amsihfvyeifafrbbbukw.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      // --- TAMBAHKAN INI ---
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
    ],
  },

  // Menghilangkan logo indikator NEXT.JS di pojok kiri bawah (dev mode)
  devIndicators: false,
  // Alternatif (jika ingin tetap pakai buildActivity saja)
  // devIndicators: {
  //   buildActivity: false,
  // },
};

export default nextConfig;

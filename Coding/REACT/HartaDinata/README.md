# 🏆 Harta Dinata - Luxury Gold Investment Platform

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

> **Harta Dinata** adalah landing page modern untuk perusahaan investasi emas terkemuka di Indonesia. Platform ini menampilkan produk emas berkualitas tinggi, informasi investasi, dan edukasi lengkap tentang bisnis emas dengan desain luxury yang memukau.

---

## ✨ Fitur Utama

### 🎯 **Landing Page Premium**
- **Hero Section Interaktif** - Carousel dinamis dengan 4 slide yang menampilkan keunggulan perusahaan
- **Live Gold Price** - Tampilan harga emas real-time dengan visualisasi grafik
- **Corporate Legacy Timeline** - Perjalanan sejarah perusahaan dengan animasi interaktif
- **Business Ecosystem** - Visualisasi ekosistem bisnis dan kemitraan

### 💎 **Katalog Produk**
- **Featured Products** - Showcase produk emas unggulan (batangan ANTAM, perhiasan)
- **Product Cards** dengan rating, reviews, harga, dan sertifikasi
- **Interactive Hover Effects** - 3D transformasi dan animasi smooth
- **Quick Add to Cart** - Tombol aksi cepat dengan animasi

### 📊 **Tools & Kalkulator**
- **Investment Calculator** - Kalkulator investasi emas interaktif
- **ROI Simulator** - Simulasi return on investment berdasarkan periode

### 🎓 **Edukasi & Learning**
- **Reseller Education** - Video edukasi untuk mitra reseller
- **Why Invest Gold** - Informasi lengkap keuntungan investasi emas
- **Corporate Videos** - Dokumenter perusahaan dan tutorial

### 🗺️ **Jaringan & Kredibilitas**
- **National Presence Map** - Peta interaktif kehadiran nasional
- **Security Technology** - Fitur keamanan dan teknologi yang digunakan
- **Video Testimonials** - Testimoni video dari customer
- **Trust Badges** - Badge kepercayaan dan sertifikasi

### 🎨 **Design & UX**
- **Luxury Dark Theme** - Tema gelap dengan aksen emas metalik
- **Gold Particles Animation** - Partikel emas bergerak di background
- **Glassmorphism Effects** - Efek kaca modern dan elegan
- **Framer Motion Animations** - Animasi halus dan profesional
- **Responsive Design** - Optimal di semua perangkat (mobile, tablet, desktop)

---

## 🛠️ Tech Stack

### **Frontend Core**
- **React 18.3.1** - Library UI modern dengan hooks
- **TypeScript 5.8.3** - Type safety dan better DX
- **Vite 5.4.19** - Build tool super cepat dengan HMR

### **Styling & UI**
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - Komponen UI berkualitas tinggi
- **Radix UI** - Headless UI components yang accessible
- **Framer Motion 11.18.2** - Library animasi powerful

### **State & Data**
- **TanStack Query 5.83.0** - Data fetching dan caching
- **React Hook Form 7.61.1** - Form management
- **Zod 3.25.76** - Schema validation

### **Routing & Navigation**
- **React Router DOM 6.30.1** - Client-side routing

### **Additional Libraries**
- **Lucide React** - Icon library modern
- **date-fns** - Date manipulation
- **Recharts** - Charting library
- **next-themes** - Theme management

### **Development Tools**
- **ESLint** - Code linting
- **Vitest** - Unit testing framework
- **Testing Library** - Component testing utilities

---

## 📁 Struktur Proyek

```
HartaDinata/
├── public/                      # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components (49 komponen)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (46 more)
│   │   │
│   │   ├── BusinessEcosystem.tsx
│   │   ├── CTASection.tsx
│   │   ├── CorporateLegacy.tsx
│   │   ├── CorporateVideos.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── Footer.tsx
│   │   ├── GoldParticles.tsx
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx       # Hero carousel dengan 4 slides
│   │   ├── InvestmentCalculator.tsx
│   │   ├── LiveGoldPrice.tsx
│   │   ├── NationalPresenceMap.tsx
│   │   ├── NavLink.tsx
│   │   ├── ResellerEducation.tsx
│   │   ├── SecurityTechnology.tsx
│   │   ├── Testimonials.tsx
│   │   ├── TrustBadges.tsx
│   │   ├── VideoCard.tsx
│   │   ├── VideoModal.tsx
│   │   ├── VideoTestimonials.tsx
│   │   └── WhyInvestGold.tsx
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── lib/                     # Utility functions
│   │   └── utils.ts
│   │
│   ├── pages/                   # Page components
│   │   ├── Index.tsx            # Main landing page
│   │   └── NotFound.tsx         # 404 page
│   │
│   ├── test/                    # Test files
│   │
│   ├── App.tsx                  # Root component
│   ├── index.css                # Global styles & theme
│   └── main.tsx                 # Entry point
│
├── .gitignore
├── components.json              # shadcn/ui configuration
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts           # Tailwind & theme configuration
├── tsconfig.json
├── vite.config.ts               # Vite configuration
└── vitest.config.ts             # Vitest configuration
```

---

## 🚀 Getting Started

### **Prerequisites**
Pastikan Anda sudah menginstall:
- **Node.js** (v16 atau lebih tinggi) - [Download](https://nodejs.org/)
- **npm** atau **bun** package manager

### **Installation**

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd HartaDinata
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau jika menggunakan bun
   bun install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:5173
   ```

---

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server dengan HMR

# Build
npm run build            # Production build
npm run build:dev        # Development build

# Preview
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint

# Testing
npm run test             # Run tests once
npm run test:watch       # Run tests in watch mode
```

---

## 🎨 Design System

### **Color Palette**
- **Primary Gold**: `hsl(43, 74%, 49%)` - Metallic gold untuk aksen utama
- **Background**: `hsl(0, 0%, 4%)` - Deep black untuk background
- **Foreground**: `hsl(43, 30%, 90%)` - Warm white untuk text
- **Accent**: `hsl(171, 60%, 15%)` - Dark emerald untuk variasi
- **Success**: `hsl(152, 69%, 40%)` - Green untuk status positif

### **Typography**
- **Display/Headings**: Playfair Display (serif)
- **Decorative**: Cinzel (serif)
- **Body**: Inter (sans-serif)
- **Monospace/Price**: JetBrains Mono

### **Custom Utilities**
- `.text-gold-gradient` - Text dengan gradient emas
- `.glass-card` - Glassmorphism card effect
- `.btn-luxury` - Luxury button dengan gold gradient
- `.gold-shine` - Animasi kilau emas
- `.card-3d` - 3D tilt effect pada hover

---

## 🔧 Configuration Files

### **Vite Configuration** (`vite.config.ts`)
- React SWC plugin untuk fast refresh
- Path aliases (`@/` → `src/`)

### **Tailwind Configuration** (`tailwind.config.ts`)
- Custom color scheme (gold palette)
- Custom animations (shimmer, float, fade-in, glow)
- Custom utilities dan components

### **TypeScript Configuration**
- Strict mode enabled
- ES2020 target
- Path mapping untuk imports

---

## 🌐 Deployment

### **Build for Production**
```bash
npm run build
```

Output akan ada di folder `dist/`

### **Deployment Options**

#### **Vercel** (Recommended)
1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Deploy otomatis

#### **Netlify**
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `dist`

#### **GitHub Pages**
```bash
npm run build
# Deploy dist/ folder ke gh-pages branch
```

#### **Static Hosting**
Upload folder `dist/` ke any static hosting:
- AWS S3 + CloudFront
- Firebase Hosting
- Cloudflare Pages

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Watch mode for TDD
npm run test:watch
```

Testing stack:
- **Vitest** - Test runner
- **Testing Library** - Component testing
- **jsdom** - DOM simulation

---

## 📱 Responsive Breakpoints

```css
sm:   640px   /* Small devices (landscape phones) */
md:   768px   /* Medium devices (tablets) */
lg:   1024px  /* Large devices (laptops) */
xl:   1280px  /* Extra large devices (desktops) */
2xl:  1536px  /* 2X large devices (large desktops) */
```

Semua komponen sudah fully responsive dan dioptimalkan untuk semua screen sizes.

---

## 🎯 Key Components Overview

### **HeroSection**
- Auto-rotating carousel dengan 4 slides
- Manual navigation dengan arrow buttons
- Indicator dots untuk tracking
- Video modal integration
- Animated content dengan Framer Motion

### **LiveGoldPrice**
- Real-time price display
- Price change indicators (up/down)
- Historical price chart
- Formatted currency (IDR)

### **FeaturedProducts**
- Grid layout (responsive)
- Product cards dengan 3D hover effect
- Rating & reviews
- Quick add to cart
- Price dengan discount calculation

### **InvestmentCalculator**
- Interactive form input
- Real-time calculation
- ROI visualization
- Period selection

### **VideoTestimonials**
- Video grid layout
- Modal video player
- Customer testimonials
- Rating stars

---

## 🔐 Best Practices

### **Code Organization**
- ✅ Component per file
- ✅ Shared UI components di `/ui`
- ✅ Custom hooks di `/hooks`
- ✅ Utils di `/lib`

### **Styling**
- ✅ Tailwind utility classes
- ✅ Custom CSS di `index.css` untuk reusable styles
- ✅ Consistent design tokens
- ✅ Dark mode ready

### **Performance**
- ✅ Lazy loading untuk heavy components
- ✅ Image optimization
- ✅ Code splitting
- ✅ Optimized bundle size

### **Accessibility**
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus management

---

## 🤝 Contributing

Contributions are welcome! Untuk berkontribusi:

1. Fork repository ini
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### **Development Guidelines**
- Follow existing code style
- Write meaningful commit messages
- Add tests untuk new features
- Update documentation jika diperlukan

---

## 📄 License

Project ini menggunakan lisensi sesuai dengan ketentuan perusahaan **Harta Dinata**.

---

## 👨‍💻 Author

**Aaron** - Developer

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Radix UI](https://www.radix-ui.com/) - Headless UI primitives
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Unsplash](https://unsplash.com/) - Stock images

---

## 📞 Support

Untuk pertanyaan atau support, silakan hubungi:
- Email: [your-email@example.com]
- Website: [https://your-website.com]

---

<div align="center">
  <strong>Built with ❤️ using React, TypeScript, and Tailwind CSS</strong>
</div>

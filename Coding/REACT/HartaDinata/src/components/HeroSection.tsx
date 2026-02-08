import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, ChevronLeft, ChevronRight, Building2, Shield, Award, TrendingUp, Factory, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoModal from './VideoModal';

const heroSlides = [
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=1920',
    title: 'Jaringan Nasional',
    subtitle: '100+ Mitra Terpercaya',
    description: 'Bergabung dengan ribuan reseller sukses di seluruh Indonesia dalam ekosistem bisnis emas terbesar.',
    badge: 'Program Kemitraan Reseller Terbaik',
    icon: Users,
  },
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=1920',
    title: 'Warisan Kepercayaan',
    subtitle: 'Emas Indonesia',
    description: 'Lebih dari tiga dekade melayani negeri sebagai produsen dan distributor emas terintegrasi dengan standar kualitas tanpa kompromi.',
    badge: 'Standard of Excellence since 1988',
    icon: Building2,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1624365168968-f283d506c6b6?q=80&w=1920',
    title: 'Inovasi Manufaktur',
    subtitle: 'Karya Anak Bangsa',
    description: 'Menghadirkan teknologi manufaktur modern dengan sentuhan artistik untuk menciptakan produk perhiasan kelas dunia.',
    badge: 'Precision Manufacturing',
    icon: Factory,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1920',
    title: 'Investasi Masa Depan',
    subtitle: 'Bernilai Kekal',
    description: 'Emas bukan sekadar logam, ia adalah simbol kemapanan dan langkah cerdas untuk melindungi nilai kekayaan lintas generasi.',
    badge: 'Secure Growth Asset',
    icon: TrendingUp,
  },
];

const HeroSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const currentData = heroSlides[currentSlide];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={currentData.image}
            alt={currentData.title}
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay with Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
          {/* Gold Tint Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        </motion.div>
      </AnimatePresence>

      {/* Subtle Animated Gold Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />
        <motion.div
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/3 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 pt-24">
        <div className="max-w-4xl">
          {/* Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`badge-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card mb-8 border border-primary/30"
            >
              <currentData.icon className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">{currentData.badge}</span>
            </motion.div>
          </AnimatePresence>

          {/* Headline */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight mb-6">
                <span className="text-white">{currentData.title}</span>
                <br />
                <span className="text-gold-gradient">{currentData.subtitle}</span>
              </h1>
            </motion.div>
          </AnimatePresence>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${currentSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed"
            >
              {currentData.description}
            </motion.p>
          </AnimatePresence>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <Button className="btn-luxury px-8 py-6 text-base group">
              Mulai Investasi Emas
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="ghost"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:text-white px-8 py-6 text-base group"
              onClick={() => setIsVideoOpen(true)}
            >
              <Play className="mr-2 w-5 h-5" />
              Tonton Video Profil
            </Button>

          </motion.div>
          {/* Trust Badges - Horizontal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-8 mb-6"
          >
            {[
              { icon: Building2, value: 'IDX: HRTA', label: 'Bursa Efek Indonesia' },
              { icon: Award, value: '30+ Tahun', label: 'Pengalaman Industri' },
              { icon: Shield, value: '100+', label: 'Jaringan Nasional' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">{item.value}</p>
                  <p className="text-xs text-white/60">{item.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 z-20 hidden lg:block">
        <div className="flex items-baseline gap-1 text-white">
          <span className="text-2xl font-mono-price font-bold text-primary">
            {String(currentSlide + 1).padStart(2, '0')}
          </span>
          <span className="text-white/40">/</span>
          <span className="text-sm text-white/40">
            {String(heroSlides.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <motion.div
          key={currentSlide}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 6, ease: 'linear' }}
          className="h-full bg-gradient-to-r from-primary to-gold-400"
        />
      </div>

      {/* Carousel Controls */}
      <div className="absolute right-6 sm:right-8 lg:right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-8">
        {/* Prev Button */}
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all group hover:border-primary/50"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Slide Indicators */}
        <div className="flex flex-col items-center gap-4">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1 transition-all duration-700 rounded-full ${index === currentSlide
                ? 'h-10 bg-primary shadow-[0_0_15px_rgba(197,160,40,0.5)]'
                : 'h-2 bg-white/20 hover:bg-white/40'
                }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all group hover:border-primary/50"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoId="guY-H85Kcx4?si=FoHifWnRbSA5odKE"
        title="Profil PT Hartadinata Abadi Tbk"
        description="Mengenal lebih dekat perjalanan dan visi perusahaan emas terintegrasi terbesar di Indonesia"
      />
    </section>
  );
};

export default HeroSection;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Users,
  MapPin,
  Calendar
} from 'lucide-react';
import VideoModal from './VideoModal';

const videoTestimonials = [
  {
    id: 'dQw4w9WgXcQ',
    name: 'Budi Hartono',
    role: 'Reseller Premium',
    location: 'Jakarta',
    joinDate: '2019',
    rating: 5,
    revenue: 'Rp 500jt+/bulan',
    growth: '+340%',
    thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    quote: 'Bergabung dengan Hartadinata mengubah hidup saya. Dari karyawan biasa, kini saya memiliki bisnis emas yang sukses.',
    duration: '4:30',
  },
  {
    id: 'dQw4w9WgXcQ',
    name: 'Siti Aminah',
    role: 'Reseller Gold',
    location: 'Surabaya',
    joinDate: '2020',
    rating: 5,
    revenue: 'Rp 300jt+/bulan',
    growth: '+280%',
    thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    quote: 'Sistem tanpa stok sangat memudahkan ibu rumah tangga seperti saya untuk berbisnis dari rumah.',
    duration: '5:15',
  },
  {
    id: 'dQw4w9WgXcQ',
    name: 'Ahmad Fauzi',
    role: 'Reseller Diamond',
    location: 'Bandung',
    joinDate: '2018',
    rating: 5,
    revenue: 'Rp 1M+/bulan',
    growth: '+520%',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    quote: 'Dari modal nol, kini saya memiliki tim reseller sendiri. Support dari Hartadinata luar biasa.',
    duration: '6:45',
  },
  {
    id: 'dQw4w9WgXcQ',
    name: 'Linda Wijaya',
    role: 'Reseller Elite',
    location: 'Medan',
    joinDate: '2021',
    rating: 5,
    revenue: 'Rp 250jt+/bulan',
    growth: '+190%',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    quote: 'Platform digital yang mudah digunakan dan margin keuntungan yang kompetitif.',
    duration: '3:50',
  },
];

const categories = ['Semua', 'Premium', 'Gold', 'Diamond', 'Elite'];

const VideoTestimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<typeof videoTestimonials[0] | null>(null);

  const filteredTestimonials = activeCategory === 'Semua'
    ? videoTestimonials
    : videoTestimonials.filter(t => t.role.includes(activeCategory));

  const currentTestimonial = filteredTestimonials[activeIndex] || filteredTestimonials[0];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length);
  };

  const openVideo = (testimonial: typeof videoTestimonials[0]) => {
    setSelectedVideo(testimonial);
    setIsVideoOpen(true);
  };

  return (
    <section id="testimonials" className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
      <div className="absolute inset-0 bg-radial-gold opacity-15" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-6">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            <span className="text-gold-gradient">Kisah Sukses</span>
            <br />
            Mitra Reseller Kami
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Dengarkan langsung cerita inspiratif dari para reseller yang telah sukses bersama Hartadinata
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setActiveIndex(0);
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                ? 'bg-primary text-primary-foreground shadow-gold'
                : 'glass-card text-foreground hover:glass-card-gold'
                }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Main Testimonial Carousel */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="grid md:grid-cols-2 gap-8 glass-card-gold rounded-3xl overflow-hidden min-h-[500px]"
            >
              {/* Video Thumbnail Side */}
              <div
                onClick={() => openVideo(currentTestimonial)}
                className="relative h-full min-h-[400px] w-full cursor-pointer group"
              >
                <img
                  src={currentTestimonial.thumbnail}
                  alt={currentTestimonial.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center gold-shine shadow-gold"
                  >
                    <Play className="w-10 h-10 text-primary-foreground fill-current ml-1" />
                  </motion.div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4 px-3 py-1.5 glass-card rounded-full">
                  <span className="text-sm font-medium text-foreground">{currentTestimonial.duration}</span>
                </div>

                {/* Video Label */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Video Testimoni
                </div>
              </div>

              {/* Content Side */}
              <div className="p-6 md:p-8 flex flex-col justify-center">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg md:text-xl text-foreground italic mb-6 leading-relaxed">
                  "{currentTestimonial.quote}"
                </blockquote>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="glass-card rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Omzet Bulanan</p>
                    <p className="font-mono-price text-lg text-primary font-semibold">
                      {currentTestimonial.revenue}
                    </p>
                  </div>
                  <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <p className="text-xs text-muted-foreground">Pertumbuhan</p>
                    </div>
                    <p className="font-mono-price text-lg text-success font-semibold">
                      {currentTestimonial.growth}
                    </p>
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary">
                    <img
                      src={currentTestimonial.thumbnail}
                      alt={currentTestimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{currentTestimonial.name}</h4>
                    <p className="text-sm text-primary">{currentTestimonial.role}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {currentTestimonial.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Sejak {currentTestimonial.joinDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:glass-card-gold transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {filteredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex
                    ? 'w-8 bg-primary'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:glass-card-gold transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>


      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          isOpen={isVideoOpen}
          onClose={() => {
            setIsVideoOpen(false);
            setSelectedVideo(null);
          }}
          videoId={selectedVideo.id}
          title={`Testimoni ${selectedVideo.name}`}
          description={`${selectedVideo.role} dari ${selectedVideo.location}`}
        />
      )}
    </section>
  );
};

export default VideoTestimonials;

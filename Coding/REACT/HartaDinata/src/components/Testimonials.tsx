import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ahmad Wijaya',
    role: 'Pengusaha',
    location: 'Jakarta',
    image: 'AW',
    rating: 5,
    content:
      'Sudah 5 tahun saya berinvestasi emas di AURUM. Pelayanan sangat profesional, harga transparan, dan pengiriman selalu aman. Portofolio emas saya sudah tumbuh 45% sejak pertama kali investasi.',
  },
  {
    id: 2,
    name: 'Siti Rahayu',
    role: 'Dokter',
    location: 'Surabaya',
    image: 'SR',
    rating: 5,
    content:
      'Sebagai dokter yang sibuk, saya butuh platform investasi yang mudah dan terpercaya. AURUM memberikan semua itu. Aplikasinya user-friendly dan tim support sangat responsif.',
  },
  {
    id: 3,
    name: 'Budi Santoso',
    role: 'Pensiunan PNS',
    location: 'Bandung',
    image: 'BS',
    rating: 5,
    content:
      'Emas adalah warisan terbaik untuk anak cucu. Saya rutin membeli emas setiap bulan di AURUM. Prosesnya mudah dan sertifikatnya lengkap. Sangat direkomendasikan!',
  },
  {
    id: 4,
    name: 'Diana Putri',
    role: 'Fashion Designer',
    location: 'Bali',
    image: 'DP',
    rating: 5,
    content:
      'Koleksi perhiasan AURUM sangat elegan dan berkualitas tinggi. Saya sudah membeli beberapa cincin dan kalung untuk koleksi pribadi. Desainnya timeless dan craftsmanship-nya luar biasa.',
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-radial-gold opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Testimoni
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            <span className="text-gold-gradient">Apa Kata Mereka?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ribuan investor telah mempercayakan investasi emas mereka kepada AURUM.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Testimonial */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="glass-card-gold rounded-3xl p-8 sm:p-12"
              >
                {/* Quote Icon */}
                <Quote className="w-12 h-12 text-primary/30 mb-6" />

                {/* Content */}
                <p className="text-lg sm:text-xl text-foreground leading-relaxed mb-8 italic">
                  "{testimonials[activeIndex].content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center gold-shine">
                    <span className="text-xl font-bold text-primary-foreground">
                      {testimonials[activeIndex].image}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">
                      {testimonials[activeIndex].name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[activeIndex].role} • {testimonials[activeIndex].location}
                    </p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:glass-card-gold transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:glass-card-gold transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-8 bg-primary'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

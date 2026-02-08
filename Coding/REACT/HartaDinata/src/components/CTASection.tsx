import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section id="contact" className="py-16 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=1920"
          alt="Gold Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/85 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/15 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-gold mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Promo Terbatas</span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="text-foreground">Mulai Perjalanan</span>
            <br />
            <span className="text-gold-gradient">Investasi Emas Anda</span>
          </h2>

          {/* Description */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Daftar sekarang dan dapatkan bonus 0.5 gram emas untuk pembelian pertama minimal 10 gram.
            Promo berlaku hingga akhir bulan ini.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-luxury px-10 py-7 text-lg group animate-glow">
              Daftar Sekarang
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="ghost" className="btn-luxury-outline px-10 py-7 text-lg">
              Konsultasi Gratis
            </Button>
          </div>

          {/* Trust Note */}
          <p className="text-sm text-muted-foreground mt-8">
            ✓ Gratis Biaya Registrasi &nbsp;&nbsp; ✓ Tanpa Minimum Investasi &nbsp;&nbsp; ✓ Batal Kapan Saja
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;

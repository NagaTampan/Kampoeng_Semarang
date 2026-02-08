import { motion } from 'framer-motion';
import { Shield, TrendingUp, Gem, Clock, Building2, Lock } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'Lindung Nilai Inflasi',
    description: 'Emas telah terbukti sebagai pelindung nilai terhadap inflasi selama berabad-abad.',
  },
  {
    icon: TrendingUp,
    title: 'Pertumbuhan Stabil',
    description: 'Harga emas cenderung naik dalam jangka panjang dengan volatilitas yang lebih rendah.',
  },
  {
    icon: Gem,
    title: 'Aset Berwujud',
    description: 'Berbeda dengan investasi digital, emas adalah aset fisik yang dapat Anda sentuh dan simpan.',
  },
  {
    icon: Clock,
    title: 'Likuiditas Tinggi',
    description: 'Emas mudah dijual kapan saja dengan harga pasar yang transparan.',
  },
  {
    icon: Building2,
    title: 'Diakui Global',
    description: 'Emas diterima sebagai alat tukar dan investasi di seluruh dunia.',
  },
  {
    icon: Lock,
    title: 'Warisan Generasi',
    description: 'Investasi emas dapat diwariskan ke generasi berikutnya tanpa kehilangan nilai.',
  },
];

const WhyInvestGold = () => {
  return (
    <section id="investment" className="py-16 relative overflow-hidden">
      {/* Background with Company Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=1920"
          alt="Gold Investment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/90" />
        <div className="absolute inset-0 bg-radial-gold opacity-20" />
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:pt-4"
          >
            <span className="inline-block text-primary text-sm font-medium tracking-widest uppercase mb-4">
              Keunggulan Investasi
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              Mengapa{' '}
              <span className="text-gold-gradient">Investasi Emas?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Emas bukan sekadar simbol kekayaan, melainkan instrumen <span className="text-white italic">safe haven</span> yang telah teruji dalam melindungi aset melintasi berbagai krisis ekonomi global. Dengan likuiditas yang tinggi dan nilai yang cenderung meningkat secara stabil, investasi emas bersama Hartadinata memberikan fondasi keamanan finansial yang kokoh bagi masa depan Anda.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Sebagai pemimpin pasar yang terintegrasi penuh, Hartadinata memastikan setiap produk emas memiliki standar kemurnian tertinggi dan sertifikasi internasional. Kami berkomitmen untuk memudahkan akses investasi emas bagi seluruh lapisan masyarakat melalui ekosistem yang transparan, aman, dan berkelanjutan.
            </p>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-display font-bold text-gold-gradient mb-2">35+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Tahun Warisan</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-display font-bold text-gold-gradient mb-2">100+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Titik Distribusi</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-display font-bold text-gold-gradient mb-2">1M+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Masyarakat Terlayani</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content - Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 hover:glass-card-gold transition-all duration-500 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyInvestGold;

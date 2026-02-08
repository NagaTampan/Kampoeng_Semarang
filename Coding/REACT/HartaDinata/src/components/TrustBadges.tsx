import { motion } from 'framer-motion';
import { Shield, Award, Lock, CheckCircle, Building2, Landmark, Factory, TrendingUp } from 'lucide-react';

const badges = [
  {
    icon: Landmark,
    title: 'Tercatat di BEI',
    description: 'Kode saham HRTA di Bursa Efek Indonesia',
  },
  {
    icon: Shield,
    title: 'Terdaftar OJK',
    description: 'Diawasi oleh Otoritas Jasa Keuangan',
  },
  {
    icon: Award,
    title: 'SNI Certified',
    description: 'Standar Nasional Indonesia untuk Emas',
  },
  {
    icon: Factory,
    title: 'ISO 9001:2015',
    description: 'Sistem manajemen mutu internasional',
  },
  {
    icon: Lock,
    title: 'SSL Secured',
    description: 'Enkripsi data 256-bit',
  },
  {
    icon: CheckCircle,
    title: 'LBMA Compliant',
    description: 'Standar London Bullion Market',
  },
  {
    icon: Building2,
    title: '30+ Tahun',
    description: 'Pengalaman industri emas',
  },
  {
    icon: TrendingUp,
    title: 'Market Leader',
    description: 'Produsen emas terbesar Indonesia',
  },
];

const TrustBadges = () => {
  return (
    <section className="py-16 border-y border-border bg-secondary/20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className="text-lg font-medium text-muted-foreground">
            Dipercaya oleh 500,000+ Investor & Pelanggan Indonesia
          </h3>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 rounded-xl glass-card flex items-center justify-center mb-3 group-hover:glass-card-gold transition-all duration-300">
                <badge.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xs font-semibold text-foreground mb-0.5">{badge.title}</h4>
              <p className="text-[10px] text-muted-foreground leading-tight">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;

import { motion } from 'framer-motion';
import { Factory, Gem, Truck, Store, Smartphone, ArrowRight } from 'lucide-react';

const ecosystemSteps = [
  {
    icon: Factory,
    title: 'Refinery',
    subtitle: 'Pemurnian Emas',
    description: 'Fasilitas pemurnian emas modern dengan standar internasional untuk menghasilkan emas murni 999.9.',
    color: 'from-amber-500 to-yellow-600',
  },
  {
    icon: Gem,
    title: 'Manufacturing',
    subtitle: 'Produksi',
    description: 'Pabrik manufaktur terintegrasi untuk produksi emas batangan dan perhiasan berkualitas tinggi.',
    color: 'from-yellow-500 to-gold-500',
  },
  {
    icon: Truck,
    title: 'Distribution',
    subtitle: 'Distribusi',
    description: 'Jaringan distribusi nasional yang menjangkau seluruh Indonesia dengan sistem logistik aman.',
    color: 'from-gold-400 to-amber-500',
  },
  {
    icon: Store,
    title: 'Retail',
    subtitle: 'Penjualan',
    description: 'Lebih dari 100 mitra toko emas tersebar di seluruh Indonesia melayani pelanggan langsung.',
    color: 'from-amber-400 to-yellow-500',
  },
  {
    icon: Smartphone,
    title: 'Digital',
    subtitle: 'Platform Online',
    description: 'Platform digital modern untuk investasi emas, transaksi online, dan tracking portofolio.',
    color: 'from-yellow-400 to-gold-400',
  },
];

const BusinessEcosystem = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-medium text-primary tracking-widest uppercase mb-4">
            Bisnis Terintegrasi
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            <span className="text-foreground">Ekosistem Emas</span>{' '}
            <span className="text-gold-gradient">Terlengkap</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Hartadinata adalah satu-satunya perusahaan di Indonesia dengan integrasi vertikal
            penuh dari pemurnian hingga penjualan digital.
          </p>
        </motion.div>

        {/* Ecosystem Flow */}
        <div className="relative">
          {/* Desktop Flow */}
          <div className="hidden lg:flex items-center justify-between gap-2">
            {ecosystemSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-1 relative group"
              >
                {/* Card */}
                <div className="glass-card rounded-2xl p-6 text-center hover:glass-card-gold transition-all duration-500 h-full">
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center gold-shine`}>
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-primary mb-3">{step.subtitle}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>

                {/* Arrow (except last) */}
                {index < ecosystemSteps.length - 1 && (
                  <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Mobile Flow */}
          <div className="lg:hidden space-y-4">
            {ecosystemSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-5 flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 flex-shrink-0 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center gold-shine`}>
                    <step.icon className="w-7 h-7 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-primary font-medium">Step {index + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < ecosystemSteps.length - 1 && (
                  <div className="absolute left-7 top-full w-px h-4 bg-gradient-to-b from-primary to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
};

export default BusinessEcosystem;

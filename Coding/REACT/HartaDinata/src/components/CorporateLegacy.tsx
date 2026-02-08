import { motion } from 'framer-motion';
import { Factory, Award, TrendingUp, Building2, Globe, Users } from 'lucide-react';

const milestones = [
  {
    year: '1990',
    title: 'Awal Mula',
    description: 'Didirikan sebagai produsen perhiasan handmade di Bekasi dengan visi menjadi pemimpin industri emas Indonesia.',
    icon: Factory,
  },
  {
    year: '2000',
    title: 'Ekspansi Manufaktur',
    description: 'Pembangunan fasilitas produksi modern dengan kapasitas produksi meningkat 10x lipat.',
    icon: Building2,
  },
  {
    year: '2010',
    title: 'Integrasi Vertikal',
    description: 'Mendirikan unit refinery dan menjadi perusahaan emas terintegrasi pertama di Indonesia.',
    icon: TrendingUp,
  },
  {
    year: '2017',
    title: 'IPO di BEI',
    description: 'Pencatatan saham perdana di Bursa Efek Indonesia dengan kode saham HRTA.',
    icon: Award,
  },
  {
    year: '2020',
    title: 'Ekspansi Digital',
    description: 'Peluncuran platform digital untuk investasi emas dan transaksi bullion online.',
    icon: Globe,
  },
  {
    year: '2024',
    title: 'Market Leader',
    description: 'Menjadi produsen emas batangan dan perhiasan terbesar dengan jaringan 100+ mitra nasional.',
    icon: Users,
  },
];

const CorporateLegacy = () => {
  return (
    <section id="about" className="py-16 relative overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1920"
          alt="Gold Manufacturing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

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
            Perjalanan Kami
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            <span className="text-foreground">30+ Tahun</span>{' '}
            <span className="text-gold-gradient">Warisan Kepercayaan</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Dari workshop perhiasan kecil hingga menjadi perusahaan emas terintegrasi
            terbesar di Indonesia yang tercatat di Bursa Efek Indonesia.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary to-primary/50 hidden lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center ${index % 2 === 0 ? '' : 'lg:direction-rtl'
                  }`}
              >
                {/* Content */}
                <div className={`${index % 2 === 0 ? 'lg:text-right lg:pr-16' : 'lg:text-left lg:pl-16 lg:col-start-2'}`}>
                  <div className={`glass-card rounded-2xl p-6 lg:p-8 hover:glass-card-gold transition-all duration-500 ${index % 2 === 0 ? '' : ''
                    }`}>
                    <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                        <milestone.icon className="w-7 h-7 text-primary" />
                      </div>
                      <div className={index % 2 === 0 ? 'lg:text-right' : ''}>
                        <span className="font-mono-price text-2xl text-primary font-bold">{milestone.year}</span>
                        <h3 className="text-xl font-semibold text-foreground">{milestone.title}</h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
                  </div>
                </div>

                {/* Timeline Node (desktop only) */}
                <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-primary gold-shine" />
                  <div className="absolute w-8 h-8 rounded-full bg-primary/20 animate-ping" />
                </div>

                {/* Empty column for alternating layout */}
                <div className={`hidden lg:block ${index % 2 === 0 ? '' : 'lg:col-start-1 lg:row-start-1'}`} />
              </motion.div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
};

export default CorporateLegacy;

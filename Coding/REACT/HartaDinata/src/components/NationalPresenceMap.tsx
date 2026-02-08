import { motion } from 'framer-motion';
import { MapPin, Store, Users, Truck } from 'lucide-react';

const regions = [
  { name: 'Sumatera', stores: 25, cities: ['Medan', 'Palembang', 'Pekanbaru'] },
  { name: 'Jawa', stores: 45, cities: ['Jakarta', 'Surabaya', 'Bandung', 'Semarang'] },
  { name: 'Kalimantan', stores: 12, cities: ['Balikpapan', 'Banjarmasin', 'Pontianak'] },
  { name: 'Sulawesi', stores: 10, cities: ['Makassar', 'Manado'] },
  { name: 'Bali & Nusa Tenggara', stores: 8, cities: ['Denpasar', 'Mataram'] },
];

const stats = [
  { icon: Store, value: '100+', label: 'Mitra Toko Emas' },
  { icon: MapPin, value: '34', label: 'Provinsi Terjangkau' },
  { icon: Users, value: '500K+', label: 'Pelanggan Aktif' },
  { icon: Truck, value: '24/7', label: 'Layanan Pengiriman' },
];

const NationalPresenceMap = () => {
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
            Jangkauan Nasional
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            <span className="text-foreground">Hadir di Seluruh</span>{' '}
            <span className="text-gold-gradient">Indonesia</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Jaringan distribusi dan mitra yang luas memastikan produk Hartadinata
            dapat diakses oleh seluruh masyarakat Indonesia.
          </p>
        </motion.div>

        {/* Map Visualization */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Indonesia Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden h-full min-h-[400px]">
              {/* Stylized Indonesia Map SVG */}
              <svg
                viewBox="0 0 800 400"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Simplified Indonesia archipelago shapes */}
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Sumatera */}
                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  d="M80 150 L120 100 L160 80 L180 120 L170 180 L140 220 L100 200 L70 180 Z"
                  fill="url(#goldGradient)"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  className="hover:fill-primary/30 transition-colors cursor-pointer"
                />

                {/* Jawa */}
                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  d="M180 260 L280 250 L360 260 L380 270 L350 290 L250 290 L180 280 Z"
                  fill="url(#goldGradient)"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  className="hover:fill-primary/30 transition-colors cursor-pointer"
                />

                {/* Kalimantan */}
                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  d="M280 120 L340 80 L400 100 L420 160 L400 220 L340 230 L300 200 L280 160 Z"
                  fill="url(#goldGradient)"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  className="hover:fill-primary/30 transition-colors cursor-pointer"
                />

                {/* Sulawesi */}
                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  d="M480 120 L520 80 L540 100 L530 140 L560 180 L540 220 L500 200 L480 160 Z"
                  fill="url(#goldGradient)"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  className="hover:fill-primary/30 transition-colors cursor-pointer"
                />

                {/* Bali & Nusa Tenggara */}
                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  d="M400 290 L440 280 L500 285 L540 290 L530 310 L470 310 L410 305 Z"
                  fill="url(#goldGradient)"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  className="hover:fill-primary/30 transition-colors cursor-pointer"
                />

                {/* Papua */}
                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  d="M620 140 L700 120 L750 160 L740 220 L680 240 L620 200 Z"
                  fill="url(#goldGradient)"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  className="hover:fill-primary/30 transition-colors cursor-pointer"
                />

                {/* Location pins */}
                {[
                  { x: 120, y: 140 },  // Sumatera
                  { x: 280, y: 270 },  // Jawa
                  { x: 350, y: 160 },  // Kalimantan
                  { x: 510, y: 160 },  // Sulawesi
                  { x: 440, y: 295 },  // Bali
                ].map((pin, i) => (
                  <motion.g
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r="8"
                      fill="hsl(var(--primary))"
                      className="animate-pulse"
                    />
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r="16"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  </motion.g>
                ))}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs text-muted-foreground">Hub Distribusi</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Regional List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              {regions.map((region, index) => (
                <motion.div
                  key={region.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-xl p-4 hover:glass-card-gold transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{region.name}</h4>
                    <span className="text-primary font-mono-price">{region.stores} Mitra</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {region.cities.map((city) => (
                      <span
                        key={city}
                        className="text-xs px-2 py-1 rounded-md bg-secondary/50 text-muted-foreground"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl p-6 text-center hover:glass-card-gold transition-all duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="block font-mono-price text-2xl lg:text-3xl text-primary font-bold mb-1">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default NationalPresenceMap;

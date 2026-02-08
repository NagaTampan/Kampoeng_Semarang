import { motion } from 'framer-motion';
import { Shield, Fingerprint, QrCode, Lock, Eye, CheckCircle } from 'lucide-react';

const securityFeatures = [
  {
    icon: QrCode,
    title: 'QR Code Authenticity',
    description: 'Setiap produk dilengkapi QR code unik untuk verifikasi keaslian secara instan.',
  },
  {
    icon: Fingerprint,
    title: 'Serial Number Tracking',
    description: 'Nomor seri individual yang tercatat dalam sistem untuk pelacakan produk.',
  },
  {
    icon: Shield,
    title: 'Anti-Counterfeit Technology',
    description: 'Teknologi anti-pemalsuan canggih dengan hologram dan micro-text khusus.',
  },
  {
    icon: Lock,
    title: 'Secure Packaging',
    description: 'Kemasan anti-tamper dengan segel keamanan berlapis untuk proteksi produk.',
  },
  {
    icon: Eye,
    title: 'Blockchain Verification',
    description: 'Sistem verifikasi berbasis blockchain untuk transparansi rantai pasokan.',
  },
  {
    icon: CheckCircle,
    title: 'Certificate Validation',
    description: 'Sertifikat digital yang dapat diverifikasi online kapan saja.',
  },
];

const SecurityTechnology = () => {
  return (
    <section id="security" className="py-16 relative overflow-hidden">
      {/* Background with Gradient Colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a2922] via-background to-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Gold Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
                          linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-sm font-medium text-primary tracking-widest uppercase mb-4">
              Keamanan Produk
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              <span className="text-foreground">Teknologi</span>{' '}
              <span className="text-gold-gradient">Keamanan Terdepan</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Kami memahami bahwa kepercayaan adalah fundamental dalam investasi emas. Oleh karena itu, Hartadinata mengintegrasikan <span className="text-white italic">multi-layer security system</span> yang menggabungkan fitur keamanan fisik pada produk dengan sistem verifikasi digital berbasis teknologi terkini.
            </p>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Mulai dari nomor seri unik hingga enkripsi data yang aman, setiap inovasi dirancang untuk memberikan jaminan keaslian mutlak. Hal ini memastikan bahwa setiap aset yang Anda miliki bukan hanya bernilai tinggi secara ekonomi, tetapi juga terlindungi secara legal dan teknis dari risiko pemalsuan.
            </p>
          </motion.div>

          {/* Right Content - Security Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-2 gap-4">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card rounded-xl p-5 hover:glass-card-gold transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>


      </div>
    </section>
  );
};

export default SecurityTechnology;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Building2, Factory, ShieldCheck, Truck, Award } from 'lucide-react';
import VideoModal from './VideoModal';

const corporateVideos = [
  {
    id: 'guY-H85Kcx4?si=znPbBDPju1E8tSuP',
    title: 'Profil Perusahaan',
    description: 'Perjalanan 30+ tahun PT Hartadinata Abadi Tbk sebagai pemimpin industri emas Indonesia',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    duration: '8:45',
    icon: Building2,
  },
  {
    id: 'T-e2iyz8DGw?si=Ef4f1KVDaEYHVBoL',
    title: 'Proses Manufaktur',
    description: 'Behind the scenes fasilitas produksi emas dengan teknologi modern',
    thumbnail: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80',
    duration: '12:30',
    icon: Factory,
  },
  {
    id: 'HN0YBJ2xECc?si=OGepLo2laosXChMK',
    title: 'Quality Control',
    description: 'Standar kualitas internasional dalam setiap produk emas kami',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    duration: '6:15',
    icon: ShieldCheck,
  },
  {
    id: '4vIRltAn1nY?si=ZH1HoBbENqN5GJyF',
    title: 'Distribusi Nasional',
    description: 'Jaringan distribusi yang menjangkau seluruh Indonesia',
    thumbnail: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80',
    duration: '5:45',
    icon: Truck,
  },
];

const CorporateVideos = () => {
  const [activeVideo, setActiveVideo] = useState<{
    id: string;
    title: string;
    description: string;
  } | null>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23D4AF37' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-6">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Transparansi Korporat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            <span className="text-gold-gradient">Kenali Lebih Dekat</span>
            <br />
            PT Hartadinata Abadi Tbk
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Video dokumenter yang menampilkan proses produksi, standar kualitas, dan perjalanan perusahaan
          </p>
        </motion.div>

        {/* Video Grid - Luxury Gallery Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {corporateVideos.map((video, index) => (
            <motion.div
              key={video.id + index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              onClick={() => setActiveVideo({
                id: video.id,
                title: video.title,
                description: video.description
              })}
              className="relative group cursor-pointer"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden glass-card-gold">
                {/* Thumbnail */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />

                {/* Gold Border Glow on Hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-2xl transition-all duration-500" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: hoveredIndex === index ? 1.1 : 1,
                      boxShadow: hoveredIndex === index ? '0 0 40px rgba(212, 175, 55, 0.4)' : '0 0 0px rgba(212, 175, 55, 0)'
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/90 flex items-center justify-center gold-shine"
                  >
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground fill-current ml-1" />
                  </motion.div>
                </div>

                {/* Icon Badge */}
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center">
                    <video.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>

                {/* Duration */}
                <div className="absolute top-4 right-4 px-3 py-1.5 glass-card rounded-full">
                  <span className="text-sm font-medium text-foreground">{video.duration}</span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-white/80 text-sm sm:text-base line-clamp-2">
                    {video.description}
                  </p>
                </div>

                {/* Decorative Corner */}
                <div className="absolute bottom-0 right-0 w-24 h-24 opacity-20">
                  <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-primary rounded-br-xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-6">
            Lihat lebih banyak video di channel YouTube resmi kami
          </p>
          <a
            href="https://www.youtube.com/watch?v=guY-H85Kcx4"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 glass-card-gold rounded-full text-foreground hover:text-primary transition-colors"
          >
            <Play className="w-5 h-5" />
            <span className="font-medium">YouTube Channel Hartadinata</span>
          </a>
        </motion.div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          videoId={activeVideo.id}
          title={activeVideo.title}
          description={activeVideo.description}
        />
      )}
    </section>
  );
};

export default CorporateVideos;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Play,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  UserPlus,
  ListChecks,
  TrendingUp,
  DollarSign,
  Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoModal from './VideoModal';

const educationVideos = [
  {
    id: 'guY-H85Kcx4',
    title: 'Pelajari Cara Sukses Menjadi Mitra Reseller',
    description: 'Panduan lengkap untuk memulai bisnis reseller emas dengan sistem terintegrasi.',
    duration: '25:00',
    views: '12K+',
    category: 'MASTERCLASS',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'v1',
    title: 'Strategi Marketing & Penjualan Emas',
    description: 'Tips dan trik meningkatkan omzet penjualan melalui media sosial.',
    duration: '15:45',
    views: '8K+',
    category: 'MARKETING',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'v2',
    title: 'Mengenal Berbagai Jenis Produk Emas',
    description: 'Edukasi mendalam tentang perbedaan emas batangan dan perhiasan.',
    duration: '10:20',
    views: '15K+',
    category: 'PRODUCT KNOWLEDGE',
    thumbnail: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'v3',
    title: 'Sistem Dropship & Logistics Hartadinata',
    description: 'Bagaimana cara memproses order tanpa harus menyetok barang.',
    duration: '12:30',
    views: '6K+',
    category: 'OPERATIONAL',
    thumbnail: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&w=400&q=80'
  }
];

// Static steps remain as they are part of the UI flow, 
const businessSteps = [
  {
    step: 1,
    title: 'Daftar Gratis',
    description: 'Registrasi sebagai mitra reseller tanpa biaya awal apapun.',
    icon: UserPlus
  },
  {
    step: 2,
    title: 'Akses Katalog',
    description: 'Dapatkan akses ke seluruh produk emas premium kami.',
    icon: ListChecks
  },
  {
    step: 3,
    title: 'Jual & Promosi',
    description: 'Gunakan materi marketing yang sudah kami sediakan.',
    icon: TrendingUp
  },
  {
    step: 4,
    title: 'Terima Komisi',
    description: 'Nikmati keuntungan dari setiap penjualan yang Anda lakukan.',
    icon: DollarSign
  }
];

const ResellerEducation = () => {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>('');
  const [selectedVideoDesc, setSelectedVideoDesc] = useState<string>('');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(4); // For infinite scroll simulation
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('is_featured', { ascending: false }) // Featured first
        .order('created_at', { ascending: false });

      if (!error && data) {
        setVideos(data.map(v => ({
          id: v.video_id,
          title: v.title,
          description: v.description,
          duration: v.duration,
          views: v.views,
          category: v.category,
          isFeatured: v.is_featured,
          thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.video_id}/maxresdefault.jpg`
        })));
      }
      setLoading(false);
    };
    fetchVideos();
  }, []);

  const openVideo = (video: any) => {
    setSelectedVideoId(video.id);
    setSelectedVideoTitle(video.title);
    setSelectedVideoDesc(video.description);
  };

  // Logic to handle infinite scroll in the sidebar
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
      if (displayCount < videos.length) {
        setDisplayCount(prev => Math.min(prev + 4, videos.length));
      }
    }
  };

  // Use dynamic videos if available, otherwise fallback to educationVideos
  const displayVideos = videos.length > 0 ? videos : educationVideos;
  const mainVideo = displayVideos[0];
  const playlistVideos = displayVideos.slice(1).slice(0, displayCount);

  if (loading) {
    return (
      <div className="py-20 bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section id="reseller" className="py-16 relative overflow-hidden bg-[#0A0A0A]">
      {/* ... */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col mb-12">
          <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase mb-3">Education Hub</span>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black text-white leading-[1.1] font-cinzel tracking-tight mb-6">
            Academy <span className="text-gold-gradient italic">Reseller</span>
          </h2>
          <p className="text-white/40 max-w-2xl text-lg font-light leading-relaxed">
            Kami menyediakan materi edukasi komprehensif untuk mendampingi perjalanan sukses Anda sebagai mitra resmi.
          </p>
        </div>

        {/* Video Player & Playlist Layout */}
        <div className="flex flex-col lg:flex-row gap-6 mb-16">
          {/* Main Player Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[72%] group relative aspect-video lg:aspect-[2/1] rounded-2xl overflow-hidden cursor-pointer border border-white/5 shadow-2xl lg:max-h-[440px]"
            onClick={() => openVideo(mainVideo)}
          >
            <img
              src={mainVideo.thumbnail}
              alt={mainVideo.title}
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 brightness-[0.7]"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform duration-500">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-black fill-current ml-1" />
              </div>
            </div>

            <div className="absolute top-6 left-6 flex gap-3">
              <span className="px-3 py-1 bg-primary text-black text-[10px] font-bold rounded-md uppercase tracking-wider">
                {mainVideo.isFeatured ? 'Video Pilihan' : 'Video Utama'}
              </span>
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white/80 text-[10px] font-bold rounded-md border border-white/10">
                {mainVideo.duration || '20:00'}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 pt-24 bg-gradient-to-t from-black via-black/60 to-transparent">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2 line-clamp-1">
                {mainVideo.title}
              </h3>
              <p className="text-white/60 text-sm sm:text-base max-w-2xl font-light line-clamp-2">
                {mainVideo.description}
              </p>
            </div>
          </motion.div>

          {/* Playlist Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onScroll={handleScroll}
            className="w-full lg:w-[28%] flex flex-col gap-3 overflow-y-auto scrollbar-hide lg:max-h-[440px]"
          >
            {playlistVideos.map((video, idx) => (
              <motion.div
                key={video.id + idx}
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex flex-col gap-3 p-3 rounded-xl bg-[#111] hover:bg-[#151515] border border-white/5 hover:border-primary/20 transition-all cursor-pointer group"
                onClick={() => openVideo(video)}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover brightness-[0.6] group-hover:brightness-100 transition-all duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-gold">
                      <Play className="w-4 h-4 text-black fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-[8px] rounded">
                    {video.duration || '15:00'}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">{video.title}</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-white/40 line-clamp-1 leading-relaxed font-light">{video.category}</p>
                    <span className="text-[8px] text-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase">Tonton</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Steps Flow Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white tracking-tight">
              Langkah Mudah <span className="text-gold-gradient italic font-black">Memulai Bisnis</span>
            </h2>
            <Button
              variant="ghost"
              onClick={() => navigate('/articles')}
              className="text-[10px] font-bold tracking-[0.2em] text-white/40 hover:text-primary leading-none uppercase h-auto p-0"
            >
              Lihat Semua<ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {businessSteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="p-10 rounded-[2.5rem] bg-[#111] border border-white/5 hover:border-primary/40 transition-all duration-700 h-full flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
                  {/* Premium Texture on Hover */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="w-9 h-9 rounded-full bg-primary text-black font-black text-xs flex items-center justify-center mb-8 shadow-gold relative z-10">
                    {item.step}
                  </div>

                  <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-10 group-hover:bg-primary/10 transition-all duration-500 group-hover:rotate-6 shadow-xl relative z-10">
                    <item.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>

                  <h4 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors relative z-10">{item.title}</h4>
                  <p className="text-sm text-white/30 leading-relaxed font-light px-2 relative z-10 group-hover:text-white/50 transition-colors">
                    {item.description}
                  </p>

                  {/* Visual Arrow Connecting Steps (Desktop only) */}
                  {index < businessSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-[65px] -right-3 text-primary/10 group-hover:text-primary/30 transition-colors">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Global Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          <Button className="btn-luxury px-12 py-8 text-base rounded-full shadow-[0_20px_40px_rgba(212,175,55,0.2)] hover:scale-105 transition-transform">
            Daftar Menjadi Mitra
          </Button>
          <button className="flex items-center gap-4 text-white hover:text-primary transition-all font-bold tracking-widest uppercase text-[10px]">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group">
              <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            Pelajari Skema Komisi
          </button>
        </motion.div>
      </div>

      <VideoModal
        isOpen={!!selectedVideoId}
        onClose={() => setSelectedVideoId(null)}
        videoId={selectedVideoId || ''}
        title={selectedVideoTitle}
        description={selectedVideoDesc}
      />
    </section>
  );
};

export default ResellerEducation;

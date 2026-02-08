import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ExternalLink, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title?: string;
  description?: string;
  youtubeChannelUrl?: string;
}

const VideoModal = ({
  isOpen,
  onClose,
  videoId,
  title,
  description,
  youtubeChannelUrl = 'https://youtube.com/@hartadinata'
}: VideoModalProps) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden"
          onClick={handleBackdropClick}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-background/95 backdrop-blur-2xl" />

          {/* Gold glow effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          </div>

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl max-h-[90vh] glass-card-gold rounded-[2rem] overflow-hidden border border-primary/20 flex flex-col shadow-[0_0_50px_rgba(230,185,64,0.15)] bg-black/40"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/20 shrink-0">
              <div className="overflow-hidden">
                {title && (
                  <h3 className="font-display text-lg font-bold text-foreground truncate uppercase tracking-widest">{title}</h3>
                )}
                {description && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-xl hover:bg-white/10"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-muted-foreground" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-xl hover:bg-destructive/10 text-foreground"
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Video Container - Responsive logic */}
            <div className="relative w-full flex-grow overflow-hidden bg-black flex items-center justify-center">
              <div className="relative w-full h-full max-h-[calc(90vh-180px)]">
                <div className="w-full h-full aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1&color=white`}
                    title={title || 'Video'}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 border-t border-border/20 bg-white/[0.02] shrink-0">
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-foreground">Ingin sukses seperti mereka?</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Gabung Mitra Hartadinata Sekarang</p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none h-12 rounded-xl border-primary/30 hover:bg-primary/10 tracking-widest text-[10px] font-black uppercase"
                  asChild
                >
                  <a href={youtubeChannelUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    YouTube
                  </a>
                </Button>
                <Button className="flex-1 sm:flex-none btn-luxury h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] shadow-gold">
                  Gabung Sekarang
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

    </AnimatePresence>
  );
};

export default VideoModal;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Eye, ExternalLink } from 'lucide-react';
import VideoModal from './VideoModal';

interface VideoCardProps {
  videoId: string;
  thumbnail?: string;
  title: string;
  description?: string;
  duration?: string;
  views?: string;
  category?: string;
  variant?: 'default' | 'compact' | 'featured';
}

const VideoCard = ({
  videoId,
  thumbnail,
  title,
  description,
  duration = '5:30',
  views = '10K',
  category,
  variant = 'default'
}: VideoCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const thumbnailUrl = thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (variant === 'compact') {
    return (
      <>
        <motion.div
          whileHover={{ scale: 1.02 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={() => setIsModalOpen(true)}
          className="flex gap-4 p-3 glass-card rounded-xl cursor-pointer group hover:glass-card-gold transition-all duration-300"
        >
          {/* Thumbnail */}
          <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden">
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
              <motion.div
                animate={{ scale: isHovered ? 1.1 : 1 }}
                className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center gold-shine"
              >
                <Play className="w-4 h-4 text-primary-foreground fill-current ml-0.5" />
              </motion.div>
            </div>
            {duration && (
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded">
                {duration}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h4>
            {category && (
              <span className="text-xs text-primary mt-1 inline-block">{category}</span>
            )}
            <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              <span>{views} views</span>
            </div>
          </div>
        </motion.div>

        <VideoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoId={videoId}
          title={title}
          description={description}
        />
      </>
    );
  }

  if (variant === 'featured') {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={() => setIsModalOpen(true)}
          className="relative glass-card-gold rounded-2xl overflow-hidden cursor-pointer group"
        >
          {/* Thumbnail */}
          <div className="relative aspect-video">
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: isHovered ? 1.15 : 1 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center gold-shine shadow-gold"
              >
                <Play className="w-10 h-10 text-primary-foreground fill-current ml-1" />
              </motion.div>
            </div>

            {/* Duration Badge */}
            {duration && (
              <div className="absolute top-4 right-4 px-3 py-1.5 glass-card rounded-full flex items-center gap-2">
                <Clock className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-foreground">{duration}</span>
              </div>
            )}

            {/* Category Badge */}
            {category && (
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary/90 rounded-full">
                <span className="text-xs font-medium text-primary-foreground">{category}</span>
              </div>
            )}

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
                {title}
              </h3>
              {description && (
                <p className="text-white/80 text-sm line-clamp-2">{description}</p>
              )}
            </div>
          </div>
        </motion.div>

        <VideoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoId={videoId}
          title={title}
          description={description}
        />
      </>
    );
  }

  // Default variant
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
        className="glass-card rounded-xl overflow-hidden cursor-pointer group hover:glass-card-gold transition-all duration-300"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: isHovered ? 1.15 : 1 }}
              transition={{ duration: 0.3 }}
              className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center gold-shine"
            >
              <Play className="w-7 h-7 text-primary-foreground fill-current ml-0.5" />
            </motion.div>
          </div>

          {/* Duration */}
          {duration && (
            <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {duration}
            </span>
          )}

          {/* Category */}
          {category && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-primary-foreground text-xs rounded-md font-medium">
              {category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h4 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h4>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{views} views</span>
            </div>
            <span className="flex items-center gap-1 text-primary group-hover:underline">
              Tonton <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </motion.div>

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoId={videoId}
        title={title}
        description={description}
      />
    </>
  );
};

export default VideoCard;

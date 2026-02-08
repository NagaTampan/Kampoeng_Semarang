import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Award, Tag, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { useEffect } from 'react';

interface ProductDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

const ProductDetailModal = ({ isOpen, onClose, product }: ProductDetailModalProps) => {

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

    if (!product) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Helper to clean HTML and preserve line breaks
    const cleanDescription = (html: string) => {
        if (!html) return '';
        // Replace block tags with double newlines
        let text = html.replace(/<\/p>/gi, '\n\n');
        text = text.replace(/<br\s*\/?>/gi, '\n');
        text = text.replace(/<\/div>/gi, '\n');
        text = text.replace(/<li>/gi, '• ');
        text = text.replace(/<\/li>/gi, '\n');

        // Strip all tags
        text = text.replace(/<[^>]+>/g, '');

        // Decode HTML entities (basic ones)
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value.trim();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full max-w-4xl bg-[#0f0f0f] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] md:max-h-[75vh]"
                    >
                        {/* Close Button */}
                        <div className="absolute top-4 right-4 z-20">
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 relative bg-[#050505] p-8 flex items-center justify-center">
                            {product.badge && (
                                <span className="absolute top-6 left-6 px-3 py-1 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-full z-10">
                                    {product.badge}
                                </span>
                            )}
                            <div className="relative w-full aspect-square max-w-[400px]">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                />
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto custom-scrollbar bg-[#111]">
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">
                                        {product.category}
                                    </span>
                                    {product.certification && (
                                        <div className="flex items-center gap-1.5 text-white/40">
                                            <Award className="w-3 h-3" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{product.certification}</span>
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight mb-4">
                                    {product.name}
                                </h2>
                                <div className="flex items-end gap-3 mb-6 pb-6 border-b border-white/5">
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="text-lg text-white/30 line-through mb-1">
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                    )}
                                    <span className="text-3xl font-mono-price font-bold text-gold-gradient">
                                        {formatPrice(product.price)}
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-primary" />
                                            Deskripsi Produk
                                        </h3>
                                        <p className="text-white/60 leading-relaxed text-sm whitespace-pre-wrap font-light">
                                            {cleanDescription(product.description)}
                                        </p>
                                    </div>

                                    {/* Features / Benefits */}
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Jaminan Keaslian</h4>
                                                <p className="text-[11px] text-white/40">Produk 100% asli dengan sertifikat resmi.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Buyback Garansi</h4>
                                                <p className="text-[11px] text-white/40">Jaminan pembelian kembali dengan harga kompetitif.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/5">
                                <Button
                                    className="w-full btn-luxury h-14 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-gold group"
                                    onClick={() => window.open('https://play.google.com/store/apps/details?id=id.im.momapan', '_blank')}
                                >
                                    <ShoppingBag className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                                    Beli Sekarang
                                </Button>
                                <p className="text-center text-[10px] text-white/30 mt-4">
                                    *Harga dapat berubah sewaktu-waktu mengikuti harga pasar emas dunia.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductDetailModal;

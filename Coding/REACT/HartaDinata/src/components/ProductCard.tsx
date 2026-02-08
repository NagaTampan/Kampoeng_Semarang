import { motion } from 'framer-motion';
import { Star, Award, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';

interface ProductCardProps {
    product: Product;
    index: number;
    onClick?: () => void;
}

const ProductCard = ({ product, index, onClick }: ProductCardProps) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
            className="group cursor-pointer"
            onClick={onClick}
        >
            <div className="glass-card rounded-2xl overflow-hidden hover:glass-card-gold transition-all duration-500 card-3d h-full flex flex-col">
                {/* Product Image */}
                <div className="relative aspect-square bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                    {product.badge && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full z-10 shadow-lg">
                            {product.badge}
                        </span>
                    )}

                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button className="btn-luxury text-sm py-3 px-6 shadow-gold group">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Detail Produk
                        </Button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] text-primary font-black uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">{product.category}</span>
                        {product.certification && (
                            <>
                                <span className="text-border">•</span>
                                <div className="flex items-center gap-1">
                                    <Award className="w-3 h-3 text-primary" />
                                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{product.certification}</span>
                                </div>
                            </>
                        )}
                    </div>

                    <h3 className="font-display font-bold text-lg text-white mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug min-h-[3rem]">
                        {product.name}
                    </h3>


                    <div className="mt-auto space-y-2 pt-4 border-t border-white/5">
                        {product.originalPrice && product.originalPrice > product.price && (
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-white/20 line-through">
                                    {formatPrice(product.originalPrice)}
                                </p>
                                <span className="text-[10px] font-black bg-success/20 text-success px-1.5 py-0.5 rounded">
                                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                                </span>
                            </div>
                        )}
                        <p className="text-2xl font-mono-price font-bold text-gold-gradient">
                            {formatPrice(product.price)}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;

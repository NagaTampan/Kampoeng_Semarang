import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Award, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(4);

      if (error) throw error;

      const formattedData: Product[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        originalPrice: item.original_price,
        category: item.category,
        imageUrl: item.image_url,
        stock: item.stock,
        isFeatured: item.is_featured,
        isPromo: item.is_promo,
        isBundle: item.is_bundle,
        badge: item.badge,
        certification: item.certification,
        rating: item.rating,
        reviews: item.reviews,
        createdAt: item.created_at,
      }));

      setProducts(formattedData);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section id="products" className="py-16 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <span className="inline-block text-primary text-sm font-medium tracking-widest uppercase mb-4">
              Koleksi Terbaik
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
              <span className="text-gold-gradient">Produk Unggulan</span>
            </h2>
          </div>
          <Button
            variant="ghost"
            className="btn-luxury-outline self-start md:self-auto"
            onClick={() => navigate('/products')}
          >
            Lihat Semua
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-white/20 text-xs font-black uppercase tracking-widest">Memuat Unggulan...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
                className="group cursor-pointer"
                onClick={() => window.open('https://play.google.com/store/apps/details?id=id.im.momapan', '_blank')}
              >
                <div className="glass-card rounded-2xl overflow-hidden hover:glass-card-gold transition-all duration-500 card-3d h-full flex flex-col">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                    {product.badge && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full z-10">
                        {product.badge}
                      </span>
                    )}

                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Quick Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <Button className="w-full btn-luxury text-sm py-3">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Tambah ke Keranjang
                      </Button>
                    </motion.div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-primary font-medium">{product.category}</span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-white mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug min-h-[3rem]">
                      {product.name}
                    </h3>


                    <div className="mt-auto pt-4 flex items-end justify-between border-t border-white/5">
                      <div>
                        <p className="text-xl font-mono font-bold text-gold-gradient">
                          {formatPrice(product.price)}
                        </p>
                        {product.originalPrice! > 0 && (
                          <p className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice!)}
                          </p>
                        )}
                      </div>
                      {product.originalPrice! > product.price && (
                        <span className="text-xs text-success font-medium">
                          -{Math.round((1 - product.price / product.originalPrice!) * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;

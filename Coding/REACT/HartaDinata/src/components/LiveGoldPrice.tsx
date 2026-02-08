import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw, Clock } from 'lucide-react';

const LiveGoldPrice = () => {
  const [prices, setPrices] = useState([
    { weight: '1 gram', price: 1234567, change: 2.4, trend: 'up' },
    { weight: '5 gram', price: 6172835, change: 2.3, trend: 'up' },
    { weight: '10 gram', price: 12345670, change: 2.5, trend: 'up' },
    { weight: '25 gram', price: 30864175, change: 2.2, trend: 'up' },
    { weight: '50 gram', price: 61728350, change: 2.4, trend: 'up' },
    { weight: '100 gram', price: 123456700, change: 2.6, trend: 'up' },
  ]);

  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simulate price updates
    const interval = setInterval(() => {
      setPrices(prev => prev.map(item => ({
        ...item,
        price: item.price + Math.floor(Math.random() * 1000 - 500),
        change: parseFloat((Math.random() * 5 - 2).toFixed(2)),
        trend: Math.random() > 0.5 ? 'up' : 'down',
      })));
      setLastUpdate(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <section id="prices" className="py-16 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Harga Emas Hari Ini
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            <span className="text-gold-gradient">Live Gold Price</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pantau harga emas realtime dengan update setiap detik. Harga transparan tanpa biaya tersembunyi.
          </p>
        </motion.div>

        {/* Live Update Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Terakhir update: {formatTime(lastUpdate)}</span>
          </div>
          <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </motion.div>

        {/* Price Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prices.map((item, index) => (
            <motion.div
              key={item.weight}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 hover:glass-card-gold transition-all duration-500 group card-3d"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-1">Emas {item.weight}</h3>
                  <p className="text-xs text-muted-foreground">Fine Gold 999.9</p>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${item.trend === 'up'
                    ? 'bg-success/10 text-success'
                    : 'bg-destructive/10 text-destructive'
                  }`}>
                  {item.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{item.change > 0 ? '+' : ''}{item.change}%</span>
                </div>
              </div>

              <div className="price-display text-2xl sm:text-3xl text-gold-gradient font-bold mb-4 group-hover:animate-pulse">
                {formatPrice(item.price)}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                  Beli Sekarang
                </button>
                <span className="text-xs text-muted-foreground">
                  /gram: {formatPrice(item.price / parseFloat(item.weight))}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gold Divider */}
        <div className="gold-divider w-1/3 mx-auto mt-16" />
      </div>
    </section>
  );
};

export default LiveGoldPrice;

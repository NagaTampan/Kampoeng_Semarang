import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Clock, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const InvestmentCalculator = () => {
  const [investment, setInvestment] = useState(10000000);
  const [years, setYears] = useState(5);
  const goldPricePerGram = 1234567;
  const averageAnnualReturn = 0.08; // 8% average annual gold return

  const grams = investment / goldPricePerGram;
  const futureValue = investment * Math.pow(1 + averageAnnualReturn, years);
  const profit = futureValue - investment;
  const totalReturn = ((futureValue - investment) / investment) * 100;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Simulasi Investasi
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            <span className="text-gold-gradient">Kalkulator Investasi</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hitung potensi keuntungan investasi emas Anda dengan simulasi interaktif.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card-gold rounded-3xl p-8 sm:p-12">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Input Section */}
              <div className="space-y-8">
                {/* Investment Amount */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-foreground">
                      Jumlah Investasi
                    </label>
                    <span className="font-mono text-lg text-gold-gradient font-bold">
                      {formatCurrency(investment)}
                    </span>
                  </div>
                  <Slider
                    value={[investment]}
                    onValueChange={(value) => setInvestment(value[0])}
                    min={1000000}
                    max={1000000000}
                    step={1000000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Rp 1 Juta</span>
                    <span>Rp 1 Miliar</span>
                  </div>
                </div>

                {/* Investment Period */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-foreground">
                      Periode Investasi
                    </label>
                    <span className="font-mono text-lg text-gold-gradient font-bold">
                      {years} Tahun
                    </span>
                  </div>
                  <Slider
                    value={[years]}
                    onValueChange={(value) => setYears(value[0])}
                    min={1}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>1 Tahun</span>
                    <span>20 Tahun</span>
                  </div>
                </div>

                {/* Current Gold Price Info */}
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Harga Emas Saat Ini</p>
                      <p className="font-mono font-semibold text-foreground">
                        {formatCurrency(goldPricePerGram)}/gram
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Hasil Simulasi
                </h3>

                {/* Gold Amount */}
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Coins className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Jumlah Emas</p>
                        <p className="font-mono font-semibold text-foreground">
                          {grams.toFixed(2)} gram
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Investment Period */}
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Periode</p>
                        <p className="font-mono font-semibold text-foreground">
                          {years} Tahun
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Projected Value */}
                <div className="glass-card-gold rounded-xl p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Estimasi Nilai Masa Depan</p>
                    <p className="text-3xl sm:text-4xl font-mono font-bold text-gold-gradient mb-2">
                      {formatCurrency(futureValue)}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-success">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        +{formatCurrency(profit)} ({totalReturn.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  *Berdasarkan rata-rata pertumbuhan harga emas 8% per tahun. Hasil aktual dapat berbeda.
                </p>

                <Button className="w-full btn-luxury py-6">
                  Mulai Investasi Sekarang
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InvestmentCalculator;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Produk', href: '/products' },
    { label: 'Knowledge Hub', href: '/articles' },
    { label: 'Peluang', href: '#reseller' },
    { label: 'Tentang Kami', href: '#about' },
    { label: 'Hubungi', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);

    // If it's an external link or a full path like /products
    if (href.startsWith('/')) {
      navigate(href);
      window.scrollTo(0, 0);
      return;
    }

    // If it's a hash link
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/' + href);
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-background/90 backdrop-blur-xl border-b border-border'
          : 'bg-transparent'
          }`}
      >
        {/* Top Bar - IDX Listed Badge */}
        <div className="bg-primary/10 border-b border-primary/20">
          <div className="container mx-auto px-6 py-1.5 flex items-center justify-center gap-4 text-xs">
            <span className="text-primary font-medium">🏛️ PT Hartadinata Abadi Tbk</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Tercatat di Bursa Efek Indonesia (IDX: HRTA)</span>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <span className="text-success hidden sm:inline">30+ Tahun Pengalaman</span>
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-3 group bg-transparent border-none p-0 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-gold-gradient flex items-center justify-center gold-shine overflow-hidden">
                <span className="text-primary-foreground font-cinzel font-bold text-xl">H</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-cinzel text-xl font-semibold text-gold-gradient tracking-wide">
                  EMASKU
                </span>
                <span className="text-[9px] tracking-[0.25em] text-muted-foreground uppercase">
                  PT Hartadinata Abadi Tbk
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors link-luxury bg-transparent border-none cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(user ? '/admin/dashboard' : '/admin/login')}
                className="text-foreground/80 hover:text-primary flex items-center gap-2"
              >
                {user ? (
                  <>
                    <User className="w-4 h-4" />
                    Dashboard
                  </>
                ) : (
                  'Masuk'
                )}
              </Button>
              <Button className="btn-luxury px-6" onClick={() => handleNavClick('#contact')}>
                Mulai Investasi
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative z-50 flex flex-col items-center justify-center h-full gap-8"
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="text-2xl font-display text-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                >
                  {item.label}
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-4 mt-8 w-full px-12"
              >
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate(user ? '/admin/dashboard' : '/admin/login');
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  {user ? 'Dashboard' : 'Masuk'}
                </Button>
                <Button
                  className="btn-luxury px-8"
                  size="lg"
                  onClick={() => handleNavClick('#contact')}
                >
                  Mulai Investasi
                </Button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

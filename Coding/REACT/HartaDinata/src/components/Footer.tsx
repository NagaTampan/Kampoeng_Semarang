import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Building2,
  Award,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    products: [
      { label: 'Emas Batangan', href: '#' },
      { label: 'Perhiasan Emas', href: '#' },
      { label: 'Dinar Emas', href: '#' },
      { label: 'Digital Gold', href: '#' },
    ],
    company: [
      { label: 'Tentang Hartadinata', href: '#' },
      { label: 'Sejarah Perusahaan', href: '#' },
      { label: 'Tata Kelola', href: '#' },
      { label: 'Karir', href: '#' },
    ],
    investor: [
      { label: 'Informasi Saham', href: '#' },
      { label: 'Laporan Tahunan', href: '#' },
      { label: 'Prospektus', href: '#' },
      { label: 'Kalender Investor', href: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms & Conditions', href: '#' },
      { label: 'Risk Disclosure', href: '#' },
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'Youtube' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#050505] pt-24 pb-8 overflow-hidden border-t border-white/5">
      {/* Background Aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#1a1a1a_0%,transparent_50%)] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

          {/* Brand Column (Col Span 4) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold group cursor-pointer overflow-hidden relative">
                <span className="text-black font-cinzel font-black text-xl relative z-10">H</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              </div>
              <div>
                <h3 className="font-cinzel text-xl font-bold text-white tracking-widest leading-none">HARTADINATA</h3>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-medium mt-1">Abadi Tbk</p>
              </div>
            </div>

            <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-sm">
              Membangun masa depan inklusif melalui ekosistem emas terintegrasi terbesar di Indonesia. Warisan kepercayaan sejak 1989.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 group hover:border-primary/30 transition-colors">
                <Building2 className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-[10px] text-white/40 uppercase font-black tracking-widest leading-none mb-1">Stock Code</div>
                  <div className="text-sm font-bold text-white">HRTA:IDX</div>
                </div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 transition-colors">
                <Award className="w-5 h-5 text-primary" />
                <div className="text-[10px] text-white/40 uppercase font-black tracking-widest">SNI CERTIFIED</div>
              </div>
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links (Col Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8">Navigation</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-white/40 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Investment (Col Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8">Investment</h4>
            <ul className="space-y-4">
              {footerLinks.investor.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-white/40 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support (Col Span 4) */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8">Connect With Us</h4>
            <div className="grid gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-white/40 leading-relaxed">
                  Jl. Kopo Sayati No. 165, Bandung, Jawa Barat 40228, Indonesia
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-white/40">customer.care@hartadinata.com</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-white/40">+62 22 540 2362</p>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h5 className="text-white font-bold text-sm mb-1">Butuh Bantuan Cepat?</h5>
                  <p className="text-[11px] text-white/30 uppercase tracking-widest font-bold">24/7 SUPPORT READY</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center shadow-gold hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
            </div>
          </div>

        </div>



        {/* Bottom Credits Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 order-2 md:order-1 text-center md:text-left">
            <p className="text-[11px] text-white/20 font-medium tracking-wide italic">
              Developed by <span className="text-white/40 not-italic font-bold">Hartadinata Tech Team</span>
            </p>
            <div className="w-px h-3 bg-white/10 hidden md:block" />
            <p className="text-[11px] text-white/20">
              © {currentYear} Hartadinata Abadi. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6 order-1 md:order-2">
            <div className="flex gap-6 text-[11px] font-bold text-white/30 uppercase tracking-widest">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            </div>

            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group ml-4"
            >
              <ChevronUp className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import GoldParticles from '@/components/GoldParticles';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import LiveGoldPrice from '@/components/LiveGoldPrice';
import CorporateLegacy from '@/components/CorporateLegacy';
import BusinessEcosystem from '@/components/BusinessEcosystem';
import FeaturedProducts from '@/components/FeaturedProducts';
import WhyInvestGold from '@/components/WhyInvestGold';
import ResellerEducation from '@/components/ResellerEducation';
import CorporateVideos from '@/components/CorporateVideos';
import SecurityTechnology from '@/components/SecurityTechnology';
import NationalPresenceMap from '@/components/NationalPresenceMap';
import InvestmentCalculator from '@/components/InvestmentCalculator';
import VideoTestimonials from '@/components/VideoTestimonials';
import TrustBadges from '@/components/TrustBadges';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Gold Particles Background */}
      <GoldParticles />

      {/* Header */}
      <Header />

      {/* Hero Section with Video CTA */}
      <HeroSection />


      {/* Reseller Education Videos - THE OFFER (Moved Up) */}
      <ResellerEducation />

      {/* National Presence Map - THE NETWORK (Moved Up) */}
      <NationalPresenceMap />

      {/* Featured Products - COMMODITY (Moved Down) */}
      <FeaturedProducts />

      {/* Video Testimonials - SOCIAL PROOF */}
      <VideoTestimonials />

      {/* Why Invest in Gold - EDUCATION (Moved Down) */}
      <WhyInvestGold />

      {/* Corporate Legacy Timeline - TRUST */}
      <CorporateLegacy />

      {/* Security Technology - REASSURANCE */}
      <SecurityTechnology />

      {/* Corporate Documentary Videos - DEEP DIVE */}
      <CorporateVideos />

      {/* CTA Section - ACTION */}
      <CTASection />

      {/* Footer */}
      <Footer />

      {/* WhatsApp Floating Button */}
      <WhatsAppFloating />
    </div>
  );
};

export default Index;

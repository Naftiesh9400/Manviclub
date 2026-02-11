import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import TeamSection from "@/components/sections/TeamSection";
import TournamentsSection from "@/components/sections/TournamentsSection";
import MembershipSection from "@/components/sections/MembershipSection";
import CareersSection from "@/components/sections/CareersSection";
import FutureSection from "@/components/sections/FutureSection";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />

        <TournamentsSection />
        <MembershipSection />
        <CareersSection />
        <FutureSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

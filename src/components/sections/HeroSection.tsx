import { Button } from "@/components/ui/button";
import { ChevronDown, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-fishing.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToMembership = () => {
    const element = document.getElementById("membership");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Serene fishing at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Animated Wave Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-32 animate-wave"
        >
          <path
            d="M0,60 C300,100 400,20 600,60 C800,100 900,20 1200,60 L1200,120 L0,120 Z"
            fill="hsl(var(--background))"
            opacity="0.8"
          />
        </svg>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-24"
        >
          <path
            d="M0,80 C200,40 400,120 600,80 C800,40 1000,120 1200,80 L1200,120 L0,120 Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom px-4 text-center pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm border border-secondary/30 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-primary-foreground/90 text-sm font-medium">
              Est. 2024 • Karnataka's Premier Fishing Community
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Welcome to{" "}
            <span className="text-secondary">Manvi</span>
            <br />
            Fishing Club
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Where passion meets the waters. Join a community of dedicated anglers,
            compete in thrilling tournaments, and experience the art of fishing like never before.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button 
              variant="aqua" 
              size="xl" 
              className="w-full sm:w-auto"
              onClick={scrollToMembership}
            >
              <Users className="w-5 h-5" />
              Join the Club
            </Button>
            <Button 
              variant="heroOutline" 
              size="xl" 
              className="w-full sm:w-auto"
              onClick={() => navigate("/tournaments")}
            >
              <Trophy className="w-5 h-5" />
              Register for Tournament
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { number: "500+", label: "Members" },
              { number: "25+", label: "Tournaments" },
              { number: "15+", label: "Locations" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-2xl md:text-3xl font-bold text-secondary">
                  {stat.number}
                </div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/60 hover:text-primary-foreground transition-colors animate-float"
      >
        <ChevronDown className="w-8 h-8" />
      </a>
    </section>
  );
};

export default HeroSection;

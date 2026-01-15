import { Anchor, Fish, Heart, MapPin, Shield, Users } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Fish,
      title: "Expert Guidance",
      description: "Learn from seasoned anglers with decades of experience in freshwater and marine fishing.",
    },
    {
      icon: Users,
      title: "Vibrant Community",
      description: "Connect with fellow fishing enthusiasts who share your passion for the sport.",
    },
    {
      icon: MapPin,
      title: "Prime Locations",
      description: "Access exclusive fishing spots across Karnataka's most pristine waters.",
    },
    {
      icon: Shield,
      title: "Conservation Focus",
      description: "We practice and promote sustainable fishing to protect our aquatic ecosystems.",
    },
  ];

  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2 mb-6">
            <Anchor className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">About Us</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            More Than Just a{" "}
            <span className="text-secondary">Fishing Club</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Founded in the heart of Karnataka, Manvi Fishing Club brings together passionate 
            anglers who believe in the joy of fishing, the thrill of the catch, and the 
            importance of preserving our natural waters for generations to come.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-premium p-6 text-center group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-ocean mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
          <Heart className="w-10 h-10 text-secondary mx-auto mb-6" />
          <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Our Mission
          </h3>
          <p className="text-primary-foreground/80 text-lg max-w-3xl mx-auto leading-relaxed">
            "To foster a thriving community of anglers who embrace the art of fishing 
            with respect for nature, share knowledge across generations, and create 
            unforgettable memories on the water."
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

import { CreditCard, Package, Smartphone, Sparkles, Store, Ticket } from "lucide-react";

const FutureSection = () => {
  const upcomingFeatures = [
    {
      icon: Store,
      title: "E-Commerce Store",
      description: "Shop premium fishing gear, apparel, and accessories directly from our online store.",
      status: "Coming Q2 2025",
    },
    {
      icon: Package,
      title: "Official Merchandise",
      description: "Exclusive Manvi Fishing Club branded gear - from caps to fishing rods.",
      status: "Coming Q2 2025",
    },
    {
      icon: CreditCard,
      title: "Digital Membership Cards",
      description: "Carry your membership digitally with QR verification and instant benefits.",
      status: "Coming Q3 2025",
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "Track catches, connect with members, and register for events on the go.",
      status: "In Development",
    },
    {
      icon: Ticket,
      title: "Online Event Booking",
      description: "Book fishing trips, workshops, and experiences with instant confirmation.",
      status: "Coming Q3 2025",
    },
    {
      icon: Sparkles,
      title: "AI Fishing Assistant",
      description: "Get personalized fishing tips based on weather, location, and your preferences.",
      status: "In Research",
    },
  ];

  return (
    <section className="section-padding bg-muted relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent-foreground">Coming Soon</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            The Future of{" "}
            <span className="text-secondary">Manvi Club</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We're constantly evolving to bring you the best fishing experience. 
            Here's a sneak peek at what's coming next.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingFeatures.map((feature, index) => (
            <div
              key={index}
              className="card-premium p-6 relative overflow-hidden group"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 animate-shimmer" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                    {feature.status}
                  </span>
                </div>

                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 text-center">
          <div className="bg-card rounded-2xl p-8 md:p-12 max-w-2xl mx-auto border border-border">
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">
              Stay Updated
            </h3>
            <p className="text-muted-foreground mb-6">
              Be the first to know when new features launch. Join our newsletter.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-ocean text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureSection;

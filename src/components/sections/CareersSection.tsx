import { Button } from "@/components/ui/button";
import { Briefcase, Clock, MapPin, ArrowRight } from "lucide-react";

const CareersSection = () => {
  const positions = [
    {
      title: "Tournament Coordinator",
      type: "Full-time",
      location: "Manvi, Karnataka",
      description: "Organize and manage fishing tournaments, coordinate with participants, and ensure smooth event execution.",
    },
    {
      title: "Fishing Instructor",
      type: "Part-time",
      location: "Multiple Locations",
      description: "Train new members on fishing techniques, safety protocols, and equipment usage.",
    },
    {
      title: "Community Manager",
      type: "Remote",
      location: "Work from Home",
      description: "Manage our social media presence, engage with the community, and create compelling content.",
    },
  ];

  return (
    <section id="careers" className="section-padding bg-primary">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-secondary/20 rounded-full px-4 py-2 mb-6">
              <Briefcase className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Join Our Team</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Build Your Career With{" "}
              <span className="text-secondary">Manvi</span>
            </h2>
            <p className="text-lg text-primary-foreground/80 leading-relaxed mb-8">
              We're always looking for passionate individuals who share our love for 
              fishing and community building. Join a dynamic team that's shaping the 
              future of recreational fishing in India.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Competitive compensation packages",
                "Flexible working arrangements",
                "Professional development opportunities",
                "Access to all club facilities and events",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-primary-foreground/80">{benefit}</span>
                </div>
              ))}
            </div>

            <Button variant="aqua" size="lg" className="group">
              View All Openings
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right - Job Cards */}
          <div className="space-y-4">
            {positions.map((position, index) => (
              <div
                key={index}
                className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-xl p-6 hover:bg-primary-foreground/15 transition-colors group"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <h3 className="font-display text-xl font-semibold text-primary-foreground">
                    {position.title}
                  </h3>
                  <Button variant="heroOutline" size="sm" className="group-hover:bg-primary-foreground/10">
                    Apply
                  </Button>
                </div>

                <p className="text-primary-foreground/70 text-sm mb-4">
                  {position.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-primary-foreground/60 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{position.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-foreground/60 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{position.location}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-center pt-4">
              <p className="text-primary-foreground/60 text-sm">
                Don't see a perfect fit?{" "}
                <a href="#" className="text-secondary hover:underline">
                  Send us your resume
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareersSection;

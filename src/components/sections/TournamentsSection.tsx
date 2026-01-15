import { Button } from "@/components/ui/button";
import { Trophy, Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import tournament1 from "@/assets/tournament-1.jpg";
import tournament2 from "@/assets/tournament-2.jpg";
import tournament3 from "@/assets/tournament-3.jpg";

const TournamentsSection = () => {
  const tournaments = [
    {
      image: tournament1,
      title: "Spring Bass Challenge",
      date: "March 15-17, 2025",
      location: "Krishna River",
      participants: "120 Spots",
      prize: "₹2,50,000",
      status: "Open",
    },
    {
      image: tournament2,
      title: "Summer Catch Classic",
      date: "June 20-22, 2025",
      location: "Tungabhadra Dam",
      participants: "100 Spots",
      prize: "₹3,00,000",
      status: "Coming Soon",
    },
    {
      image: tournament3,
      title: "Night Fishing Tournament",
      date: "August 8-10, 2025",
      location: "Almatti Dam",
      participants: "80 Spots",
      prize: "₹1,75,000",
      status: "Coming Soon",
    },
  ];

  return (
    <section id="tournaments" className="section-padding bg-muted">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 mb-6">
            <Trophy className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent-foreground">Competitions</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Upcoming{" "}
            <span className="text-secondary">Tournaments</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Test your skills against the best anglers in the region. Our tournaments 
            offer exciting challenges, substantial prizes, and unforgettable experiences.
          </p>
        </div>

        {/* Tournament Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {tournaments.map((tournament, index) => (
            <div key={index} className="card-premium overflow-hidden group">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={tournament.image}
                  alt={tournament.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tournament.status === "Open"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tournament.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-lg text-sm font-bold">
                    Prize: {tournament.prize}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  {tournament.title}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-muted-foreground text-sm">
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span>{tournament.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span>{tournament.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground text-sm">
                    <Users className="w-4 h-4 text-secondary" />
                    <span>{tournament.participants}</span>
                  </div>
                </div>

                <Button
                  variant={tournament.status === "Open" ? "hero" : "outline"}
                  className="w-full"
                  disabled={tournament.status !== "Open"}
                >
                  {tournament.status === "Open" ? "Register Now" : "Notify Me"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="group">
            View All Tournaments
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TournamentsSection;

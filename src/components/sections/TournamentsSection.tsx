import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, MapPin, Users, ArrowRight, Loader2 } from "lucide-react";
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const TournamentsSection = () => {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const db = getFirestore();
        // Fetch upcoming tournaments, limited to 3 for the home page
        const q = query(
          collection(db, "tournaments"),
          where("status", "in", ["upcoming", "open"]),
          limit(3)
        );
        
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort by date manually to avoid needing a composite index immediately
        data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setTournaments(data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, []);

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
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="card-premium overflow-hidden group">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={tournament.image || "https://images.unsplash.com/photo-1544551763-46a8723ba3f9?auto=format&fit=crop&q=80&w=1000"}
                  alt={tournament.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tournament.status === "upcoming" || tournament.status === "open"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tournament.status === "open" ? "Registration Open" : tournament.status}
                  </span>
                </div>
                {tournament.prize && (
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-accent text-accent-foreground px-3 py-1 rounded-lg text-sm font-bold">
                      Prize: {tournament.prize}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  {tournament.name}
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
                    <span>{tournament.maxParticipants} Spots</span>
                  </div>
                </div>

                <Button
                  variant="hero"
                  className="w-full"
                  onClick={() => navigate("/tournaments")}
                >
                  {tournament.status === "open" ? "Register Now" : "View Details"}
                </Button>
              </div>
            </div>
          ))}
          {tournaments.length === 0 && <p className="col-span-full text-center text-muted-foreground">No upcoming tournaments scheduled.</p>}
        </div>
        )}

        {/* View All Link */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="group" onClick={() => navigate("/tournaments")}>
            View All Tournaments
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TournamentsSection;

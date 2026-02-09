import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Award,
  Fish,
  Medal,
  Star,
  Loader2
} from "lucide-react";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

interface Tournament {
  id: string;
  image: string;
  title: string;
  date: string;
  location: string;
  participants: string;
  maxParticipants: number;
  currentParticipants: number;
  prize: string;
  price: number;
  status: "Open" | "Coming Soon" | "Closed" | "open" | "upcoming" | "ongoing" | "completed";
  description: string;
  rules: string[];
  schedule: { time: string; activity: string }[];
}

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    teamName: "",
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const db = getFirestore();
        const q = query(collection(db, "tournaments"), orderBy("date", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
        setTournaments(data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();

    const fetchLeaderboard = async () => {
      try {
        const db = getFirestore();
        const q = query(collection(db, "leaderboard"), orderBy("rank", "asc"));
        const snapshot = await getDocs(q);
        setLeaderboard(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  const handleRegister = (tournament: Tournament) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to register for tournaments.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setSelectedTournament(tournament);
    setIsRegistrationOpen(true);
    setFormData({
      name: user.displayName || "",
      email: user.email || "",
      phone: "",
      experience: "",
      teamName: "",
    });
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const price = selectedTournament?.price || 0;

    if (price > 0) {
      // Payment Flow
      if (typeof window.Razorpay === "undefined") {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_S48GPMRpTiySYx",
        amount: price * 100,
        currency: "INR",
        name: "Manvi Fishing Club",
        description: `Registration for ${selectedTournament?.title}`,
        image: "/favicon.ico",
        handler: async function (response: any) {
          try {
            const db = getFirestore();
            
            // Record Payment
            await addDoc(collection(db, "payments"), {
              userId: user?.uid,
              userName: formData.name,
              userEmail: formData.email,
              amount: price,
              razorpayPaymentId: response.razorpay_payment_id,
              type: "tournament_registration",
              tournamentId: selectedTournament?.id,
              tournamentName: selectedTournament?.title,
              date: new Date(),
              status: "completed"
            });

            // Record Registration
            await addDoc(collection(db, "registrations"), {
              tournamentId: selectedTournament?.id,
              tournamentTitle: selectedTournament?.title,
              userId: user?.uid,
              userName: formData.name,
              userEmail: formData.email,
              userPhone: formData.phone,
              teamName: formData.teamName,
              experience: formData.experience,
              registeredAt: new Date(),
              status: "confirmed",
              paymentId: response.razorpay_payment_id,
              amountPaid: price
            });

            toast({
              title: "Registration Successful! 🎉",
              description: `You've been registered for ${selectedTournament?.title}. Check your email for details.`,
            });
            setIsRegistrationOpen(false);
          } catch (error) {
            console.error("Error saving registration:", error);
            toast({
              title: "Registration Error",
              description: "Payment successful but registration failed. Please contact support.",
              variant: "destructive",
            });
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#1e6091",
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Free Registration Flow
      try {
        const db = getFirestore();
        await addDoc(collection(db, "registrations"), {
          tournamentId: selectedTournament?.id,
          tournamentTitle: selectedTournament?.title,
          userId: user?.uid,
          userName: formData.name,
          userEmail: formData.email,
          userPhone: formData.phone,
          teamName: formData.teamName,
          experience: formData.experience,
          registeredAt: new Date(),
          status: "confirmed",
          amountPaid: 0
        });

        toast({
          title: "Registration Successful! 🎉",
          description: `You've been registered for ${selectedTournament?.title}.`,
        });
        setIsRegistrationOpen(false);
      } catch (error) {
        console.error("Error registering:", error);
        toast({
          title: "Registration Failed",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-accent" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-semibold">{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-custom px-4">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2 mb-6">
              <Trophy className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Competitions</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Fishing <span className="text-secondary">Tournaments</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Compete against the best anglers, win amazing prizes, and create unforgettable memories 
              at our professionally organized fishing tournaments.
            </p>
          </div>

          <Tabs defaultValue="upcoming" className="mb-16">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
              tournaments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No upcoming tournaments found. Check back later!
                </div>
              ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {tournaments.map((tournament) => (
                  <div key={tournament.id} className="card-premium overflow-hidden group">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={tournament.image}
                        alt={tournament.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            tournament.status === "Open" || tournament.status === "open"
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {tournament.status === "open" ? "Registration Open" : tournament.status}
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

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {tournament.description}
                      </p>

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
                          <span>{tournament.currentParticipants}/{tournament.maxParticipants} Registered</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-secondary rounded-full transition-all"
                            style={{ width: `${(tournament.currentParticipants / tournament.maxParticipants) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {tournament.maxParticipants - tournament.currentParticipants} spots remaining
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setSelectedTournament(tournament)}
                        >
                          Details
                        </Button>
                        <Button
                          variant={tournament.status === "Open" || tournament.status === "open" ? "hero" : "outline"}
                          className="flex-1"
                          disabled={tournament.status !== "Open" && tournament.status !== "open"}
                          onClick={() => handleRegister(tournament)}
                        >
                          {tournament.status === "Open" || tournament.status === "open" ? "Register" : "Notify Me"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )
              )}
            </TabsContent>

            <TabsContent value="leaderboard">
              {/* Leaderboard */}
              <div className="max-w-4xl mx-auto">
                <div className="card-premium overflow-hidden">
                  <div className="bg-gradient-ocean p-6 text-center">
                    <Trophy className="w-12 h-12 text-accent mx-auto mb-3" />
                    <h2 className="font-display text-2xl font-bold text-primary-foreground">
                      Season Leaderboard 2024-25
                    </h2>
                    <p className="text-primary-foreground/70">Top performers across all tournaments</p>
                  </div>

                  <div className="divide-y divide-border">
                    {leaderboard.length > 0 ? leaderboard.map((player) => (
                      <div 
                        key={player.id || player.rank} 
                        className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                          player.rank <= 3 ? "bg-accent/5" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            {getRankIcon(player.rank)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{player.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {player.catches} catches • {player.weight}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-secondary">{player.points}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    )) : (
                      <div className="p-8 text-center text-muted-foreground">
                        No leaderboard data available yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Tournament Details Modal */}
      <Dialog open={!!selectedTournament && !isRegistrationOpen} onOpenChange={() => setSelectedTournament(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {selectedTournament && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{selectedTournament.title}</DialogTitle>
                <DialogDescription>{selectedTournament.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Calendar className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">{selectedTournament.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <MapPin className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">{selectedTournament.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Award className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Prize Pool</p>
                      <p className="font-medium text-foreground">{selectedTournament.prize}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Users className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Participants</p>
                      <p className="font-medium text-foreground">{selectedTournament.currentParticipants}/{selectedTournament.maxParticipants}</p>
                    </div>
                  </div>
                </div>

                {/* Rules */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Fish className="w-4 h-4 text-secondary" />
                    Tournament Rules
                  </h3>
                  <ul className="space-y-2">
                    {selectedTournament.rules?.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-secondary mt-1">•</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Schedule */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-secondary" />
                    Daily Schedule
                  </h3>
                  <div className="space-y-2">
                    {selectedTournament.schedule?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 text-sm">
                        <span className="font-mono text-secondary w-16">{item.time}</span>
                        <span className="text-muted-foreground">{item.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="hero" 
                  className="w-full" 
                  size="lg"
                  disabled={selectedTournament.status !== "Open" && selectedTournament.status !== "open"}
                  onClick={() => handleRegister(selectedTournament)}
                >
                  {selectedTournament.status === "Open" || selectedTournament.status === "open" ? "Register Now" : "Notify When Open"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Registration Modal */}
      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Tournament Registration</DialogTitle>
            <DialogDescription>
              Register for {selectedTournament?.title}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitRegistration} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="reg-name">Full Name</Label>
              <Input
                id="reg-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-phone">Phone Number</Label>
              <Input
                id="reg-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-team">Team Name (Optional)</Label>
              <Input
                id="reg-team"
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                placeholder="Enter team name if applicable"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-experience">Fishing Experience</Label>
              <Textarea
                id="reg-experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Tell us about your fishing experience..."
                rows={3}
              />
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Registration Fee:</strong> ₹{selectedTournament?.price}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Payment will be collected via Razorpay after submission.
              </p>
            </div>

            <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : (selectedTournament?.price && selectedTournament.price > 0) ? `Pay ₹${selectedTournament.price}` : "Confirm Registration"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Tournaments;

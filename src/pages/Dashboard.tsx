import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Crown, 
  Star, 
  Zap, 
  Trophy, 
  Calendar, 
  Camera, 
  Users, 
  Gift, 
  Settings,
  LogOut,
  ChevronRight,
  Check,
  Sparkles,
  Shield,
  Loader2
} from "lucide-react";
import { getFirestore, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

const Dashboard = () => {
  const { user, membership, logout, isAdmin, loading, cancelMembership } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [displayFeatures, setDisplayFeatures] = useState<any[]>([]);
  const [featuresLoading, setFeaturesLoading] = useState(true);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchPlanData = async () => {
      if (!user) return;
      const db = getFirestore();
      
      let featuresToDisplay: string[] = [];
      let isUnlocked = false;

      try {
        if (membership.plan) {
          // User has a plan, fetch its specific features
          // Try to find by planId first (exact or lowercase)
          let q = query(collection(db, "membershipPlans"), where("planId", "==", membership.plan));
          let snapshot = await getDocs(q);
          
          if (snapshot.empty) {
             q = query(collection(db, "membershipPlans"), where("planId", "==", membership.plan.toLowerCase()));
             snapshot = await getDocs(q);
          }

          if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            featuresToDisplay = data.features || [];
            isUnlocked = true;
          } else {
            // Fallback if plan not found in DB but exists in user profile
            featuresToDisplay = [
              "Access to member events",
              "Community forum access",
              "Photo Gallery access",
              "Tournament participation"
            ];
            isUnlocked = true;
          }
        } else {
          // No plan, fetch the "Elite" or best plan to show what they are missing
          const q = query(collection(db, "membershipPlans"), orderBy("price", "desc"), limit(1));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            featuresToDisplay = data.features || [];
          } else {
             // Fallback defaults if no plans in DB
             featuresToDisplay = [
              "Member Events",
              "Community Forum",
              "Photo Gallery",
              "Tournament Priority",
              "Expert Mentorship",
              "VIP Access"
             ];
          }
          isUnlocked = false;
        }

        // Map features to UI objects with icons and links
        const mappedFeatures = featuresToDisplay.map(feature => {
          const lower = feature.toLowerCase();
          let icon = Check;
          let link = null;

          if (lower.includes("tournament")) { icon = Trophy; link = "/tournaments"; }
          else if (lower.includes("gallery") || lower.includes("photo")) { icon = Camera; link = "/gallery"; }
          else if (lower.includes("event")) { icon = Calendar; }
          else if (lower.includes("forum") || lower.includes("community")) { icon = Users; }
          else if (lower.includes("shop") || lower.includes("merchandise")) { icon = Gift; }
          else if (lower.includes("coach") || lower.includes("mentor")) { icon = Star; }
          else if (lower.includes("vip") || lower.includes("boat")) { icon = Crown; }

          return {
            title: feature,
            description: isUnlocked ? "Included in your plan" : "Available with membership",
            icon,
            link,
            unlocked: isUnlocked
          };
        });

        setDisplayFeatures(mappedFeatures);
      } catch (error) {
        console.error("Error fetching dashboard features:", error);
      } finally {
        setFeaturesLoading(false);
      }
    };

    fetchPlanData();
  }, [user, membership.plan]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const getPlanIcon = () => {
    switch (membership.plan?.toLowerCase()) {
      case "elite":
        return <Crown className="w-8 h-8 text-accent" />;
      case "premium":
        return <Star className="w-8 h-8 text-secondary" />;
      case "basic":
        return <Zap className="w-8 h-8 text-primary" />;
      default:
        return <Users className="w-8 h-8 text-muted-foreground" />;
    }
  };

  const getPlanColor = () => {
    switch (membership.plan?.toLowerCase()) {
      case "elite":
        return "from-accent/20 to-accent/5 border-accent/30";
      case "premium":
        return "from-secondary/20 to-secondary/5 border-secondary/30";
      case "basic":
        return "from-primary/20 to-primary/5 border-primary/30";
      default:
        return "from-muted to-muted/50 border-border";
    }
  };

  const daysLeft = membership.expiresAt 
    ? Math.ceil((membership.expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) 
    : null;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleCancelMembership = async () => {
    try {
      await cancelMembership();
      setIsCancelOpen(false);
      toast({
        title: "Membership Cancelled",
        description: "Your membership has been cancelled successfully.",
      });
    } catch (error) {
      console.error("Error cancelling membership:", error);
      toast({
        title: "Error",
        description: "Failed to cancel membership. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-custom px-4">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome, {user.displayName || "Member"}! 🎣
            </h1>
            <p className="text-muted-foreground">
              Manage your membership and explore exclusive content.
            </p>
          </div>

          {/* Membership Card */}
          <div className={`card-premium p-8 mb-12 bg-gradient-to-br ${getPlanColor()}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center shadow-lg">
                  {getPlanIcon()}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Membership</p>
                  <h2 className="font-display text-2xl font-bold text-foreground capitalize">
                    {membership.plan || "No Active Plan"}
                  </h2>
                  {membership.expiresAt && (
                    <p className="text-sm text-muted-foreground">
                      Expires: {membership.expiresAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {daysLeft !== null && daysLeft <= 30 && (
                  <Link to="/#membership">
                    <Button variant="default" size="lg" className="gap-2 w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white">
                      <Sparkles className="w-4 h-4" />
                      Renew ({daysLeft} days left)
                    </Button>
                  </Link>
                )}

                {!membership.plan ? (
                  <Link to="/#membership">
                    <Button variant="hero" size="lg" className="gap-2 w-full sm:w-auto">
                      <Sparkles className="w-4 h-4" />
                      Upgrade Now
                    </Button>
                  </Link>
                ) : membership.plan?.toLowerCase() !== "elite" ? (
                  <Link to="/#membership">
                    <Button variant="accent" size="lg" className="gap-2 w-full sm:w-auto">
                      <Crown className="w-4 h-4" />
                      Upgrade Plan
                    </Button>
                  </Link>
              ) : (
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto"
                  onClick={() => setIsCancelOpen(true)}
                >
                  Cancel Membership
                </Button>
              )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="card-premium p-6 text-center opacity-50 cursor-not-allowed">
              <Users className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">Community</h3>
              <p className="text-sm text-muted-foreground">Coming Soon</p>
            </div>
            <div className="card-premium p-6 text-center opacity-50 cursor-not-allowed">
              <Settings className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">Settings</h3>
              <p className="text-sm text-muted-foreground">Coming Soon</p>
            </div>
          </div>

          {/* Exclusive Content */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              {membership.plan ? "Your Plan Benefits" : "Exclusive Content & Benefits"}
            </h2>
            {featuresLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
            ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayFeatures.map((content, index) => (
                <div
                  key={index}
                  className={`card-premium p-6 ${
                    content.unlocked 
                      ? "border-secondary/30" 
                      : "opacity-60 grayscale"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <content.icon className={`w-6 h-6 ${
                      content.unlocked ? "text-secondary" : "text-muted-foreground"
                    }`} />
                    {content.unlocked ? (
                      <span className="bg-secondary/20 text-secondary text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                        Locked
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{content.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{content.description}</p>
                  {content.link && content.unlocked ? (
                    <Link to={content.link}>
                      <Button variant="ghost" size="sm" className="w-full justify-between">
                        Access Now
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  ) : !content.unlocked && (
                    <Link to="/#membership">
                      <Button variant="outline" size="sm" className="w-full">
                        Upgrade to Unlock
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
            )}
          </div>

          {/* Account Actions */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </main>

      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Membership?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your {membership.plan} membership? 
              You will lose access to exclusive features immediately. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsCancelOpen(false)}>
              Keep Membership
            </Button>
            <Button variant="destructive" onClick={handleCancelMembership}>
              Yes, Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Dashboard;

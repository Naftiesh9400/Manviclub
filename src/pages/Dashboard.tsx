import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
  Shield
} from "lucide-react";

const Dashboard = () => {
  const { user, membership, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) return null;

  const getPlanIcon = () => {
    switch (membership.plan) {
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
    switch (membership.plan) {
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

  const getExclusiveContent = () => {
    const allContent = [
      { 
        title: "Member Events", 
        description: "Access to exclusive fishing events", 
        icon: Calendar, 
        plans: ["basic", "premium", "elite"] 
      },
      { 
        title: "Community Forum", 
        description: "Connect with fellow anglers", 
        icon: Users, 
        plans: ["basic", "premium", "elite"] 
      },
      { 
        title: "Photo Gallery", 
        description: "Share and view catch photos", 
        icon: Camera, 
        plans: ["basic", "premium", "elite"],
        link: "/gallery"
      },
      { 
        title: "Tournament Priority", 
        description: "Priority registration for tournaments", 
        icon: Trophy, 
        plans: ["premium", "elite"],
        link: "/tournaments"
      },
      { 
        title: "Expert Mentorship", 
        description: "One-on-one guidance from pros", 
        icon: Star, 
        plans: ["premium", "elite"] 
      },
      { 
        title: "VIP Access", 
        description: "Exclusive boat trips & locations", 
        icon: Crown, 
        plans: ["elite"] 
      },
      { 
        title: "Personal Coach", 
        description: "Dedicated fishing coach", 
        icon: Gift, 
        plans: ["elite"] 
      },
    ];

    return allContent.map((content) => ({
      ...content,
      unlocked: membership.plan ? content.plans.includes(membership.plan) : false,
    }));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
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

              {!membership.plan ? (
                <Link to="/#membership">
                  <Button variant="hero" size="lg" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Upgrade Now
                  </Button>
                </Link>
              ) : membership.plan !== "elite" ? (
                <Link to="/#membership">
                  <Button variant="accent" size="lg" className="gap-2">
                    <Crown className="w-4 h-4" />
                    Upgrade Plan
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {isAdmin && (
              <Link to="/admin" className="card-premium p-6 text-center hover:scale-105 transition-transform border-accent/50 bg-accent/5">
                <Shield className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold text-foreground">Admin</h3>
                <p className="text-sm text-muted-foreground">Dashboard</p>
              </Link>
            )}
            <Link to="/tournaments" className="card-premium p-6 text-center hover:scale-105 transition-transform">
              <Trophy className="w-8 h-8 text-secondary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">Tournaments</h3>
              <p className="text-sm text-muted-foreground">View & Register</p>
            </Link>
            <Link to="/gallery" className="card-premium p-6 text-center hover:scale-105 transition-transform">
              <Camera className="w-8 h-8 text-secondary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">Gallery</h3>
              <p className="text-sm text-muted-foreground">Photos & Catches</p>
            </Link>
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
              Exclusive Content & Benefits
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getExclusiveContent().map((content, index) => (
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
      <Footer />
    </div>
  );
};

export default Dashboard;

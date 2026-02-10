import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  where,
  Timestamp,
  onSnapshot,
  getDoc
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Trophy,
  Users,
  Image as ImageIcon,
  CreditCard,
  Plus,
  Trash2,
  Loader2,
  Save,
  X,
  Calendar,
  MapPin,
  IndianRupee,
  Crown,
  Sparkles,
  Filter,
  Pencil,
  Briefcase,
  FileText,
  Mail,
  TrendingUp,
  Settings,
  Eye
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type Tab = "overview" | "tournaments" | "registrations" | "users" | "gallery" | "sales" | "memberships" | "jobs" | "applications" | "newsletter" | "leaderboard" | "notifications" | "ems" | "settings";

const AdminDashboard = ({ defaultTab = "overview" }: { defaultTab?: string }) => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const db = getFirestore();

  const [activeTab, setActiveTab] = useState<Tab>(defaultTab as Tab);
  const [isLoading, setIsLoading] = useState(false);
  const [userFilter, setUserFilter] = useState<"all" | "google" | "email" | "tournament">("all");

  // Data States
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [viewApplication, setViewApplication] = useState<any>(null);
  const [applicationNote, setApplicationNote] = useState("");

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You do not have admin permissions.",
          variant: "destructive",
        });
        navigate("/");
      }
    }
  }, [user, isAdmin, authLoading, navigate, toast]);

  useEffect(() => {
    if (user) {
      fetchData(activeTab);
    }
  }, [activeTab, user]);

  // Real-time listener for sales/payments
  useEffect(() => {
    if (user && (activeTab === "overview" || activeTab === "sales")) {
      const q = query(collection(db, "payments"), orderBy("date", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setSales(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      });
      return () => unsubscribe();
    }
  }, [activeTab, user, db]);

  const fetchData = async (tab: Tab) => {
    setIsLoading(true);
    try {
      if (tab === "overview" || tab === "tournaments") {
        const q = query(collection(db, "tournaments"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        setTournaments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }

      if (tab === "overview" || tab === "users") {
        const snapshot = await getDocs(collection(db, "users"));
        setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }

      if (tab === "overview" || tab === "registrations" || tab === "users") {
        const snapshot = await getDocs(collection(db, "registrations"));
        setRegistrations(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }

      if (tab === "overview" || tab === "gallery") {
        const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setGallery(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }

      // Sales data is handled by the real-time listener (onSnapshot)
      // if (tab === "overview" || tab === "sales") { ... }

      if (tab === "overview" || tab === "memberships") {
        const snapshot = await getDocs(collection(db, "membershipPlans"));
        setMemberships(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }

      if (tab === "overview" || tab === "jobs") {
        const q = query(collection(db, "careers"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setJobs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }

      if (tab === "overview" || tab === "applications") {
        const q = query(collection(db, "job_applications"), orderBy("appliedAt", "desc"));
        const snapshot = await getDocs(q);
        setApplications(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }

      if (tab === "overview" || tab === "newsletter") {
        const q = query(collection(db, "newsletter_subscribers"), orderBy("subscribedAt", "desc"));
        const snapshot = await getDocs(q);
        setSubscribers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }

      if (tab === "overview" || tab === "leaderboard") {
        const q = query(collection(db, "leaderboard"), orderBy("rank", "asc"));
        const snapshot = await getDocs(q);
        setLeaderboard(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }

      if (tab === "overview" || tab === "ems") {
        const q = query(collection(db, "team_members"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setTeamMembers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }

      if (tab === "overview" || tab === "notifications") {
        const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setNotifications(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }

      if (tab === "settings") {
        const docRef = doc(db, "site_settings", "footer");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            description: data.description,
            address: data.contact?.address,
            phone: data.contact?.phone,
            email: data.contact?.email,
            facebook: data.social?.facebook,
            instagram: data.social?.instagram,
            twitter: data.social?.twitter,
            youtube: data.social?.youtube,
            quickLinks: JSON.stringify(data.quickLinks || [], null, 2)
          });
        } else {
          setFormData({
            description: "Karnataka's premier fishing community. Join us for unforgettable fishing experiences, exciting tournaments, and a passion for the waters.",
            address: "Manvi, Raichur District, Karnataka 584123",
            phone: "+91 98765 43210",
            email: "info@manvifishingclub.com",
            facebook: "#",
            instagram: "#",
            twitter: "#",
            youtube: "#",
            quickLinks: JSON.stringify([
              { name: "About Us", href: "#about" },
              { name: "Tournaments", href: "#tournaments" },
              { name: "Membership", href: "#membership" },
              { name: "Gallery", href: "/gallery" },
              { name: "Careers", href: "/careers" },
            ], null, 2)
          });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data. Please check your permissions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const tournamentData = {
        name: formData.name,
        date: formData.date,
        location: formData.location,
        price: Number(formData.price),
        maxParticipants: Number(formData.maxParticipants),
        status: formData.status || 'upcoming',
        image: formData.image || '',
        prize: formData.prize || '',
        updatedAt: new Date()
      };

      if (formData.id) {
        await updateDoc(doc(db, "tournaments", formData.id), tournamentData);
        toast({ title: "Success", description: "Tournament updated successfully" });
      } else {
        await addDoc(collection(db, "tournaments"), { ...tournamentData, createdAt: new Date() });
        toast({ title: "Success", description: "Tournament created successfully" });
      }
      setShowForm(false);
      setFormData({});
      fetchData("tournaments");
    } catch (error) {
      console.error("Error saving tournament:", error);
      toast({ title: "Error", description: "Failed to save tournament", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedTournaments = async () => {
    if (tournaments.length > 0 && !window.confirm("You already have tournaments. Add defaults anyway?")) return;
    setIsLoading(true);
    try {
      const defaultTournaments = [
        {
          name: "Spring Bass Challenge",
          date: "2025-03-15",
          location: "Krishna River",
          price: 2500,
          maxParticipants: 120,
          status: "upcoming",
          description: "Join us for the annual Spring Bass Challenge. Big prizes and great company!",
          image: "https://images.unsplash.com/photo-1544551763-46a8723ba3f9?auto=format&fit=crop&q=80&w=1000"
        },
        {
          name: "Summer Catch Classic",
          date: "2025-06-20",
          location: "Tungabhadra Dam",
          price: 3000,
          maxParticipants: 100,
          status: "upcoming",
          description: "The biggest summer event in the region. Test your skills against the best.",
          image: "https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&q=80&w=1000"
        },
        {
          name: "Night Fishing Tournament",
          date: "2025-08-08",
          location: "Almatti Dam",
          price: 1750,
          maxParticipants: 80,
          status: "upcoming",
          description: "Experience the thrill of night fishing under the stars.",
          image: "https://images.unsplash.com/photo-1504280509243-4891b6e287a2?auto=format&fit=crop&q=80&w=1000"
        }
      ];

      for (const t of defaultTournaments) {
        await addDoc(collection(db, "tournaments"), { ...t, createdAt: new Date() });
      }
      toast({ title: "Success", description: "Default tournaments added" });
      fetchData("tournaments");
    } catch (error) {
      console.error("Error seeding tournaments:", error);
      toast({ title: "Error", description: "Failed to seed tournaments", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, "gallery"), {
        ...formData,
        createdAt: new Date()
      });
      toast({ title: "Success", description: "Image added to gallery" });
      setShowForm(false);
      setFormData({});
      fetchData("gallery");
    } catch (error) {
      console.error("Error adding to gallery:", error);
      toast({ title: "Error", description: "Failed to add image", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedGallery = async () => {
    if (gallery.length > 0 && !window.confirm("You already have images. Add defaults anyway?")) return;
    setIsLoading(true);
    try {
      const defaultGallery = [
        {
          title: "Monster Catfish",
          url: "https://images.unsplash.com/photo-1544551763-46a8723ba3f9?auto=format&fit=crop&q=80&w=1000",
          category: "catches",
          description: "Caught by Rajesh at Krishna River",
          author: "Rajesh K.",
          likes: 24,
          likedBy: [],
          date: new Date().toISOString().split('T')[0]
        },
        {
          title: "Golden Mahseer",
          url: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&q=80&w=1000",
          category: "catches",
          description: "A rare beauty caught during the morning session",
          author: "Vikram P.",
          likes: 56,
          likedBy: [],
          date: new Date().toISOString().split('T')[0]
        },
        {
          title: "River Carp",
          url: "https://images.unsplash.com/photo-1615147342761-9238e15d8b96?auto=format&fit=crop&q=80&w=1000",
          category: "catches",
          description: "Huge carp weighing 12kg",
          author: "Anil S.",
          likes: 32,
          likedBy: [],
          date: new Date().toISOString().split('T')[0]
        },
        {
          title: "Weekend Haul",
          url: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=1000",
          category: "catches",
          description: "Great day out with the team",
          author: "Team Alpha",
          likes: 41,
          likedBy: [],
          date: new Date().toISOString().split('T')[0]
        },
        {
          title: "First Catch",
          url: "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&q=80&w=1000",
          category: "catches",
          description: "My son's first ever catch!",
          author: "Suresh R.",
          likes: 89,
          likedBy: [],
          date: new Date().toISOString().split('T')[0]
        },
        {
          title: "Sunrise at the Lake",
          url: "https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&q=80&w=1000",
          category: "events",
          description: "Beautiful morning start for the tournament",
          author: "Admin",
          likes: 45,
          likedBy: [],
          date: new Date().toISOString().split('T')[0]
        },
        {
          title: "Community Meetup",
          url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1000",
          category: "events",
          description: "Discussing strategies for the upcoming season",
          author: "Club Secretary",
          likes: 67,
          likedBy: [],
          date: new Date().toISOString().split('T')[0]
        },
        {
          title: "Kids Fishing Workshop",
          url: "https://images.unsplash.com/photo-1488998527040-85054a85150e?auto=format&fit=crop&q=80&w=1000",
          category: "events",
          description: "Teaching the next generation",
          author: "Instructor Dave",
          likes: 120,
          likedBy: [],
          date: new Date().toISOString().split('T')[0]
        },
        {
          title: "Annual BBQ",
          url: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&q=80&w=1000",
          category: "events",
          description: "Post-tournament celebration",
          author: "Event Team",
          likes: 95,
          likedBy: [],
          date: new Date().toISOString().split('T')[0]
        },
        {
          title: "River Cleanup Drive",
          url: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=1000",
          category: "events",
          description: "Keeping our waters clean",
          author: "Eco Team",
          likes: 150,
          likedBy: [],
          date: new Date().toISOString().split('T')[0]
        },
        {
          title: "Team Victory",
          url: "https://images.unsplash.com/photo-1504280509243-4891b6e287a2?auto=format&fit=crop&q=80&w=1000",
          category: "tournaments",
          description: "Winners of the 2024 Winter Cup",
          author: "Club Official",
          likes: 112,
          likedBy: [],
          date: new Date().toISOString().split('T')[0]
        },
        {
          title: "Tournament Kickoff",
          url: "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&q=80&w=1000",
          category: "tournaments",
          description: "Boats lining up for the start",
          author: "Admin",
          likes: 78,
          likedBy: [],
          date: new Date().toISOString().split('T')[0]
        },
        {
          title: "Weigh-in Ceremony",
          url: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&q=80&w=1000",
          category: "tournaments",
          description: "Checking the weights for the big prize",
          author: "Judge Mike",
          likes: 65,
          likedBy: [],
          date: new Date().toISOString().split('T')[0]
        },
        {
          title: "Prize Distribution",
          url: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&q=80&w=1000",
          category: "tournaments",
          description: "Awarding the top anglers",
          author: "President",
          likes: 105,
          likedBy: [],
          date: new Date().toISOString().split('T')[0]
        },
        {
          title: "Action Shot",
          url: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&q=80&w=1000",
          category: "tournaments",
          description: "Intense moment reeling in a big one",
          author: "Photographer",
          likes: 134,
          likedBy: [],
          date: new Date().toISOString().split('T')[0]
        }
      ];

      for (const item of defaultGallery) {
        await addDoc(collection(db, "gallery"), { ...item, createdAt: new Date() });
      }
      toast({ title: "Success", description: "Default gallery images added" });
      fetchData("gallery");
    } catch (error) {
      console.error("Error seeding gallery:", error);
      toast({ title: "Error", description: "Failed to seed gallery", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMembership = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const featuresList = typeof formData.features === 'string'
        ? formData.features.split('\n').filter((f: string) => f.trim())
        : formData.features || [];

      const planData = {
        name: formData.name,
        price: Number(formData.price),
        interval: formData.interval || 'year',
        description: formData.description || '',
        planId: formData.planId || formData.name.toLowerCase().replace(/\s+/g, '_'),
        features: featuresList,
        updatedAt: new Date()
      };

      if (formData.id) {
        await updateDoc(doc(db, "membershipPlans", formData.id), planData);
        toast({ title: "Success", description: "Membership plan updated" });
      } else {
        await addDoc(collection(db, "membershipPlans"), { ...planData, createdAt: new Date() });
        toast({ title: "Success", description: "Membership plan created" });
      }
      setShowForm(false);
      setFormData({});
      fetchData("memberships");
    } catch (error) {
      console.error("Error saving membership:", error);
      toast({ title: "Error", description: "Failed to save plan", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedMemberships = async () => {
    if (memberships.length > 0 && !window.confirm("You already have plans. Add defaults anyway?")) return;
    setIsLoading(true);
    try {
      const defaultPlans = [
        {
          name: "Basic",
          price: 999,
          interval: "year",
          description: "Perfect for beginners exploring the fishing community",
          features: ["Access to member events", "Monthly newsletter", "Community forum access", "Basic fishing tips & guides", "10% discount on merchandise"],
          planId: "basic"
        },
        {
          name: "Premium",
          price: 2999,
          interval: "year",
          description: "For dedicated anglers who want the full experience",
          features: ["Everything in Basic", "Priority tournament registration", "Exclusive fishing spot access", "Expert mentorship program", "20% discount on merchandise", "Free gear rental (2x/month)", "Members-only WhatsApp group"],
          planId: "premium"
        },
        {
          name: "Elite",
          price: 5999,
          interval: "year",
          description: "For the serious angler who wants it all",
          features: ["Everything in Premium", "VIP tournament access", "Personal fishing coach", "Unlimited gear rental", "30% discount on merchandise", "Exclusive boat trips", "Guest passes (3x/year)", "Custom club merchandise"],
          planId: "elite"
        }
      ];

      for (const plan of defaultPlans) {
        await addDoc(collection(db, "membershipPlans"), { ...plan, createdAt: new Date(), updatedAt: new Date() });
      }
      toast({ title: "Success", description: "Default plans added" });
      fetchData("memberships");
    } catch (error) {
      console.error("Error seeding memberships:", error);
      toast({ title: "Error", description: "Failed to seed plans", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const jobData = {
        title: formData.title,
        type: formData.type,
        location: formData.location,
        description: formData.description,
        updatedAt: new Date()
      };

      if (formData.id) {
        await updateDoc(doc(db, "careers", formData.id), jobData);
        toast({ title: "Success", description: "Job updated successfully" });
      } else {
        await addDoc(collection(db, "careers"), { ...jobData, createdAt: new Date() });
        toast({ title: "Success", description: "Job posted successfully" });
      }
      setShowForm(false);
      setFormData({});
      fetchData("jobs");
    } catch (error) {
      console.error("Error saving job:", error);
      toast({ title: "Error", description: "Failed to save job", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedJobs = async () => {
    if (jobs.length > 0 && !window.confirm("You already have jobs. Add defaults anyway?")) return;
    setIsLoading(true);
    try {
      const defaultJobs = [
        {
          title: "Tournament Coordinator",
          description: "Organize and manage fishing tournaments, coordinate with participants, and ensure smooth event execution.",
          type: "Full-time",
          location: "Manvi, Karnataka"
        },
        {
          title: "Fishing Instructor",
          description: "Train new members on fishing techniques, safety protocols, and equipment usage.",
          type: "Part-time",
          location: "Multiple Locations"
        },
        {
          title: "Community Manager",
          description: "Manage our social media presence, engage with the community, and create compelling content.",
          type: "Remote",
          location: "Work from Home"
        }
      ];

      for (const job of defaultJobs) {
        await addDoc(collection(db, "careers"), { ...job, createdAt: new Date() });
      }
      toast({ title: "Success", description: "Default jobs added" });
      fetchData("jobs");
    } catch (error) {
      console.error("Error seeding jobs:", error);
      toast({ title: "Error", description: "Failed to seed jobs", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLeaderboardEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const entryData = {
        rank: Number(formData.rank),
        name: formData.name,
        catches: Number(formData.catches),
        weight: formData.weight,
        points: Number(formData.points),
        updatedAt: new Date()
      };

      if (formData.id) {
        await updateDoc(doc(db, "leaderboard", formData.id), entryData);
        toast({ title: "Success", description: "Entry updated" });
      } else {
        await addDoc(collection(db, "leaderboard"), { ...entryData, createdAt: new Date() });
        toast({ title: "Success", description: "Entry added" });
      }
      setShowForm(false);
      setFormData({});
      fetchData("leaderboard");
    } catch (error) {
      console.error("Error saving leaderboard entry:", error);
      toast({ title: "Error", description: "Failed to save entry", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedLeaderboard = async () => {
    if (leaderboard.length > 0 && !window.confirm("Leaderboard not empty. Add defaults?")) return;
    setIsLoading(true);
    try {
      const defaultLeaderboard = [
        { rank: 1, name: "Rajesh Kumar", catches: 24, weight: "45.2 kg", points: 1250 },
        { rank: 2, name: "Anil Sharma", catches: 22, weight: "42.8 kg", points: 1180 },
        { rank: 3, name: "Vikram Patel", catches: 21, weight: "40.5 kg", points: 1120 },
        { rank: 4, name: "Suresh Reddy", catches: 20, weight: "38.9 kg", points: 1050 },
        { rank: 5, name: "Mahesh Rao", catches: 19, weight: "37.2 kg", points: 980 },
        { rank: 6, name: "Prakash Singh", catches: 18, weight: "35.8 kg", points: 920 },
        { rank: 7, name: "Ravi Verma", catches: 17, weight: "34.1 kg", points: 870 },
        { rank: 8, name: "Deepak Joshi", catches: 16, weight: "32.6 kg", points: 820 },
        { rank: 9, name: "Kiran Naidu", catches: 15, weight: "31.0 kg", points: 770 },
        { rank: 10, name: "Sanjay Murthy", catches: 14, weight: "29.5 kg", points: 720 },
      ];
      for (const entry of defaultLeaderboard) {
        await addDoc(collection(db, "leaderboard"), { ...entry, createdAt: new Date() });
      }
      toast({ title: "Success", description: "Leaderboard seeded" });
      fetchData("leaderboard");
    } catch (error) {
      console.error("Error seeding leaderboard:", error);
      toast({ title: "Error", description: "Failed to seed leaderboard", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updateData: any = {
        displayName: formData.displayName,
        role: formData.role,
      };

      if (formData.membershipPlan) {
        if (formData.membershipPlan === 'none') {
          updateData.membership = null;
        } else {
          const now = new Date();
          const expiresAt = new Date(now);
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
          updateData.membership = {
            plan: formData.membershipPlan,
            purchasedAt: now,
            expiresAt: expiresAt
          };
        }
      }

      await updateDoc(doc(db, "users", formData.id), updateData);
      toast({ title: "Success", description: "User updated successfully" });
      setShowForm(false);
      setFormData({});
      fetchData("users");
    } catch (error) {
      console.error("Error updating user:", error);
      toast({ title: "Error", description: "Failed to update user", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, "payments"), {
        userId: formData.userId || "manual_entry",
        amount: Number(formData.amount),
        type: formData.type || "manual_payment",
        status: formData.status || "completed",
        date: new Date()
      });

      // Dynamic Access: If it's a membership payment, automatically update the user's profile
      if (formData.userId && formData.type?.toLowerCase().includes('membership') && formData.status === 'completed') {
        const userId = formData.userId.trim();
        const typeLower = formData.type.toLowerCase();

        // Dynamic: Extract plan name from type (e.g. membership_gold -> gold)
        let planName = 'basic';
        if (typeLower.startsWith('membership_')) {
          planName = typeLower.replace('membership_', '');
        } else if (typeLower.includes('elite')) planName = 'elite';
        else if (typeLower.includes('premium')) planName = 'premium';
        else if (typeLower.includes('basic')) planName = 'basic';

        const now = new Date();
        const expiresAt = new Date(now);
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        await setDoc(doc(db, "users", userId), {
          membership: {
            plan: planName,
            purchasedAt: now,
            expiresAt: expiresAt
          }
        }, { merge: true });

        toast({ title: "Success", description: `Payment recorded & ${planName} membership assigned` });
      } else {
        toast({ title: "Success", description: "Payment recorded successfully" });
      }

      setShowForm(false);
      setFormData({});
      // fetchData("sales"); // No need to fetch manually, onSnapshot handles it
    } catch (error) {
      console.error("Error recording payment:", error);
      toast({ title: "Error", description: "Failed to record payment", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };



  const handleSaveNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, "notifications"), {
        title: formData.title,
        message: formData.message,
        type: formData.type || 'info', // info, urgent, success
        createdAt: new Date()
      });
      toast({ title: "Success", description: "Notification sent successfully" });
      setShowForm(false);
      setFormData({});
      fetchData("notifications");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({ title: "Error", description: "Failed to send notification", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "notifications", id));
      toast({ title: "Success", description: "Notification deleted" });
      fetchData("notifications");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({ title: "Error", description: "Failed to delete notification", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = {
        name: formData.name,
        role: formData.role,
        bio: formData.bio,
        bioHindi: formData.bioHindi,
        shortBio: formData.shortBio,
        imageUrl: formData.imageUrl || "", // Optional: specific image URL
        createdAt: new Date()
      };

      if (formData.id) {
        await updateDoc(doc(db, "team_members", formData.id), data);
        toast({ title: "Team member updated" });
      } else {
        await addDoc(collection(db, "team_members"), data);
        toast({ title: "Team member added" });
      }
      setShowForm(false);
      setFormData({});
      fetchData("ems");
    } catch (error) {
      console.error("Error saving team member:", error);
      toast({ title: "Error saving team member", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "team_members", id));
      toast({ title: "Team member deleted" });
      fetchData("ems");
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast({ title: "Error deleting team member", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const settingsData = {
        description: formData.description,
        contact: {
          address: formData.address,
          phone: formData.phone,
          email: formData.email
        },
        social: {
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter,
          youtube: formData.youtube
        },
        quickLinks: formData.quickLinks ? JSON.parse(formData.quickLinks) : [],
        updatedAt: new Date()
      };

      await setDoc(doc(db, "site_settings", "footer"), settingsData);
      toast({ title: "Success", description: "Settings saved successfully" });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({ title: "Error", description: "Failed to save settings. Check JSON format.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedSettings = async () => {
    if (!window.confirm("This will overwrite current footer settings with defaults. Continue?")) return;
    setIsLoading(true);
    try {
      const defaultSettings = {
        description: "Karnataka's premier fishing community. Join us for unforgettable fishing experiences, exciting tournaments, and a passion for the waters.",
        contact: {
          address: "Manvi, Raichur District, Karnataka 584123",
          phone: "+91 98765 43210",
          email: "info@manvifishingclub.com"
        },
        social: {
          facebook: "#",
          instagram: "#",
          twitter: "#",
          youtube: "#"
        },
        quickLinks: [
          { name: "About Us", href: "#about" },
          { name: "Tournaments", href: "#tournaments" },
          { name: "Membership", href: "#membership" },
          { name: "Gallery", href: "/gallery" },
          { name: "Careers", href: "/careers" },
        ],
        updatedAt: new Date()
      };

      await setDoc(doc(db, "site_settings", "footer"), defaultSettings);
      toast({ title: "Success", description: "Default settings seeded" });
      fetchData("settings");
    } catch (error) {
      console.error("Error seeding settings:", error);
      toast({ title: "Error", description: "Failed to seed settings", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "job_applications", id), {
        status: newStatus
      });
      toast({ title: "Status Updated", description: `Application marked as ${newStatus}` });
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    } catch (error) {
      console.error("Error updating status:", error);
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const handleSaveApplicationNote = async () => {
    if (!viewApplication) return;
    try {
      await updateDoc(doc(db, "job_applications", viewApplication.id), {
        notes: applicationNote
      });
      setApplications(prev => prev.map(app =>
        app.id === viewApplication.id ? { ...app, notes: applicationNote } : app
      ));
      setViewApplication((prev: any) => ({ ...prev, notes: applicationNote }));
      toast({ title: "Success", description: "Note saved successfully" });
    } catch (error) {
      console.error("Error saving note:", error);
      toast({ title: "Error", description: "Failed to save note", variant: "destructive" });
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteDoc(doc(db, collectionName, id));
      toast({ title: "Deleted", description: "Item removed successfully" });
      // Refresh current tab
      fetchData(activeTab);
    } catch (error) {
      console.error(`Error deleting from ${collectionName}:`, error);
      toast({ title: "Error", description: "Failed to delete item", variant: "destructive" });
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user) return null;

  const renderOverview = () => {
    // Calculate revenue data for the last 7 days
    const revenueData = (() => {
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      return last7Days.map(date => {
        const dayTotal = sales
          .filter(s => {
            if (!s.date) return false;
            try {
              const sDate = s.date.toDate ? s.date.toDate() : new Date(s.date);
              if (isNaN(sDate.getTime())) return false;
              return sDate.toISOString().split('T')[0] === date;
            } catch (e) {
              return false;
            }
          })
          .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        return { date, amount: dayTotal };
      });
    })();

    // Calculate user growth data for the last 7 days
    const userGrowthData = (() => {
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      return last7Days.map(date => {
        const dayCount = users.filter(u => {
          if (!u.createdAt) return false;
          try {
            const uDate = u.createdAt.toDate ? u.createdAt.toDate() : new Date(u.createdAt);
            if (isNaN(uDate.getTime())) return false;
            return uDate.toISOString().split('T')[0] === date;
          } catch (e) {
            return false;
          }
        }).length;
        return { date, count: dayCount };
      });
    })();

    const maxRevenue = Math.max(...revenueData.map(d => d.amount)) || 100;
    const maxUsers = Math.max(...userGrowthData.map(d => d.count)) || 5;

    const revenueChartConfig = {
      amount: {
        label: "Revenue",
        color: "#22c55e",
      },
    } satisfies ChartConfig;

    const userChartConfig = {
      count: {
        label: "Users",
        color: "#3b82f6",
      },
    } satisfies ChartConfig;

    return (
      <div className="space-y-8">
        {/* Key Metrics - Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Total Users */}
          <div className="bg-card p-8 rounded-2xl border shadow-sm flex flex-col justify-between h-48 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Users className="w-24 h-24 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-muted-foreground">Total Users</p>
              <h3 className="text-5xl font-bold mt-4 text-primary">{users.length}</h3>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-4">
              <span className="text-green-500 flex items-center font-medium bg-green-500/10 px-2 py-1 rounded-full">
                Active
              </span>
              <span className="ml-2">community members</span>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-card p-8 rounded-2xl border shadow-sm flex flex-col justify-between h-48 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <CreditCard className="w-24 h-24 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-muted-foreground">Total Revenue</p>
              <h3 className="text-5xl font-bold mt-4 text-green-600">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(sales.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0))}
              </h3>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-4">
              <span className="text-green-500 flex items-center font-medium bg-green-500/10 px-2 py-1 rounded-full">
                +{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
                  sales.filter(s => {
                    if (!s.date) return false;
                    const sDate = s.date.toDate ? s.date.toDate() : new Date(s.date);
                    return sDate.toDateString() === new Date().toDateString();
                  }).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
                )} today
              </span>
              <span className="ml-2">from {sales.length} transactions</span>
            </div>
          </div>

          {/* Active Tournaments */}
          <div className="bg-card p-8 rounded-2xl border shadow-sm flex flex-col justify-between h-48 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Trophy className="w-24 h-24 text-secondary" />
            </div>
            <div>
              <p className="text-lg font-medium text-muted-foreground">Active Tournaments</p>
              <h3 className="text-5xl font-bold mt-4 text-secondary">{tournaments.filter(t => t.status === 'upcoming' || t.status === 'open').length}</h3>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-4">
              <span className="text-secondary flex items-center font-medium bg-secondary/10 px-2 py-1 rounded-full">
                {registrations.length}
              </span>
              <span className="ml-2">total registrations</span>
            </div>
          </div>
        </div>

        {/* Revenue Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card p-8 rounded-2xl border shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold">Revenue Analytics</h3>
                  <p className="text-muted-foreground">Last 7 days performance</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <IndianRupee className="w-6 h-6 text-green-600" />
                </div>
              </div>

              <ChartContainer config={revenueChartConfig} className="h-64 w-full">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="var(--color-amount)"
                    fillOpacity={1}
                    fill="url(#fillRevenue)"
                  />
                </AreaChart>
              </ChartContainer>
            </div>

            {/* User Growth Chart */}
            <div className="bg-card p-8 rounded-2xl border shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold">User Growth</h3>
                  <p className="text-muted-foreground">New members in last 7 days</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              <ChartContainer config={userChartConfig} className="h-64 w-full">
                <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-count)"
                    fillOpacity={1}
                    fill="url(#fillUsers)"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-card p-6 rounded-xl border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Membership Plans</p>
                <h4 className="text-2xl font-bold mt-1">{memberships.length}</h4>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                <Crown className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-card p-6 rounded-xl border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gallery Images</p>
                <h4 className="text-2xl font-bold mt-1">{gallery.length}</h4>
              </div>
              <div className="p-3 bg-accent/10 rounded-xl text-accent">
                <ImageIcon className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-card p-6 rounded-xl border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Jobs</p>
                <h4 className="text-2xl font-bold mt-1">{jobs.length}</h4>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-card p-6 rounded-xl border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applications</p>
                <h4 className="text-2xl font-bold mt-1">{applications.length}</h4>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-card p-6 rounded-xl border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subscribers</p>
                <h4 className="text-2xl font-bold mt-1">{subscribers.length}</h4>
              </div>
              <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500">
                <Mail className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTournaments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Tournaments</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSeedTournaments} disabled={isLoading}>
            <Sparkles className="w-4 h-4 mr-2" /> Seed Defaults
          </Button>
          <Button onClick={() => { setShowForm(true); setFormData({}); }}>
            <Plus className="w-4 h-4 mr-2" /> Create Tournament
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-xl border shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">{formData.id ? 'Edit' : 'New'} Tournament</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
          </div>
          <form onSubmit={handleSaveTournament} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tournament Name</Label>
                <Input required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" required value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input required value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Entry Fee (₹)</Label>
                <Input type="number" required value={formData.price || ''} onChange={e => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Max Participants</Label>
                <Input type="number" required value={formData.maxParticipants || ''} onChange={e => setFormData({ ...formData, maxParticipants: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Prize Pool</Label>
                <Input placeholder="e.g. ₹50,000" value={formData.prize || ''} onChange={e => setFormData({ ...formData, prize: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input placeholder="https://..." value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.status || 'upcoming'}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="open">Registration Open</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Tournament
            </Button>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {tournaments.map((t) => (
          <div key={t.id} className="bg-card p-4 rounded-xl border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                <img
                  src={t.image || "https://images.unsplash.com/photo-1544551763-46a8723ba3f9?auto=format&fit=crop&q=80&w=1000"}
                  alt={t.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t.name}</h3>
                <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {t.date}</span>
                  <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {t.location}</span>
                  <span className="flex items-center"><IndianRupee className="w-3 h-3 mr-1" /> {t.price}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded-full text-xs ${t.status === 'completed' ? 'bg-muted text-muted-foreground' :
                t.status === 'ongoing' ? 'bg-green-500/10 text-green-500' :
                  t.status === 'open' ? 'bg-secondary/10 text-secondary' :
                    'bg-blue-500/10 text-blue-500'
                }`}>
                {t.status === 'open' ? 'REGISTRATION OPEN' : t.status?.toUpperCase() || 'UPCOMING'}
              </span>
              <Button variant="ghost" size="icon" onClick={() => { setFormData(t); setShowForm(true); }}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete("tournaments", t.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {tournaments.length === 0 && <p className="text-center text-muted-foreground py-8">No tournaments found.</p>}
      </div>
    </div>
  );

  const renderRegistrations = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tournament Registrations</h2>
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Participant</th>
                <th className="px-4 py-3">Tournament ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {r.userName || 'Unknown User'}
                    <div className="text-xs text-muted-foreground">{r.userEmail}</div>
                  </td>
                  <td className="px-4 py-3">{r.tournamentId}</td>
                  <td className="px-4 py-3">{r.registeredAt?.toDate ? r.registeredAt.toDate().toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-xs">
                      {r.status || 'Confirmed'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete("registrations", r.id)}>
                      Cancel
                    </Button>
                  </td>
                </tr>
              ))}
              {registrations.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No registrations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => {
    const filteredUsers = users.filter(u => {
      if (userFilter === "google") return u.provider === "google";
      if (userFilter === "email") return u.provider === "email";
      if (userFilter === "tournament") {
        // Check if user ID exists in registrations
        return registrations.some(r => r.userId === u.id);
      }
      return true;
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold">User Management</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant={userFilter === 'all' ? 'secondary' : 'outline'} size="sm" onClick={() => setUserFilter('all')}>
              All Users
            </Button>
            <Button variant={userFilter === 'google' ? 'secondary' : 'outline'} size="sm" onClick={() => setUserFilter('google')}>
              Google Users
            </Button>
            <Button variant={userFilter === 'email' ? 'secondary' : 'outline'} size="sm" onClick={() => setUserFilter('email')}>
              Email Users
            </Button>
            <Button variant={userFilter === 'tournament' ? 'secondary' : 'outline'} size="sm" onClick={() => setUserFilter('tournament')}>
              Tournament Registered
            </Button>
          </div>
        </div>
        <div className="bg-card rounded-xl border overflow-hidden">
          {showForm && (
            <div className="p-4 border-b bg-muted/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Edit User</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
              </div>
              <form onSubmit={handleUpdateUser} className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input value={formData.displayName || ''} onChange={e => setFormData({ ...formData, displayName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.role || 'user'}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Membership Plan</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.membershipPlan || 'none'}
                    onChange={e => setFormData({ ...formData, membershipPlan: e.target.value })}
                  >
                    <option value="none">None</option>
                    {memberships.map(plan => (
                      <option key={plan.id} value={plan.planId || plan.name.toLowerCase()}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="md:col-span-3" disabled={isLoading}>Update User</Button>
              </form>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Membership</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{u.displayName || 'N/A'}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize">{u.membership?.plan || 'None'}</td>
                    <td className="px-4 py-3">{u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : 'N/A'}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon" onClick={() => {
                        setFormData({
                          id: u.id,
                          displayName: u.displayName,
                          role: u.role,
                          membershipPlan: u.membership?.plan || 'none'
                        });
                        setShowForm(true);
                      }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No users found for this filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderGallery = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSeedGallery} disabled={isLoading}>
            <Sparkles className="w-4 h-4 mr-2" /> Seed Defaults
          </Button>
          <Button onClick={() => { setShowForm(true); setFormData({}); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Image
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-xl border shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Add New Image</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
          </div>
          <form onSubmit={handleAddToGallery} className="space-y-4">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input required placeholder="https://..." value={formData.url || ''} onChange={e => setFormData({ ...formData, url: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Caption / Title</Label>
              <Input required placeholder="Big Catch at River..." value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.category || 'catches'}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="catches">Catches</option>
                <option value="tournaments">Tournaments</option>
                <option value="events">Events</option>
              </select>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Add to Gallery
            </Button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="group relative aspect-square bg-muted rounded-xl overflow-hidden border">
            <img src={item.url || item.src || item.image || "https://images.unsplash.com/photo-1544551763-46a8723ba3f9?auto=format&fit=crop&q=80&w=1000"} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
              <p className="font-semibold text-sm mb-2">{item.title}</p>
              <p className="text-xs text-white/80 mb-2" title={item.likedBy?.join(', ') || 'No likes yet'}>
                Liked by: {item.likedBy?.length || 0} users
              </p>
              <Button variant="destructive" size="sm" onClick={() => handleDelete("gallery", item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {gallery.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">No images in gallery.</p>}
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales & Payments</h2>
        <Button onClick={() => { setShowForm(true); setFormData({}); }}>
          <Plus className="w-4 h-4 mr-2" /> Record Manual Payment
        </Button>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-xl border shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Record Payment</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
          </div>
          <form onSubmit={handleCreatePayment} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input type="number" required value={formData.amount || ''} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Input placeholder="e.g. membership_premium" value={formData.type || ''} onChange={e => setFormData({ ...formData, type: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>User ID (Optional)</Label>
                <Input placeholder="User UID" value={formData.userId || ''} onChange={e => setFormData({ ...formData, userId: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Input value={formData.status || 'completed'} onChange={e => setFormData({ ...formData, status: e.target.value })} />
              </div>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Record
            </Button>
          </form>
        </div>
      )}

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">User ID</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-3">{s.date?.toDate ? s.date.toDate().toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-3 capitalize">{s.type?.replace('_', ' ')}</td>
                  <td className="px-4 py-3 font-mono">₹{s.amount}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-xs">
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{s.userId}</td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No sales records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMemberships = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Membership Plans</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSeedMemberships} disabled={isLoading}>
            <Sparkles className="w-4 h-4 mr-2" /> Seed Defaults
          </Button>
          <Button onClick={() => { setShowForm(true); setFormData({}); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Plan
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-xl border shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">{formData.id ? 'Edit' : 'New'} Membership Plan</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
          </div>
          <form onSubmit={handleSaveMembership} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan Name</Label>
                <Input required placeholder="e.g. Premium" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input type="number" required value={formData.price || ''} onChange={e => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Interval</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.interval || 'year'}
                  onChange={e => setFormData({ ...formData, interval: e.target.value })}
                >
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input required placeholder="Short description of the plan" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Features (One per line)</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                placeholder="Feature 1&#10;Feature 2"
                value={formData.features || ''}
                onChange={e => setFormData({ ...formData, features: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Plan
            </Button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {memberships.map((item) => (
          <div key={item.id} className="bg-card p-6 rounded-xl border shadow-sm relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => { setFormData({ ...item, features: item.features?.join('\n') }); setShowForm(true); }}>
                <span className="sr-only">Edit</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete("membershipPlans", item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <h3 className="text-xl font-bold mb-2">{item.name}</h3>
            <p className="text-sm text-muted-foreground mb-3 min-h-[40px]">{item.description}</p>
            <div className="text-2xl font-bold text-primary mb-4">₹{item.price}<span className="text-sm font-normal text-muted-foreground">/{item.interval}</span></div>
            <ul className="space-y-2 mb-4">
              {item.features?.map((f: string, i: number) => (
                <li key={i} className="flex items-center text-sm text-muted-foreground">
                  <span className="mr-2 text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {memberships.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">No membership plans found.</p>}
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Careers</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSeedJobs} disabled={isLoading}>
            <Sparkles className="w-4 h-4 mr-2" /> Seed Defaults
          </Button>
          <Button onClick={() => { setShowForm(true); setFormData({}); }}>
            <Plus className="w-4 h-4 mr-2" /> Post Job
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-xl border shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">{formData.id ? 'Edit' : 'New'} Job Opening</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
          </div>
          <form onSubmit={handleSaveJob} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input required placeholder="e.g. Fishing Guide" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.type || 'Full-time'}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input required placeholder="e.g. Manvi, Karnataka" value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                placeholder="Job responsibilities and requirements..."
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Job
            </Button>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-card p-4 rounded-xl border flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center"><Briefcase className="w-3 h-3 mr-1" /> {job.type}</span>
                <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {job.location}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-1">{job.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => { setFormData(job); setShowForm(true); }}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete("careers", job.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && <p className="text-center text-muted-foreground py-8">No job openings found.</p>}
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Job Applications</h2>
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {app.name}
                    <div className="text-xs text-muted-foreground">{app.email}</div>
                  </td>
                  <td className="px-4 py-3">{app.jobTitle}</td>
                  <td className="px-4 py-3">{app.phone}</td>
                  <td className="px-4 py-3">{app.appliedAt?.toDate ? app.appliedAt.toDate().toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-3">
                    <select
                      className="bg-background border rounded px-2 py-1 text-xs h-8 w-32"
                      value={app.status || 'new'}
                      onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="offer">Offer Sent</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => {
                      setViewApplication(app);
                      setApplicationNote(app.notes || "");
                    }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete("job_applications", app.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No applications received yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!viewApplication} onOpenChange={(open) => !open && setViewApplication(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Applied for: <span className="font-semibold text-foreground">{viewApplication?.jobTitle}</span>
            </DialogDescription>
          </DialogHeader>
          {viewApplication && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Applicant Name</Label>
                  <p className="font-medium">{viewApplication.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{viewApplication.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{viewApplication.phone || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date Applied</Label>
                  <p className="font-medium">{viewApplication.appliedAt?.toDate ? viewApplication.appliedAt.toDate().toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Portfolio / LinkedIn</Label>
                {viewApplication.portfolio ? (
                  <a href={viewApplication.portfolio} target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline truncate">
                    {viewApplication.portfolio}
                  </a>
                ) : <p>N/A</p>}
              </div>

              <div>
                <Label className="text-muted-foreground">Cover Letter</Label>
                <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap mt-1">
                  {viewApplication.coverLetter}
                </div>
              </div>

              {viewApplication.resumeUrl && (
                <div>
                  <Label className="text-muted-foreground">Resume</Label>
                  <div className="mt-1">
                    <a href={viewApplication.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" /> View Resume
                      </Button>
                    </a>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground">Admin Notes</Label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  placeholder="Add internal notes about this candidate..."
                  value={applicationNote}
                  onChange={(e) => setApplicationNote(e.target.value)}
                />
                <Button size="sm" className="mt-2" onClick={handleSaveApplicationNote}>
                  Save Note
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderNewsletter = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Newsletter Subscribers</h2>
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Date Subscribed</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{sub.email}</td>
                  <td className="px-4 py-3">{sub.subscribedAt?.toDate ? sub.subscribedAt.toDate().toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete("newsletter_subscribers", sub.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No subscribers yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Leaderboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSeedLeaderboard} disabled={isLoading}>
            <Sparkles className="w-4 h-4 mr-2" /> Seed Defaults
          </Button>
          <Button onClick={() => { setShowForm(true); setFormData({}); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Entry
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-xl border shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">{formData.id ? 'Edit' : 'New'} Entry</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
          </div>
          <form onSubmit={handleSaveLeaderboardEntry} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Rank</Label>
              <Input type="number" required value={formData.rank || ''} onChange={e => setFormData({ ...formData, rank: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Catches</Label>
              <Input type="number" required value={formData.catches || ''} onChange={e => setFormData({ ...formData, catches: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Weight (e.g. 45.2 kg)</Label>
              <Input required value={formData.weight || ''} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Points</Label>
              <Input type="number" required value={formData.points || ''} onChange={e => setFormData({ ...formData, points: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Entry
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Catches</th>
                <th className="px-4 py-3">Weight</th>
                <th className="px-4 py-3">Points</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.id} className="border-t">
                  <td className="px-4 py-3 font-bold">#{entry.rank}</td>
                  <td className="px-4 py-3">{entry.name}</td>
                  <td className="px-4 py-3">{entry.catches}</td>
                  <td className="px-4 py-3">{entry.weight}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{entry.points}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setFormData(entry); setShowForm(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete("leaderboard", entry.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {leaderboard.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No leaderboard entries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );



  const renderEMS = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Management (EMS)</h2>
        <Button onClick={() => { setShowForm(true); setFormData({}); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Team Member
        </Button>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-xl border shadow-sm mb-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">{formData.id ? "Edit Member" : "Add New Member"}</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
          </div>
          <form onSubmit={handleSaveTeamMember} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input required placeholder="Full Name" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input required placeholder="e.g. Executive Director" value={formData.role || ''} onChange={e => setFormData({ ...formData, role: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Short Bio</Label>
              <Input required placeholder="Brief description..." value={formData.shortBio || ''} onChange={e => setFormData({ ...formData, shortBio: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Bio (English)</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                placeholder="Full biography in English..."
                value={formData.bio || ''}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Bio (Hindi)</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Biography in Hindi..."
                value={formData.bioHindi || ''}
                onChange={e => setFormData({ ...formData, bioHindi: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Image URL (Optional)</Label>
              <Input placeholder="https://..." value={formData.imageUrl || ''} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Team Member
            </Button>
          </form>
        </div>
      )}

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Short Bio</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{member.name}</td>
                  <td className="px-4 py-3">{member.role}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{member.shortBio}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setFormData(member); setShowForm(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteTeamMember(member.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {teamMembers.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No team members found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Notifications</h2>
        <Button onClick={() => { setShowForm(true); setFormData({}); }}>
          <Plus className="w-4 h-4 mr-2" /> Send Notification
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-card p-6 rounded-xl border shadow-sm mb-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Compose Notification</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
          </div>
          <form onSubmit={handleSaveNotification} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input required placeholder="Notification Title" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Input required placeholder="Notification body content..." value={formData.message || ''} onChange={e => setFormData({ ...formData, message: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.type || 'info'}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="info">Info (Blue)</option>
                  <option value="urgent">Urgent (Red)</option>
                  <option value="success">Success (Green)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled
                >
                  <option value="all">All Users</option>
                </select>
                <p className="text-xs text-muted-foreground">Currently broadcasts to all registered users.</p>
              </div>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Send Broadcast
            </Button>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n) => (
                <tr key={n.id} className="border-t">
                  <td className="px-4 py-3 w-32">{n.createdAt?.toDate ? n.createdAt.toDate().toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-3 font-medium w-48">{n.title}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-md truncate" title={n.message}>{n.message}</td>
                  <td className="px-4 py-3 w-24">
                    <span className={`px-2 py-1 rounded-full text-xs ${n.type === 'urgent' ? 'bg-red-100 text-red-600' :
                      n.type === 'success' ? 'bg-green-100 text-green-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                      {n.type?.toUpperCase() || 'INFO'}
                    </span>
                  </td>
                  <td className="px-4 py-3 w-20">
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteNotification(n.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {notifications.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No notifications sent yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Site Settings</h2>
        <Button variant="outline" onClick={handleSeedSettings} disabled={isLoading}>
          <Sparkles className="w-4 h-4 mr-2" /> Seed Defaults
        </Button>
      </div>
      <div className="bg-card p-6 rounded-xl border shadow-sm">
        <h3 className="font-semibold mb-4">Footer Configuration</h3>
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="space-y-2">
            <Label>About Description</Label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Facebook URL</Label>
              <Input value={formData.facebook || ''} onChange={e => setFormData({ ...formData, facebook: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Instagram URL</Label>
              <Input value={formData.instagram || ''} onChange={e => setFormData({ ...formData, instagram: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Twitter URL</Label>
              <Input value={formData.twitter || ''} onChange={e => setFormData({ ...formData, twitter: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>YouTube URL</Label>
              <Input value={formData.youtube || ''} onChange={e => setFormData({ ...formData, youtube: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quick Links (JSON)</Label>
            <textarea
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
              value={formData.quickLinks || ''}
              onChange={e => setFormData({ ...formData, quickLinks: e.target.value })}
              placeholder='[{"name": "Home", "href": "/"}]'
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save Settings
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:block fixed h-full">
        <div className="p-6">
          <h1 className="font-display text-xl font-bold text-primary">Admin Panel</h1>
        </div>
        <nav className="px-4 space-y-2">
          <Button variant={activeTab === "overview" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("overview")}>
            <LayoutDashboard className="w-4 h-4 mr-2" /> Overview
          </Button>
          <Button variant={activeTab === "tournaments" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("tournaments")}>
            <Trophy className="w-4 h-4 mr-2" /> Tournaments
          </Button>
          <Button variant={activeTab === "registrations" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("registrations")}>
            <Users className="w-4 h-4 mr-2" /> Registrations
          </Button>
          <Button variant={activeTab === "users" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("users")}>
            <Users className="w-4 h-4 mr-2" /> Users
          </Button>
          <Button variant={activeTab === "gallery" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("gallery")}>
            <ImageIcon className="w-4 h-4 mr-2" /> Gallery
          </Button>
          <Button variant={activeTab === "sales" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("sales")}>
            <CreditCard className="w-4 h-4 mr-2" /> Sales & Payments
          </Button>
          <Button variant={activeTab === "memberships" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("memberships")}>
            <Crown className="w-4 h-4 mr-2" /> Memberships
          </Button>
          <Button variant={activeTab === "jobs" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("jobs")}>
            <Briefcase className="w-4 h-4 mr-2" /> Jobs
          </Button>
          <Button variant={activeTab === "applications" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("applications")}>
            <FileText className="w-4 h-4 mr-2" /> Applications
          </Button>
          <Button variant={activeTab === "newsletter" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("newsletter")}>
            <Mail className="w-4 h-4 mr-2" /> Newsletter
          </Button>
          <Button variant={activeTab === "leaderboard" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("leaderboard")}>
            <Trophy className="w-4 h-4 mr-2" /> Leaderboard
          </Button>
          <Button variant={activeTab === "notifications" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("notifications")}>
            <Users className="w-4 h-4 mr-2" /> Notifications
          </Button>
          <Button variant={activeTab === "ems" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("ems")}>
            <Users className="w-4 h-4 mr-2" /> Team Management (EMS)
          </Button>
          <Button variant={activeTab === "settings" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("settings")}>
            <Settings className="w-4 h-4 mr-2" /> Settings
          </Button>

          <div className="pt-8 mt-8 border-t">
            <Button variant="outline" className="w-full justify-start text-muted-foreground" onClick={() => navigate("/dashboard")}>
              ← Back to App
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "tournaments" && renderTournaments()}
          {activeTab === "registrations" && renderRegistrations()}
          {activeTab === "users" && renderUsers()}
          {activeTab === "gallery" && renderGallery()}
          {activeTab === "sales" && renderSales()}
          {activeTab === "memberships" && renderMemberships()}
          {activeTab === "jobs" && renderJobs()}
          {activeTab === "applications" && renderApplications()}
          {activeTab === "newsletter" && renderNewsletter()}
          {activeTab === "leaderboard" && renderLeaderboard()}
          {activeTab === "notifications" && renderNotifications()}
          {activeTab === "ems" && renderEMS()}
          {activeTab === "settings" && renderSettings()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
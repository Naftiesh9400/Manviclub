import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getFirestore, collection, getDocs, query, orderBy, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { Loader2, Shield, Check, X, Plus, Pencil, Trash2, CreditCard, TrendingUp, DollarSign } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  displayName: string;
  role: string;
  membership?: {
    plan: string;
    expiresAt: any;
  };
  createdAt: any;
}

interface RegistrationData {
  id: string;
  tournamentTitle: string;
  userName: string;
  userEmail: string;
  status: string;
  registeredAt: any;
  teamName?: string;
}

interface TournamentData {
  id: string;
  title: string;
  date: string;
  location: string;
  prize: string;
  status: string;
  maxParticipants: number;
  currentParticipants: number;
  description: string;
  image: string;
  rules?: string[];
  schedule?: { time: string; activity: string }[];
}

interface GalleryItemData {
  id: string;
  src: string;
  title: string;
  description: string;
  category: "catches" | "events" | "members";
  likes: number;
  author: string;
  date: string;
}

interface TransactionData {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: string;
  amount: number;
  razorpayPaymentId: string;
  date: any;
  status: string;
}

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [tournaments, setTournaments] = useState<TournamentData[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItemData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTournamentDialogOpen, setIsTournamentDialogOpen] = useState(false);
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<TournamentData>>({});
  const [galleryFormData, setGalleryFormData] = useState<Partial<GalleryItemData>>({});

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        navigate("/");
        return;
      }
      fetchData();
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchData = async () => {
    try {
      const db = getFirestore();
      
      // Fetch Users
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[];
      setUsers(usersList);

      // Fetch Registrations
      const regsSnapshot = await getDocs(query(collection(db, "registrations"), orderBy("registeredAt", "desc")));
      const regsList = regsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RegistrationData[];
      setRegistrations(regsList);

      // Fetch Tournaments
      const tournamentsSnapshot = await getDocs(collection(db, "tournaments"));
      const tournamentsList = tournamentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TournamentData[];
      setTournaments(tournamentsList);

      // Fetch Gallery
      const gallerySnapshot = await getDocs(collection(db, "gallery"));
      const galleryList = gallerySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryItemData[];
      setGalleryItems(galleryList);

      // Fetch Transactions
      const transactionsSnapshot = await getDocs(query(collection(db, "transactions"), orderBy("date", "desc")));
      const transactionsList = transactionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TransactionData[];
      setTransactions(transactionsList);

    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const db = getFirestore();
      await updateDoc(doc(db, "registrations", id), {
        status
      });
      
      setRegistrations(registrations.map(reg => 
        reg.id === id ? { ...reg, status } : reg
      ));

      toast({
        title: "Status Updated",
        description: `Registration marked as ${status}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleOpenTournamentDialog = (tournament?: TournamentData) => {
    if (tournament) {
      setFormData({
        ...tournament,
        rules: tournament.rules || [],
        schedule: tournament.schedule || []
      });
    } else {
      setFormData({
        title: "",
        date: "",
        location: "",
        prize: "",
        status: "Open",
        maxParticipants: 100,
        currentParticipants: 0,
        description: "",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        rules: [],
        schedule: []
      });
    }
    setIsTournamentDialogOpen(true);
  };

  const handleSaveTournament = async () => {
    try {
      const db = getFirestore();
      if (formData.id) {
        // Update
        await updateDoc(doc(db, "tournaments", formData.id), {
          ...formData
        });
        setTournaments(tournaments.map(t => t.id === formData.id ? { ...t, ...formData } as TournamentData : t));
        toast({ title: "Tournament Updated" });
      } else {
        // Create
        const docRef = await addDoc(collection(db, "tournaments"), {
          ...formData,
          createdAt: new Date()
        });
        setTournaments([...tournaments, { ...formData, id: docRef.id } as TournamentData]);
        toast({ title: "Tournament Created" });
      }
      setIsTournamentDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({ title: "Error saving tournament", variant: "destructive" });
    }
  };

  const handleDeleteTournament = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tournament?")) return;
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "tournaments", id));
      setTournaments(tournaments.filter(t => t.id !== id));
      toast({ title: "Tournament Deleted" });
    } catch (error) {
      toast({ title: "Error deleting tournament", variant: "destructive" });
    }
  };

  const handleOpenGalleryDialog = (item?: GalleryItemData) => {
    if (item) {
      setGalleryFormData(item);
    } else {
      setGalleryFormData({
        src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        title: "",
        description: "",
        category: "catches",
        likes: 0,
        author: "Admin",
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      });
    }
    setIsGalleryDialogOpen(true);
  };

  const handleSaveGalleryItem = async () => {
    try {
      const db = getFirestore();
      if (galleryFormData.id) {
        // Update
        await updateDoc(doc(db, "gallery", galleryFormData.id), {
          ...galleryFormData
        });
        setGalleryItems(galleryItems.map(item => item.id === galleryFormData.id ? { ...item, ...galleryFormData } as GalleryItemData : item));
        toast({ title: "Image Updated" });
      } else {
        // Create
        const docRef = await addDoc(collection(db, "gallery"), {
          ...galleryFormData,
          createdAt: new Date()
        });
        setGalleryItems([...galleryItems, { ...galleryFormData, id: docRef.id } as GalleryItemData]);
        toast({ title: "Image Added" });
      }
      setIsGalleryDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({ title: "Error saving image", variant: "destructive" });
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "gallery", id));
      setGalleryItems(galleryItems.filter(item => item.id !== id));
      toast({ title: "Image Deleted" });
    } catch (error) {
      toast({ title: "Error deleting image", variant: "destructive" });
    }
  };

  const totalRevenue = transactions.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-custom px-4">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-8 h-8 text-secondary" />
            <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          </div>
          
          <Tabs defaultValue="registrations" className="space-y-6">
            <TabsList>
              <TabsTrigger value="registrations">Tournament Registrations</TabsTrigger>
              <TabsTrigger value="tournaments">Manage Tournaments</TabsTrigger>
              <TabsTrigger value="sales">Sales & Payments</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="registrations">
              <div className="card-premium overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground uppercase text-xs">
                      <tr>
                        <th className="px-6 py-3">Tournament</th>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Contact</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {registrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4 font-medium">{reg.tournamentTitle}</td>
                          <td className="px-6 py-4">
                            <div>{reg.userName}</div>
                            {reg.teamName && <div className="text-xs text-muted-foreground">Team: {reg.teamName}</div>}
                          </td>
                          <td className="px-6 py-4">{reg.userEmail}</td>
                          <td className="px-6 py-4">
                            {reg.registeredAt?.toDate ? reg.registeredAt.toDate().toLocaleDateString() : new Date(reg.registeredAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              reg.status === 'approved' ? 'bg-green-100 text-green-800' : 
                              reg.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                              reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {reg.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {reg.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                  onClick={() => handleUpdateStatus(reg.id, 'approved')}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                  onClick={() => handleUpdateStatus(reg.id, 'rejected')}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {registrations.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                            No registrations found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tournaments">
              <div className="flex justify-end mb-4">
                <Button onClick={() => handleOpenTournamentDialog()} className="gap-2">
                  <Plus className="w-4 h-4" /> Add Tournament
                </Button>
              </div>
              {tournaments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                  No tournaments created yet. Click "Add Tournament" to start.
                </div>
              ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map((tournament) => (
                  <div key={tournament.id} className="card-premium p-6 relative group">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleOpenTournamentDialog(tournament)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteTournament(tournament.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{tournament.title}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>📅 {tournament.date}</p>
                      <p>📍 {tournament.location}</p>
                      <p>🏆 {tournament.prize}</p>
                      <p>👥 {tournament.currentParticipants}/{tournament.maxParticipants} Participants</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        tournament.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tournament.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </TabsContent>

            <TabsContent value="sales">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card-premium p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <h3 className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</h3>
                  </div>
                </div>
                <div className="card-premium p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Transactions</p>
                    <h3 className="text-2xl font-bold">{transactions.length}</h3>
                  </div>
                </div>
              </div>

              <div className="card-premium overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground uppercase text-xs">
                      <tr>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Plan</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Payment ID</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4">
                            {tx.date?.toDate ? tx.date.toDate().toLocaleDateString() : new Date(tx.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium">{tx.userName}</div>
                            <div className="text-xs text-muted-foreground">{tx.userEmail}</div>
                          </td>
                          <td className="px-6 py-4 capitalize">{tx.plan}</td>
                          <td className="px-6 py-4 font-bold">₹{tx.amount}</td>
                          <td className="px-6 py-4 font-mono text-xs">{tx.razorpayPaymentId}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 capitalize">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gallery">
              <div className="flex justify-end mb-4">
                <Button onClick={() => handleOpenGalleryDialog()} className="gap-2">
                  <Plus className="w-4 h-4" /> Add Image
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryItems.map((item) => (
                  <div key={item.id} className="card-premium overflow-hidden group relative">
                    <div className="aspect-square">
                      <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleOpenGalleryDialog(item)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteGalleryItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="p-3">
                      <h4 className="font-bold text-sm truncate">{item.title}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground capitalize">{item.category}</span>
                        <span className="text-xs text-muted-foreground">{item.likes} ❤️</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {galleryItems.length === 0 && (
                <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">No images in gallery.</div>
              )}
            </TabsContent>

            <TabsContent value="users">
              <div className="card-premium overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground uppercase text-xs">
                      <tr>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Membership</th>
                        <th className="px-6 py-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4">
                            <div className="font-medium">{user.displayName}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 capitalize">{user.role}</td>
                          <td className="px-6 py-4">
                            {user.membership?.plan ? (
                              <span className="capitalize px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs">
                                {user.membership.plan}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      <Dialog open={isTournamentDialogOpen} onOpenChange={setIsTournamentDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formData.id ? "Edit Tournament" : "Add Tournament"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={formData.title || ""} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input 
                  value={formData.date || ""} 
                  onChange={(e) => setFormData({...formData, date: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.status || "Open"}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Open">Open</option>
                  <option value="Coming Soon">Coming Soon</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input 
                value={formData.location || ""} 
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prize</Label>
                <Input 
                  value={formData.prize || ""} 
                  onChange={(e) => setFormData({...formData, prize: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Max Participants</Label>
                <Input 
                  type="number"
                  value={formData.maxParticipants || 0} 
                  onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description || ""} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input 
                value={formData.image || ""} 
                onChange={(e) => setFormData({...formData, image: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Rules (One per line)</Label>
              <Textarea 
                value={formData.rules?.join('\n') || ""} 
                onChange={(e) => setFormData({...formData, rules: e.target.value.split('\n')})}
                placeholder="Rule 1&#10;Rule 2&#10;Rule 3"
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label>Schedule</Label>
              <div className="space-y-2">
                {formData.schedule?.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Time"
                      className="w-1/3"
                      value={item.time}
                      onChange={(e) => {
                        const newSchedule = [...(formData.schedule || [])];
                        newSchedule[index].time = e.target.value;
                        setFormData({...formData, schedule: newSchedule});
                      }}
                    />
                    <Input
                      placeholder="Activity"
                      className="flex-1"
                      value={item.activity}
                      onChange={(e) => {
                        const newSchedule = [...(formData.schedule || [])];
                        newSchedule[index].activity = e.target.value;
                        setFormData({...formData, schedule: newSchedule});
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newSchedule = formData.schedule?.filter((_, i) => i !== index);
                        setFormData({...formData, schedule: newSchedule});
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({
                    ...formData,
                    schedule: [...(formData.schedule || []), { time: "", activity: "" }]
                  })}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Schedule Item
                </Button>
              </div>
            </div>
            <Button onClick={handleSaveTournament} className="w-full">
              {formData.id ? "Update Tournament" : "Create Tournament"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gallery Dialog */}
      <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{galleryFormData.id ? "Edit Image" : "Add Image"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={galleryFormData.title || ""} 
                onChange={(e) => setGalleryFormData({...galleryFormData, title: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input 
                value={galleryFormData.src || ""} 
                onChange={(e) => setGalleryFormData({...galleryFormData, src: e.target.value})} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={galleryFormData.category || "catches"}
                  onChange={(e) => setGalleryFormData({...galleryFormData, category: e.target.value as any})}
                >
                  <option value="catches">Catches</option>
                  <option value="events">Events</option>
                  <option value="members">Members</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Likes</Label>
                <Input 
                  type="number"
                  value={galleryFormData.likes || 0} 
                  onChange={(e) => setGalleryFormData({...galleryFormData, likes: parseInt(e.target.value)})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Author</Label>
              <Input 
                value={galleryFormData.author || ""} 
                onChange={(e) => setGalleryFormData({...galleryFormData, author: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={galleryFormData.description || ""} 
                onChange={(e) => setGalleryFormData({...galleryFormData, description: e.target.value})} 
              />
            </div>
            <Button onClick={handleSaveGalleryItem} className="w-full">
              {galleryFormData.id ? "Update Image" : "Add to Gallery"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
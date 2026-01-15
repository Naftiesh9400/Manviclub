import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getFirestore, collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { Loader2, Shield, Check, X } from "lucide-react";

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

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(true);

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
    </div>
  );
};

export default AdminDashboard;
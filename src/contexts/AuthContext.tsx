import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getFirestore, doc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";

export type MembershipPlan = "basic" | "premium" | "elite" | null;

interface MembershipData {
  plan: MembershipPlan;
  purchasedAt: Date | null;
  expiresAt: Date | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  membership: MembershipData;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  setMembershipPlan: (plan: MembershipPlan) => Promise<void>;
  cancelMembership: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [membership, setMembership] = useState<MembershipData>({
    plan: null,
    purchasedAt: null,
    expiresAt: null
  });

  const db = getFirestore();

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // Cleanup previous snapshot listener if exists
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (currentUser) {
        // Check if admin
        setIsAdmin(currentUser.email === (import.meta.env.VITE_ADMIN_EMAIL || "manviclub@gmail.com"));

        // Realtime listener for user data
        unsubscribeSnapshot = onSnapshot(doc(db, "users", currentUser.uid), async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (data.membership) {
              const expiresAt = data.membership.expiresAt?.toDate ? data.membership.expiresAt.toDate() : new Date(data.membership.expiresAt);
              
              // Check if membership has expired
              if (expiresAt && expiresAt < new Date()) {
                try {
                  await updateDoc(doc(db, "users", currentUser.uid), {
                    membership: null,
                    lastExpiredMembership: {
                      ...data.membership,
                      expiredAt: new Date()
                    }
                  });
                  // The snapshot will fire again with updated data (membership: null), updating the state automatically
                } catch (error) {
                  console.error("Error expiring membership:", error);
                }
              } else {
                setMembership({
                  plan: data.membership.plan,
                  purchasedAt: data.membership.purchasedAt?.toDate ? data.membership.purchasedAt.toDate() : new Date(data.membership.purchasedAt),
                  expiresAt: expiresAt
                });
              }
            } else {
              setMembership({ plan: null, purchasedAt: null, expiresAt: null });
            }
          } else {
            // Self-healing: Create user doc if it doesn't exist (fixes "users not showing")
            await setDoc(doc(db, "users", currentUser.uid), {
              email: currentUser.email,
              displayName: currentUser.displayName || "User",
              role: currentUser.email === (import.meta.env.VITE_ADMIN_EMAIL || "manviclub@gmail.com") ? "admin" : "user",
              createdAt: new Date(),
              provider: currentUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email'
            });
          }
          setLoading(false);
        });
      } else {
        setIsAdmin(false);
        setMembership({ plan: null, purchasedAt: null, expiresAt: null });
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, displayName: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });
    // Create user document
    await setDoc(doc(db, "users", user.uid), {
      email,
      displayName,
      role: email === (import.meta.env.VITE_ADMIN_EMAIL || "manviclub@gmail.com") ? "admin" : "user",
      createdAt: new Date(),
      provider: "email"
    });
  };

  const logout = async () => {
    await signOut(auth);
    setMembership({ plan: null, purchasedAt: null, expiresAt: null });
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.displayName,
        role: "user",
        createdAt: new Date(),
        provider: "google"
      });
    }
  };

  const setMembershipPlan = async (plan: MembershipPlan) => {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    
    const membershipData: MembershipData = {
      plan,
      purchasedAt: now,
      expiresAt
    };
    
    if (user) {
      await setDoc(doc(db, "users", user.uid), {
        membership: membershipData
      }, { merge: true });
      setMembership(membershipData);
    }
  };

  const cancelMembership = async () => {
    if (user && membership.plan) {
      await updateDoc(doc(db, "users", user.uid), {
        membership: null,
        lastExpiredMembership: {
          plan: membership.plan,
          purchasedAt: membership.purchasedAt,
          expiresAt: membership.expiresAt,
          cancelledAt: new Date()
        }
      });
      setMembership({ plan: null, purchasedAt: null, expiresAt: null });
    }
  };

  const value = {
    user,
    loading,
    membership,
    isAdmin,
    login,
    signup,
    logout,
    loginWithGoogle,
    setMembershipPlan,
    cancelMembership
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

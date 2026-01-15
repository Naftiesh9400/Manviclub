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
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Check if admin
        setIsAdmin(user.email === (import.meta.env.VITE_ADMIN_EMAIL || "manviclub@gmail.com"));

        // Load user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.membership) {
              setMembership({
                plan: data.membership.plan,
                purchasedAt: data.membership.purchasedAt?.toDate ? data.membership.purchasedAt.toDate() : new Date(data.membership.purchasedAt),
                expiresAt: data.membership.expiresAt?.toDate ? data.membership.expiresAt.toDate() : new Date(data.membership.expiresAt)
              });
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setIsAdmin(false);
        setMembership({ plan: null, purchasedAt: null, expiresAt: null });
      }
      setLoading(false);
    });

    return unsubscribe;
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
      createdAt: new Date()
    });
  };

  const logout = async () => {
    await signOut(auth);
    setMembership({ plan: null, purchasedAt: null, expiresAt: null });
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
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
      await updateDoc(doc(db, "users", user.uid), {
        membership: membershipData
      });
      setMembership(membershipData);
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
    setMembershipPlan
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

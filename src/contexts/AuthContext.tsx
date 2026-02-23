import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getFirestore, doc, setDoc, getDoc, updateDoc, onSnapshot, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";

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
  isSuperAdmin: boolean;
  sidebarPermissions: string[];
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<UserCredential>;
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
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [sidebarPermissions, setSidebarPermissions] = useState<string[]>([]);
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
        // Check if manviclub@gmail.com is Super Admin
        const superAdmins = ["manviclub@gmail.com", "manvifishclub@gmail.com"];
        const isSA = superAdmins.includes(currentUser.email || "");
        setIsSuperAdmin(isSA);
        setIsAdmin(isSA); // Super Admin is also an Admin

        // Realtime listener for user data
        unsubscribeSnapshot = onSnapshot(doc(db, "users", currentUser.uid), async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();

            // Set sidebar permissions
            setSidebarPermissions(data.sidebarPermissions || []);

            // Allow role-based admin check as well
            if (data.role === 'admin' || isSA) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }

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
        setIsSuperAdmin(false);
        setSidebarPermissions([]);
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

    // Check if a user record was already created by an admin
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    let existingData = {};
    let existingDocId = null;

    if (!querySnapshot.empty) {
      existingData = querySnapshot.docs[0].data();
      existingDocId = querySnapshot.docs[0].id;
    }

    // Create/Update user document with UID
    await setDoc(doc(db, "users", user.uid), {
      email,
      displayName,
      role: email === (import.meta.env.VITE_ADMIN_EMAIL || "manviclub@gmail.com") ? "admin" : "user",
      createdAt: new Date(),
      provider: "email",
      ...existingData, // Merge existing data (role, permissions, etc.)
      uid: user.uid // Ensure UID is stored
    });

    // If we merged data from an existing doc, delete the temporary doc
    if (existingDocId && existingDocId !== user.uid) {
      await deleteDoc(doc(db, "users", existingDocId));
    }
  };

  const logout = async () => {
    await signOut(auth);
    setMembership({ plan: null, purchasedAt: null, expiresAt: null });
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

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

      return result; // Return the result so we can access user data
    } catch (error: any) {
      console.error("loginWithGoogle error:", error);
      throw error; // Re-throw to be caught by the calling function
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

  const value = {
    user,
    loading,
    membership,
    isAdmin,
    isSuperAdmin,
    sidebarPermissions,
    login,
    signup,
    logout,
    resetPassword,
    loginWithGoogle,
    setMembershipPlan,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

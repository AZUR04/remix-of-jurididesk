import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { FirestoreUser, FirestoreCabinet, UserRole, SubscriptionPlan } from "@/types/subscription";

interface AuthContextType {
  user: User | null;
  userData: FirestoreUser | null;
  cabinetData: FirestoreCabinet | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  // Auth methods
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, displayName: string, cabinetName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  // Data refresh
  refreshUserData: () => Promise<void>;
  refreshCabinetData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const [cabinetData, setCabinetData] = useState<FirestoreCabinet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = userData?.role === "ADMIN";

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string): Promise<FirestoreUser | null> => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data() as FirestoreUser;
      }
      return null;
    } catch (err) {
      console.error("Error fetching user data:", err);
      return null;
    }
  };

  // Fetch cabinet data from Firestore
  const fetchCabinetData = async (cabinetId: string): Promise<FirestoreCabinet | null> => {
    try {
      const cabinetDoc = await getDoc(doc(db, "cabinets", cabinetId));
      if (cabinetDoc.exists()) {
        return { id: cabinetDoc.id, ...cabinetDoc.data() } as FirestoreCabinet;
      }
      return null;
    } catch (err) {
      console.error("Error fetching cabinet data:", err);
      return null;
    }
  };

  // Refresh user data
  const refreshUserData = async () => {
    if (user) {
      const data = await fetchUserData(user.uid);
      setUserData(data);
    }
  };

  // Refresh cabinet data
  const refreshCabinetData = async () => {
    if (userData?.cabinetId) {
      const data = await fetchCabinetData(userData.cabinetId);
      setCabinetData(data);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user and cabinet data
        const fetchedUserData = await fetchUserData(firebaseUser.uid);
        setUserData(fetchedUserData);
        
        if (fetchedUserData?.cabinetId) {
          const fetchedCabinetData = await fetchCabinetData(fetchedUserData.cabinetId);
          setCabinetData(fetchedCabinetData);
        }
      } else {
        setUserData(null);
        setCabinetData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user data after login
      const fetchedUserData = await fetchUserData(result.user.uid);
      setUserData(fetchedUserData);
      
      if (fetchedUserData?.cabinetId) {
        const fetchedCabinetData = await fetchCabinetData(fetchedUserData.cabinetId);
        setCabinetData(fetchedCabinetData);
      }
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = getFirebaseErrorMessage(err.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Register - Creates user, cabinet, and user document
  const register = async (
    email: string, 
    password: string, 
    displayName: string,
    cabinetName: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      
      // Create Firebase Auth user
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(result.user, { displayName });
      
      const cabinetId = `cabinet_${result.user.uid}`;
      const now = new Date().toISOString();
      
      // Create cabinet document
      const cabinetData: Omit<FirestoreCabinet, 'id'> = {
        name: cabinetName,
        plan: "FREE" as SubscriptionPlan,
        adminUid: result.user.uid,
        users: [result.user.uid],
        dossierCount: 0,
        documentCount: 0,
        extraDossiers: 0,
        subscriptionStartDate: now,
        createdAt: now,
        updatedAt: now,
      };
      
      await setDoc(doc(db, "cabinets", cabinetId), cabinetData);
      
      // Create user document
      const newUserData: FirestoreUser = {
        uid: result.user.uid,
        email,
        displayName,
        role: "ADMIN" as UserRole,
        cabinetId,
        createdAt: now,
        updatedAt: now,
      };
      
      await setDoc(doc(db, "users", result.user.uid), newUserData);
      
      setUserData(newUserData);
      setCabinetData({ id: cabinetId, ...cabinetData });
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = getFirebaseErrorMessage(err.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      setCabinetData(null);
    } catch (err: any) {
      console.error("Logout error:", err);
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err: any) {
      const errorMessage = getFirebaseErrorMessage(err.code);
      return { success: false, error: errorMessage };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        cabinetData,
        loading,
        error,
        isAdmin,
        login,
        register,
        logout,
        resetPassword,
        refreshUserData,
        refreshCabinetData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper function to translate Firebase error codes
function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "Cette adresse email est déjà utilisée.";
    case "auth/invalid-email":
      return "Adresse email invalide.";
    case "auth/operation-not-allowed":
      return "Opération non autorisée.";
    case "auth/weak-password":
      return "Le mot de passe est trop faible. Minimum 6 caractères.";
    case "auth/user-disabled":
      return "Ce compte a été désactivé.";
    case "auth/user-not-found":
      return "Aucun compte trouvé avec cette adresse email.";
    case "auth/wrong-password":
      return "Mot de passe incorrect.";
    case "auth/invalid-credential":
      return "Email ou mot de passe incorrect.";
    case "auth/too-many-requests":
      return "Trop de tentatives. Veuillez réessayer plus tard.";
    default:
      return "Une erreur est survenue. Veuillez réessayer.";
  }
}

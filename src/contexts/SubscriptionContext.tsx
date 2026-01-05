import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from "react";
import { doc, updateDoc, increment, collection, addDoc, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { 
  SubscriptionPlan, 
  PlanLimits, 
  PLANS, 
  PaymentHistoryItem 
} from "@/types/subscription";

interface SubscriptionContextType {
  // Plan info
  plan: SubscriptionPlan;
  planConfig: typeof PLANS[SubscriptionPlan];
  limits: PlanLimits;
  
  // Usage
  currentUsage: {
    dossiers: number;
    documents: number;
    users: number;
  };
  extraDossiers: number;
  
  // Remaining
  remainingDossiers: number;
  remainingDocuments: number;
  remainingUsers: number;
  
  // Limit checks
  isDossierLimitReached: boolean;
  isDocumentLimitReached: boolean;
  isUserLimitReached: boolean;
  
  // Access checks
  canCreateDossier: () => boolean;
  canUploadDocument: () => boolean;
  canAddUser: () => boolean;
  canAccessChat: () => boolean;
  canAccessTasks: () => boolean;
  canAccessReporting: () => boolean;
  canAccessAdvancedReporting: () => boolean;
  canExportWithoutWatermark: () => boolean;
  
  // Payment history
  paymentHistory: PaymentHistoryItem[];
  loadingPayments: boolean;
  
  // Actions
  upgradePlan: (newPlan: SubscriptionPlan) => Promise<boolean>;
  purchaseExtraDossier: () => Promise<boolean>;
  recordPayment: (payment: Omit<PaymentHistoryItem, "id" | "cabinetId">) => Promise<void>;
  
  // Usage updaters
  addDossier: () => void;
  addDocument: () => void;
  
  // Refresh
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const cabinetData = auth?.cabinetData;
  const refreshCabinetData = auth?.refreshCabinetData;
  
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  
  // Fetch payment history from Firestore
  useEffect(() => {
    async function fetchPaymentHistory() {
      if (!cabinetData?.id) return;
      
      setLoadingPayments(true);
      try {
        const paymentsQuery = query(
          collection(db, "payments"),
          where("cabinetId", "==", cabinetData.id),
          orderBy("date", "desc")
        );
        
        const snapshot = await getDocs(paymentsQuery);
        const payments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PaymentHistoryItem[];
        
        setPaymentHistory(payments);
      } catch (err) {
        console.error("Error fetching payment history:", err);
      } finally {
        setLoadingPayments(false);
      }
    }
    
    fetchPaymentHistory();
  }, [cabinetData?.id]);
  
  // Get plan from cabinet data or default to FREE
  const plan: SubscriptionPlan = cabinetData?.plan || "FREE";
  const planConfig = PLANS[plan];
  const limits = planConfig.limits;
  
  // Current usage from cabinet data
  const currentUsage = useMemo(() => ({
    dossiers: cabinetData?.dossierCount || 0,
    documents: cabinetData?.documentCount || 0,
    users: cabinetData?.users?.length || 1,
  }), [cabinetData]);
  
  const extraDossiers = cabinetData?.extraDossiers || 0;
  
  // Calculate effective dossier limit (base + extra)
  const effectiveDossierLimit = useMemo(() => {
    if (limits.maxDossiers === Infinity) return Infinity;
    return limits.maxDossiers + extraDossiers;
  }, [limits.maxDossiers, extraDossiers]);
  
  // Remaining calculations
  const remainingDossiers = useMemo(() => {
    if (effectiveDossierLimit === Infinity) return Infinity;
    return Math.max(0, effectiveDossierLimit - currentUsage.dossiers);
  }, [effectiveDossierLimit, currentUsage.dossiers]);
  
  const remainingDocuments = useMemo(() => {
    if (limits.maxDocuments === Infinity) return Infinity;
    return Math.max(0, limits.maxDocuments - currentUsage.documents);
  }, [limits.maxDocuments, currentUsage.documents]);
  
  const remainingUsers = useMemo(() => {
    if (limits.maxUsers === Infinity) return Infinity;
    return Math.max(0, limits.maxUsers - currentUsage.users);
  }, [limits.maxUsers, currentUsage.users]);
  
  // Limit reached checks
  const isDossierLimitReached = useMemo(() => {
    if (effectiveDossierLimit === Infinity) return false;
    return currentUsage.dossiers >= effectiveDossierLimit;
  }, [currentUsage.dossiers, effectiveDossierLimit]);
  
  const isDocumentLimitReached = useMemo(() => {
    if (limits.maxDocuments === Infinity) return false;
    return currentUsage.documents >= limits.maxDocuments;
  }, [currentUsage.documents, limits.maxDocuments]);
  
  const isUserLimitReached = useMemo(() => {
    if (limits.maxUsers === Infinity) return false;
    return currentUsage.users >= limits.maxUsers;
  }, [currentUsage.users, limits.maxUsers]);
  
  // Access check functions
  const canCreateDossier = useCallback(() => {
    return !isDossierLimitReached;
  }, [isDossierLimitReached]);
  
  const canUploadDocument = useCallback(() => {
    return !isDocumentLimitReached;
  }, [isDocumentLimitReached]);
  
  const canAddUser = useCallback(() => {
    return !isUserLimitReached;
  }, [isUserLimitReached]);
  
  const canAccessChat = useCallback(() => limits.hasChat, [limits.hasChat]);
  const canAccessTasks = useCallback(() => limits.hasTasks, [limits.hasTasks]);
  const canAccessReporting = useCallback(() => limits.hasReporting, [limits.hasReporting]);
  const canAccessAdvancedReporting = useCallback(() => limits.hasAdvancedReporting, [limits.hasAdvancedReporting]);
  const canExportWithoutWatermark = useCallback(() => !limits.hasWatermark, [limits.hasWatermark]);
  
  // Record a payment to Firestore
  const recordPayment = useCallback(async (payment: Omit<PaymentHistoryItem, "id" | "cabinetId">) => {
    if (!cabinetData?.id) return;
    
    const paymentData = {
      ...payment,
      cabinetId: cabinetData.id,
    };
    
    try {
      const docRef = await addDoc(collection(db, "payments"), paymentData);
      setPaymentHistory(prev => [{ ...paymentData, id: docRef.id }, ...prev]);
    } catch (err) {
      console.error("Error saving payment:", err);
    }
  }, [cabinetData?.id]);
  
  // Upgrade plan
  const upgradePlan = useCallback(async (newPlan: SubscriptionPlan): Promise<boolean> => {
    if (!cabinetData?.id) return false;
    
    try {
      const cabinetRef = doc(db, "cabinets", cabinetData.id);
      await updateDoc(cabinetRef, {
        plan: newPlan,
        updatedAt: new Date().toISOString(),
      });
      
      if (refreshCabinetData) await refreshCabinetData();
      return true;
    } catch (err) {
      console.error("Error upgrading plan:", err);
      return false;
    }
  }, [cabinetData?.id, refreshCabinetData]);
  
  // Purchase extra dossier
  const purchaseExtraDossier = useCallback(async (): Promise<boolean> => {
    if (!cabinetData?.id) return false;
    if (plan === "FREE") return false; // Only PREMIUM+ can buy extra dossiers
    
    try {
      const cabinetRef = doc(db, "cabinets", cabinetData.id);
      await updateDoc(cabinetRef, {
        extraDossiers: increment(1),
        updatedAt: new Date().toISOString(),
      });
      
      if (refreshCabinetData) await refreshCabinetData();
      return true;
    } catch (err) {
      console.error("Error purchasing extra dossier:", err);
      return false;
    }
  }, [cabinetData?.id, plan, refreshCabinetData]);
  
  // Mock usage updaters for demo
  const addDossier = useCallback(async () => {
    if (!cabinetData?.id) return;
    
    try {
      const cabinetRef = doc(db, "cabinets", cabinetData.id);
      await updateDoc(cabinetRef, {
        dossierCount: increment(1),
        updatedAt: new Date().toISOString(),
      });
      
      if (refreshCabinetData) await refreshCabinetData();
    } catch (err) {
      console.error("Error adding dossier:", err);
    }
  }, [cabinetData?.id, refreshCabinetData]);
  
  const addDocument = useCallback(async () => {
    if (!cabinetData?.id) return;
    
    try {
      const cabinetRef = doc(db, "cabinets", cabinetData.id);
      await updateDoc(cabinetRef, {
        documentCount: increment(1),
        updatedAt: new Date().toISOString(),
      });
      
      if (refreshCabinetData) await refreshCabinetData();
    } catch (err) {
      console.error("Error adding document:", err);
    }
  }, [cabinetData?.id, refreshCabinetData]);
  
  // Refresh subscription data
  const refreshSubscription = useCallback(async () => {
    if (refreshCabinetData) await refreshCabinetData();
  }, [refreshCabinetData]);

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        planConfig,
        limits,
        currentUsage,
        extraDossiers,
        remainingDossiers,
        remainingDocuments,
        remainingUsers,
        isDossierLimitReached,
        isDocumentLimitReached,
        isUserLimitReached,
        canCreateDossier,
        canUploadDocument,
        canAddUser,
        canAccessChat,
        canAccessTasks,
        canAccessReporting,
        canAccessAdvancedReporting,
        canExportWithoutWatermark,
        paymentHistory,
        loadingPayments,
        upgradePlan,
        purchaseExtraDossier,
        recordPayment,
        addDossier,
        addDocument,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}

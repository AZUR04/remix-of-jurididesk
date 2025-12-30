import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

export type SubscriptionStatus = "FREE" | "PREMIUM";

export interface SubscriptionLimits {
  maxDossiers: number;
  maxUsers: number;
  maxDocuments: number;
  hasReminders: boolean;
  hasChat: boolean;
  hasTasks: boolean;
  hasReporting: boolean;
}

export interface PaymentHistoryItem {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: "success" | "failed" | "pending";
  reference: string;
}

interface SubscriptionContextType {
  status: SubscriptionStatus;
  limits: SubscriptionLimits;
  currentUsage: {
    dossiers: number;
    users: number;
    documents: number;
  };
  paymentHistory: PaymentHistoryItem[];
  // Feature access
  checkAccess: (feature: keyof Omit<SubscriptionLimits, 'maxDossiers' | 'maxUsers' | 'maxDocuments'>) => boolean;
  // Resource limits - strict checks
  canCreateDossier: () => boolean;
  canUploadDocument: () => boolean;
  // Remaining counts
  remainingDossiers: number;
  remainingDocuments: number;
  // Limit checks
  isDossierLimitReached: boolean;
  isDocumentLimitReached: boolean;
  // Actions
  upgradeToPremium: () => void;
  setStatus: (status: SubscriptionStatus) => void;
  // Mock usage updaters (for demo)
  addDossier: () => void;
  addDocument: () => void;
}

const FREE_LIMITS: SubscriptionLimits = {
  maxDossiers: 1,
  maxUsers: 1,
  maxDocuments: 5,
  hasReminders: false,
  hasChat: false,
  hasTasks: false,
  hasReporting: false,
};

const PREMIUM_LIMITS: SubscriptionLimits = {
  maxDossiers: Infinity,
  maxUsers: Infinity,
  maxDocuments: Infinity,
  hasReminders: true,
  hasChat: true,
  hasTasks: true,
  hasReporting: true,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SubscriptionStatus>("FREE");
  const [currentUsage, setCurrentUsage] = useState({
    dossiers: 1,
    users: 1,
    documents: 3,
  });
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);

  const limits = useMemo(() => 
    status === "PREMIUM" ? PREMIUM_LIMITS : FREE_LIMITS
  , [status]);

  // STRICT limit calculations
  const remainingDossiers = useMemo(() => {
    if (status === "PREMIUM") return Infinity;
    return Math.max(0, limits.maxDossiers - currentUsage.dossiers);
  }, [status, limits.maxDossiers, currentUsage.dossiers]);

  const remainingDocuments = useMemo(() => {
    if (status === "PREMIUM") return Infinity;
    return Math.max(0, limits.maxDocuments - currentUsage.documents);
  }, [status, limits.maxDocuments, currentUsage.documents]);

  const isDossierLimitReached = useMemo(() => {
    if (status === "PREMIUM") return false;
    return currentUsage.dossiers >= limits.maxDossiers;
  }, [status, currentUsage.dossiers, limits.maxDossiers]);

  const isDocumentLimitReached = useMemo(() => {
    if (status === "PREMIUM") return false;
    return currentUsage.documents >= limits.maxDocuments;
  }, [status, currentUsage.documents, limits.maxDocuments]);

  // STRICT access checks - NO bypass allowed
  const canCreateDossier = useCallback(() => {
    if (status === "PREMIUM") return true;
    return currentUsage.dossiers < limits.maxDossiers;
  }, [status, currentUsage.dossiers, limits.maxDossiers]);

  const canUploadDocument = useCallback(() => {
    if (status === "PREMIUM") return true;
    return currentUsage.documents < limits.maxDocuments;
  }, [status, currentUsage.documents, limits.maxDocuments]);

  const checkAccess = useCallback((feature: keyof Omit<SubscriptionLimits, 'maxDossiers' | 'maxUsers' | 'maxDocuments'>) => {
    return limits[feature];
  }, [limits]);

  const upgradeToPremium = useCallback(() => {
    setStatus("PREMIUM");
    setPaymentHistory(prev => [{
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      amount: 35000,
      description: "Abonnement PREMIUM",
      status: "success",
      reference: `YBT-${Date.now()}`,
    }, ...prev]);
  }, []);

  // Mock functions for demo
  const addDossier = useCallback(() => {
    setCurrentUsage(prev => ({ ...prev, dossiers: prev.dossiers + 1 }));
  }, []);

  const addDocument = useCallback(() => {
    setCurrentUsage(prev => ({ ...prev, documents: prev.documents + 1 }));
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        status,
        limits,
        currentUsage,
        paymentHistory,
        checkAccess,
        canCreateDossier,
        canUploadDocument,
        remainingDossiers,
        remainingDocuments,
        isDossierLimitReached,
        isDocumentLimitReached,
        upgradeToPremium,
        setStatus,
        addDossier,
        addDocument,
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

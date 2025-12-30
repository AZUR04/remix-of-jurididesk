import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

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
  checkAccess: (feature: keyof Omit<SubscriptionLimits, 'maxDossiers' | 'maxUsers' | 'maxDocuments'>) => boolean;
  checkLimit: (resource: 'dossiers' | 'users' | 'documents') => boolean;
  upgradeToPremium: () => void;
  setStatus: (status: SubscriptionStatus) => void;
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
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([
    {
      id: "1",
      date: "2025-01-15",
      amount: 35000,
      description: "Abonnement PREMIUM - Janvier 2025",
      status: "success",
      reference: "YBT-2025-001",
    },
  ]);

  // Mock current usage
  const currentUsage = {
    dossiers: 1,
    users: 1,
    documents: 3,
  };

  const limits = status === "PREMIUM" ? PREMIUM_LIMITS : FREE_LIMITS;

  const checkAccess = useCallback((feature: keyof Omit<SubscriptionLimits, 'maxDossiers' | 'maxUsers' | 'maxDocuments'>) => {
    return limits[feature];
  }, [limits]);

  const checkLimit = useCallback((resource: 'dossiers' | 'users' | 'documents') => {
    const maxKey = `max${resource.charAt(0).toUpperCase() + resource.slice(1)}` as keyof SubscriptionLimits;
    const max = limits[maxKey] as number;
    return currentUsage[resource] < max;
  }, [limits, currentUsage]);

  const upgradeToPremium = useCallback(() => {
    setStatus("PREMIUM");
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        status,
        limits,
        currentUsage,
        paymentHistory,
        checkAccess,
        checkLimit,
        upgradeToPremium,
        setStatus,
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

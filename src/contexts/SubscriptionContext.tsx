import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from "react";
import { doc, updateDoc, increment, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { 
  SubscriptionPlan, 
  PlanLimits, 
  PLANS
} from "@/types/subscription";

interface SubscriptionContextType {
  plan: SubscriptionPlan;
  planConfig: typeof PLANS[SubscriptionPlan];
  limits: PlanLimits;
  currentUsage: { dossiers: number; documents: number; users: number };
  extraDossiers: number;
  remainingDossiers: number;
  remainingDocuments: number;
  remainingUsers: number;
  isDossierLimitReached: boolean;
  isDocumentLimitReached: boolean;
  isUserLimitReached: boolean;
  canCreateDossier: () => boolean;
  canUploadDocument: () => boolean;
  canAddUser: () => boolean;
  canAccessChat: () => boolean;
  canAccessTasks: () => boolean;
  canAccessReporting: () => boolean;
  canAccessAdvancedReporting: () => boolean;
  canExportWithoutWatermark: () => boolean;
  upgradePlan: (newPlan: SubscriptionPlan) => Promise<boolean>;
  addDossier: () => void;
  addDocument: () => void;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const cabinetData = auth?.cabinetData;
  const refreshCabinetData = auth?.refreshCabinetData;
  
  const plan: SubscriptionPlan = cabinetData?.plan || "FREE";
  const planConfig = PLANS[plan];
  const limits = planConfig.limits;
  
  const currentUsage = useMemo(() => ({
    dossiers: cabinetData?.dossierCount || 0,
    documents: cabinetData?.documentCount || 0,
    users: cabinetData?.users?.length || 1,
  }), [cabinetData]);
  
  const extraDossiers = cabinetData?.extraDossiers || 0;
  
  const effectiveDossierLimit = useMemo(() => {
    if (limits.maxDossiers === Infinity) return Infinity;
    return limits.maxDossiers + extraDossiers;
  }, [limits.maxDossiers, extraDossiers]);
  
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
  
  const isDossierLimitReached = currentUsage.dossiers >= effectiveDossierLimit && effectiveDossierLimit !== Infinity;
  const isDocumentLimitReached = currentUsage.documents >= limits.maxDocuments && limits.maxDocuments !== Infinity;
  const isUserLimitReached = currentUsage.users >= limits.maxUsers && limits.maxUsers !== Infinity;
  
  const canCreateDossier = useCallback(() => !isDossierLimitReached, [isDossierLimitReached]);
  const canUploadDocument = useCallback(() => !isDocumentLimitReached, [isDocumentLimitReached]);
  const canAddUser = useCallback(() => !isUserLimitReached, [isUserLimitReached]);
  const canAccessChat = useCallback(() => limits.hasChat, [limits.hasChat]);
  const canAccessTasks = useCallback(() => limits.hasTasks, [limits.hasTasks]);
  const canAccessReporting = useCallback(() => limits.hasReporting, [limits.hasReporting]);
  const canAccessAdvancedReporting = useCallback(() => limits.hasAdvancedReporting, [limits.hasAdvancedReporting]);
  const canExportWithoutWatermark = useCallback(() => !limits.hasWatermark, [limits.hasWatermark]);
  
  const upgradePlan = useCallback(async (newPlan: SubscriptionPlan): Promise<boolean> => {
    if (!cabinetData?.id) return false;
    try {
      const cabinetRef = doc(db, "cabinets", cabinetData.id);
      await updateDoc(cabinetRef, { plan: newPlan, updatedAt: new Date().toISOString() });
      if (refreshCabinetData) await refreshCabinetData();
      return true;
    } catch (err) {
      console.error("Error upgrading plan:", err);
      return false;
    }
  }, [cabinetData?.id, refreshCabinetData]);
  
  const addDossier = useCallback(async () => {
    if (!cabinetData?.id) return;
    try {
      await updateDoc(doc(db, "cabinets", cabinetData.id), { dossierCount: increment(1), updatedAt: new Date().toISOString() });
      if (refreshCabinetData) await refreshCabinetData();
    } catch (err) { console.error(err); }
  }, [cabinetData?.id, refreshCabinetData]);
  
  const addDocument = useCallback(async () => {
    if (!cabinetData?.id) return;
    try {
      await updateDoc(doc(db, "cabinets", cabinetData.id), { documentCount: increment(1), updatedAt: new Date().toISOString() });
      if (refreshCabinetData) await refreshCabinetData();
    } catch (err) { console.error(err); }
  }, [cabinetData?.id, refreshCabinetData]);
  
  const refreshSubscription = useCallback(async () => {
    if (refreshCabinetData) await refreshCabinetData();
  }, [refreshCabinetData]);

  return (
    <SubscriptionContext.Provider value={{
      plan, planConfig, limits, currentUsage, extraDossiers,
      remainingDossiers, remainingDocuments, remainingUsers,
      isDossierLimitReached, isDocumentLimitReached, isUserLimitReached,
      canCreateDossier, canUploadDocument, canAddUser,
      canAccessChat, canAccessTasks, canAccessReporting, canAccessAdvancedReporting, canExportWithoutWatermark,
      upgradePlan, addDossier, addDocument, refreshSubscription,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) throw new Error("useSubscription must be used within a SubscriptionProvider");
  return context;
}

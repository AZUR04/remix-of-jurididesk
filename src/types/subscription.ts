// Types d'abonnement JuridiDesk

export type SubscriptionPlan = "FREE" | "PREMIUM" | "TEAM" | "CABINET" | "CABINET_XXL";
export type UserRole = "ADMIN" | "USER";

export interface PlanLimits {
  maxUsers: number;
  maxDossiers: number;
  maxDocuments: number;
  hasChat: boolean;
  hasTasks: boolean;
  hasReporting: boolean;
  hasReminders: boolean;
  hasAdvancedReporting: boolean;
  hasExports: boolean;
  hasWatermark: boolean;
  hasPrioritySupport: boolean;
  hasVIPSupport: boolean;
  hasAPIAccess: boolean;
}

export interface PlanConfig {
  id: SubscriptionPlan;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  limits: PlanLimits;
  extraDossierPrice?: number;
  features: string[];
  popular?: boolean;
}

// Configuration des plans
export const PLANS: Record<SubscriptionPlan, PlanConfig> = {
  FREE: {
    id: "FREE",
    name: "FREE",
    price: 0,
    priceLabel: "0 FC/mois",
    description: "Pour découvrir JuridiDesk",
    limits: {
      maxUsers: 1,
      maxDossiers: 1,
      maxDocuments: 5,
      hasChat: false,
      hasTasks: false,
      hasReporting: false,
      hasReminders: false,
      hasAdvancedReporting: false,
      hasExports: false,
      hasWatermark: true,
      hasPrioritySupport: false,
      hasVIPSupport: false,
      hasAPIAccess: false,
    },
    features: [
      "1 dossier maximum",
      "5 documents maximum",
      "1 utilisateur",
      "Exports avec watermark",
    ],
  },
  PREMIUM: {
    id: "PREMIUM",
    name: "PREMIUM",
    price: 35000,
    priceLabel: "35 000 FC/mois",
    description: "Pour les avocats indépendants",
    limits: {
      maxUsers: 2,
      maxDossiers: 5,
      maxDocuments: Infinity,
      hasChat: true,
      hasTasks: true,
      hasReporting: true,
      hasReminders: true,
      hasAdvancedReporting: false,
      hasExports: true,
      hasWatermark: false,
      hasPrioritySupport: false,
      hasVIPSupport: false,
      hasAPIAccess: false,
    },
    extraDossierPrice: 5000,
    features: [
      "5 dossiers inclus",
      "Documents illimités",
      "2 utilisateurs",
      "Chat & Tâches activés",
      "Reporting complet",
      "Exports sans watermark",
      "Rappels App + WhatsApp",
    ],
    popular: true,
  },
  TEAM: {
    id: "TEAM",
    name: "TEAM",
    price: 100000,
    priceLabel: "100 000 FC/mois",
    description: "Pour les petites équipes",
    limits: {
      maxUsers: 5,
      maxDossiers: Infinity,
      maxDocuments: Infinity,
      hasChat: true,
      hasTasks: true,
      hasReporting: true,
      hasReminders: true,
      hasAdvancedReporting: true,
      hasExports: true,
      hasWatermark: false,
      hasPrioritySupport: true,
      hasVIPSupport: false,
      hasAPIAccess: false,
    },
    features: [
      "Dossiers illimités",
      "Documents illimités",
      "5 utilisateurs",
      "Collaboration complète",
      "Reporting avancé",
      "Gestion utilisateurs",
      "Support standard",
    ],
  },
  CABINET: {
    id: "CABINET",
    name: "CABINET",
    price: 250000,
    priceLabel: "250 000 FC/mois",
    description: "Pour les cabinets professionnels",
    limits: {
      maxUsers: 10,
      maxDossiers: Infinity,
      maxDocuments: Infinity,
      hasChat: true,
      hasTasks: true,
      hasReporting: true,
      hasReminders: true,
      hasAdvancedReporting: true,
      hasExports: true,
      hasWatermark: false,
      hasPrioritySupport: true,
      hasVIPSupport: false,
      hasAPIAccess: true,
    },
    features: [
      "Dossiers illimités",
      "Documents illimités",
      "10 utilisateurs",
      "Accès global aux dossiers",
      "Permissions fines par dossier",
      "Reporting avancé",
      "Exports illimités",
      "Support prioritaire",
    ],
  },
  CABINET_XXL: {
    id: "CABINET_XXL",
    name: "CABINET XXL",
    price: 300000,
    priceLabel: "300 000 FC/mois",
    description: "Pour les grands cabinets",
    limits: {
      maxUsers: Infinity,
      maxDossiers: Infinity,
      maxDocuments: Infinity,
      hasChat: true,
      hasTasks: true,
      hasReporting: true,
      hasReminders: true,
      hasAdvancedReporting: true,
      hasExports: true,
      hasWatermark: false,
      hasPrioritySupport: true,
      hasVIPSupport: true,
      hasAPIAccess: true,
    },
    features: [
      "Dossiers illimités",
      "Documents illimités",
      "Utilisateurs illimités",
      "Tout CABINET inclus",
      "Support VIP dédié",
      "Intégration API externe",
      "Formation personnalisée",
    ],
  },
};

// Firestore document interfaces
export interface FirestoreUser {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  role: UserRole;
  cabinetId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreCabinet {
  id: string;
  name: string;
  plan: SubscriptionPlan;
  adminUid: string;
  users: string[]; // Array of user UIDs
  dossierCount: number;
  documentCount: number;
  extraDossiers: number;
  subscriptionStartDate: string;
  subscriptionEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreDossier {
  id: string;
  cabinetId: string;
  title: string;
  clientName: string;
  authorizedUsers: string[]; // UIDs des utilisateurs autorisés
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreDocument {
  id: string;
  dossierId: string;
  cabinetId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  createdAt: string;
}

export interface PaymentHistoryItem {
  id: string;
  cabinetId: string;
  date: string;
  amount: number;
  description: string;
  status: "success" | "failed" | "pending";
  reference: string;
  method: string;
}

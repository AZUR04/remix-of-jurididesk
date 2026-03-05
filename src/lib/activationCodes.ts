import { collection, doc, query, where, getDocs, addDoc, updateDoc, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SubscriptionPlan } from "@/types/subscription";

export interface ActivationCode {
  id: string;
  code: string;
  planType: SubscriptionPlan;
  durationValue: number;
  durationUnit: "days" | "months";
  createdAt: string;
  used: boolean;
  usedBy?: string;
  usedAt?: string;
}

// Generate a unique 12-char alphanumeric code
function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segments = [];
  for (let s = 0; s < 3; s++) {
    let seg = "";
    for (let i = 0; i < 4; i++) {
      seg += chars[Math.floor(Math.random() * chars.length)];
    }
    segments.push(seg);
  }
  return segments.join("-"); // e.g. ABCD-EF23-GHKL
}

// Admin: generate a new activation code
export async function createActivationCode(
  planType: SubscriptionPlan,
  durationValue: number,
  durationUnit: "days" | "months"
): Promise<ActivationCode> {
  const code = generateCode();
  const now = new Date().toISOString();

  const data = {
    code,
    planType,
    durationValue,
    durationUnit,
    createdAt: now,
    used: false,
  };

  const docRef = await addDoc(collection(db, "activationCodes"), data);
  return { id: docRef.id, ...data };
}

// Fetch all activation codes (admin)
export async function fetchAllActivationCodes(): Promise<ActivationCode[]> {
  const q = query(collection(db, "activationCodes"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ActivationCode));
}

// Redeem a code for a user
export async function redeemActivationCode(
  code: string,
  userId: string,
  cabinetId: string
): Promise<{ success: boolean; error?: string; plan?: SubscriptionPlan; endDate?: string }> {
  // Find code
  const q = query(collection(db, "activationCodes"), where("code", "==", code.trim().toUpperCase()));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return { success: false, error: "Code invalide ou introuvable." };
  }

  const codeDoc = snapshot.docs[0];
  const codeData = codeDoc.data() as Omit<ActivationCode, "id">;

  if (codeData.used) {
    return { success: false, error: "Ce code a déjà été utilisé." };
  }

  // Calculate end date
  const now = new Date();
  const endDate = new Date(now);
  if (codeData.durationUnit === "months") {
    endDate.setMonth(endDate.getMonth() + codeData.durationValue);
  } else {
    endDate.setDate(endDate.getDate() + codeData.durationValue);
  }

  const nowISO = now.toISOString();
  const endISO = endDate.toISOString();

  // Mark code as used
  await updateDoc(doc(db, "activationCodes", codeDoc.id), {
    used: true,
    usedBy: userId,
    usedAt: nowISO,
  });

  // Update cabinet plan
  await updateDoc(doc(db, "cabinets", cabinetId), {
    plan: codeData.planType,
    subscriptionStartDate: nowISO,
    subscriptionEndDate: endISO,
    updatedAt: nowISO,
  });

  return { success: true, plan: codeData.planType, endDate: endISO };
}

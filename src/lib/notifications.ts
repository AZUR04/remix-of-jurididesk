import { collection, doc, query, where, getDocs, addDoc, updateDoc, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type NotificationType = "message" | "code_sent" | "plan_activated" | "admin_reply";

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  createdAt: string;
  read: boolean;
}

export async function createNotification(
  userId: string,
  type: NotificationType,
  message: string
): Promise<void> {
  await addDoc(collection(db, "notifications"), {
    userId,
    type,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  });
}

export async function fetchNotifications(userId: string): Promise<AppNotification[]> {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as AppNotification));
}

export async function markNotificationRead(notifId: string): Promise<void> {
  await updateDoc(doc(db, "notifications", notifId), { read: true });
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const notifs = await fetchNotifications(userId);
  for (const n of notifs) {
    if (!n.read) {
      await updateDoc(doc(db, "notifications", n.id), { read: true });
    }
  }
}

export async function countUnreadNotifications(userId: string): Promise<number> {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    where("read", "==", false)
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
}

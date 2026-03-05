import { collection, doc, query, where, getDocs, addDoc, updateDoc, orderBy, onSnapshot, or, Unsubscribe } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface InternalMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// Send a message
export async function sendMessage(
  senderId: string,
  senderName: string,
  receiverId: string,
  message: string
): Promise<InternalMessage> {
  const data = {
    senderId,
    senderName,
    receiverId,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };

  const docRef = await addDoc(collection(db, "internal_messages"), data);
  return { id: docRef.id, ...data };
}

// Fetch conversation between two users
export async function fetchConversation(
  userId1: string,
  userId2: string
): Promise<InternalMessage[]> {
  // Get all messages where either user is sender/receiver with the other
  const q = query(
    collection(db, "internal_messages"),
    orderBy("createdAt", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() } as InternalMessage))
    .filter(
      (m) =>
        (m.senderId === userId1 && m.receiverId === userId2) ||
        (m.senderId === userId2 && m.receiverId === userId1)
    );
}

// Fetch all conversations for admin (unique senders)
export async function fetchAdminConversations(adminId: string): Promise<{ userId: string; userName: string; lastMessage: string; unreadCount: number; lastDate: string }[]> {
  const q = query(collection(db, "internal_messages"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  const messages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as InternalMessage));

  // Filter messages involving admin
  const relevant = messages.filter((m) => m.senderId === adminId || m.receiverId === adminId);

  // Group by other user
  const convMap = new Map<string, { userId: string; userName: string; lastMessage: string; unreadCount: number; lastDate: string }>();

  for (const msg of relevant) {
    const otherUserId = msg.senderId === adminId ? msg.receiverId : msg.senderId;
    const otherName = msg.senderId === adminId ? "Utilisateur" : msg.senderName;

    if (!convMap.has(otherUserId)) {
      convMap.set(otherUserId, {
        userId: otherUserId,
        userName: otherName,
        lastMessage: msg.message,
        unreadCount: 0,
        lastDate: msg.createdAt,
      });
    }

    const conv = convMap.get(otherUserId)!;
    if (!msg.read && msg.receiverId === adminId) {
      conv.unreadCount++;
    }
    // Update name if we got it from the sender
    if (msg.senderId !== adminId && msg.senderName) {
      conv.userName = msg.senderName;
    }
  }

  return Array.from(convMap.values()).sort((a, b) => b.lastDate.localeCompare(a.lastDate));
}

// Mark messages as read
export async function markMessagesAsRead(messageIds: string[]): Promise<void> {
  for (const id of messageIds) {
    await updateDoc(doc(db, "internal_messages", id), { read: true });
  }
}

// Count unread messages for a user
export async function countUnreadMessages(userId: string): Promise<number> {
  const q = query(
    collection(db, "internal_messages"),
    where("receiverId", "==", userId),
    where("read", "==", false)
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
}

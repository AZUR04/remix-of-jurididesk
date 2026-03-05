import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { sendMessage, fetchConversation, InternalMessage, countUnreadMessages } from "@/lib/messaging";
import { createNotification } from "@/lib/notifications";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Send, MessageSquare, Loader2 } from "lucide-react";

// Simple page for non-admin users to message their cabinet admin
export default function MessagesAdmin() {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [adminUid, setAdminUid] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!user || !userData?.cabinetId) return;
      try {
        const cabinetDoc = await getDoc(doc(db, "cabinets", userData.cabinetId));
        const aUid = cabinetDoc.data()?.adminUid;
        setAdminUid(aUid || null);

        if (aUid) {
          const msgs = await fetchConversation(user.uid, aUid);
          setMessages(msgs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, userData]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !adminUid) return;
    setSending(true);
    try {
      const msg = await sendMessage(user.uid, userData?.displayName || user.email || "Utilisateur", adminUid, newMessage.trim());
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
      await createNotification(adminUid, "message", `Nouveau message de ${userData?.displayName || "un utilisateur"}`);
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible d'envoyer.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <AppLayout title="Messages Admin" subtitle="Contactez l'administrateur de votre cabinet">
      <Card className="h-[calc(100vh-14rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Envoyez un message à l'administrateur</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.senderId === user?.uid ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2.5",
                    msg.senderId === user?.uid
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  )}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={cn(
                      "text-xs mt-1",
                      msg.senderId === user?.uid ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-border flex gap-2">
            <Input
              placeholder="Écrire un message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button variant="gold" size="icon" onClick={handleSend} disabled={sending}>
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}

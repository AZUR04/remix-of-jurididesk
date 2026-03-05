import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { sendMessage } from "@/lib/messaging";
import { createNotification } from "@/lib/notifications";
import { MessageSquare, Send, Loader2, CheckCircle2 } from "lucide-react";
import { SubscriptionPlan } from "@/types/subscription";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ContactAdminButtonProps {
  planName: string;
  planId: SubscriptionPlan;
  className?: string;
}

export function ContactAdminButton({ planName, planId, className }: ContactAdminButtonProps) {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(`Bonjour, je souhaite activer le plan ${planName}. Merci de me fournir un code d'activation.`);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || !user || !userData?.cabinetId) return;

    setSending(true);
    try {
      // Find admin of the cabinet
      const cabinetDoc = await getDoc(doc(db, "cabinets", userData.cabinetId));
      const adminUid = cabinetDoc.data()?.adminUid;

      if (!adminUid) {
        toast({ title: "Erreur", description: "Admin introuvable.", variant: "destructive" });
        return;
      }

      await sendMessage(user.uid, userData.displayName || user.email || "Utilisateur", adminUid, message.trim());
      await createNotification(adminUid, "message", `${userData.displayName || "Un utilisateur"} demande l'activation du plan ${planName}`);

      setSent(true);
      toast({ title: "Message envoyé", description: "L'administrateur a été notifié." });
      setTimeout(() => {
        setOpen(false);
        setSent(false);
      }, 2000);
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible d'envoyer le message.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={`w-full gap-2 ${className || ""}`}
        onClick={() => setOpen(true)}
      >
        <MessageSquare className="w-4 h-4" />
        Contacter l'admin
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Contacter l'administrateur</DialogTitle>
            <DialogDescription>
              Demandez l'activation du plan {planName}
            </DialogDescription>
          </DialogHeader>

          {sent ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto text-success mb-4" />
              <p className="font-medium">Message envoyé !</p>
              <p className="text-sm text-muted-foreground">L'administrateur vous répondra bientôt.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)} className="flex-1">
                  Annuler
                </Button>
                <Button variant="gold" onClick={handleSend} disabled={sending || !message.trim()} className="flex-1 gap-2">
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Envoyer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

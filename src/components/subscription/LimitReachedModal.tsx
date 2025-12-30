import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Lock, Sparkles } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface LimitReachedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: "dossiers" | "documents";
}

const resourceConfig = {
  dossiers: {
    singular: "dossier",
    plural: "dossiers",
    limit: 1,
    message: "Vous avez atteint la limite de 1 dossier pour le plan FREE.",
    benefit: "dossiers illimités",
  },
  documents: {
    singular: "document",
    plural: "documents", 
    limit: 5,
    message: "Vous avez atteint la limite de 5 documents pour le plan FREE.",
    benefit: "documents illimités",
  },
};

export function LimitReachedModal({ open, onOpenChange, resource }: LimitReachedModalProps) {
  const navigate = useNavigate();
  const { status } = useSubscription();
  const config = resourceConfig[resource];

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate("/abonnement");
  };

  // Ne pas afficher pour les utilisateurs PREMIUM
  if (status === "PREMIUM") return null;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-destructive" />
          </div>
          <DialogTitle className="font-display text-2xl">
            Limite atteinte
          </DialogTitle>
          <DialogDescription className="text-base font-medium text-foreground">
            {config.message}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 my-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Passez à PREMIUM</p>
              <p className="text-sm text-muted-foreground">Débloquez toutes les fonctionnalités</p>
            </div>
          </div>
          
          <ul className="space-y-2 text-sm mb-4">
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
              <span>Dossiers illimités</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
              <span>Documents illimités</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
              <span>Rappels automatiques (App + WhatsApp)</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
              <span>Chat interne & Gestion des tâches</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
              <span>Reporting complet</span>
            </li>
          </ul>

          <div className="text-center pt-3 border-t border-accent/20">
            <p className="text-3xl font-bold font-display text-foreground">
              35 000 FC<span className="text-base font-normal text-muted-foreground">/mois</span>
            </p>
          </div>
        </div>

        {/* Un seul bouton - pas d'annulation */}
        <Button variant="gold" size="lg" onClick={handleUpgrade} className="w-full gap-2">
          <Crown className="w-5 h-5" />
          Passer à PREMIUM
        </Button>
      </DialogContent>
    </Dialog>
  );
}

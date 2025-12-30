import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Crown, Plus } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface LimitReachedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: "dossiers" | "users" | "documents";
}

const resourceLabels = {
  dossiers: { singular: "dossier", plural: "dossiers" },
  users: { singular: "utilisateur", plural: "utilisateurs" },
  documents: { singular: "document", plural: "documents" },
};

export function LimitReachedModal({ open, onOpenChange, resource }: LimitReachedModalProps) {
  const navigate = useNavigate();
  const { status, limits } = useSubscription();

  const label = resourceLabels[resource];
  const maxKey = `max${resource.charAt(0).toUpperCase() + resource.slice(1)}` as keyof typeof limits;
  const maxValue = limits[maxKey] as number;

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate("/abonnement");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-warning" />
          </div>
          <DialogTitle className="font-display text-2xl">
            Limite atteinte
          </DialogTitle>
          <DialogDescription className="text-base">
            Vous avez atteint la limite de {maxValue} {maxValue === 1 ? label.singular : label.plural} pour votre abonnement {status}.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-xl p-4 my-4 text-center">
          {status === "FREE" ? (
            <>
              <p className="text-sm text-muted-foreground mb-2">
                Passez à PREMIUM pour des {label.plural} illimités
              </p>
              <p className="text-2xl font-bold font-display text-foreground">
                35 000 FC<span className="text-sm font-normal text-muted-foreground">/mois</span>
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-2">
                Ajoutez un {label.singular} supplémentaire
              </p>
              <p className="text-2xl font-bold font-display text-foreground">
                5 000 FC<span className="text-sm font-normal text-muted-foreground">/unité</span>
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {status === "FREE" ? (
            <Button variant="gold" size="lg" onClick={handleUpgrade} className="gap-2">
              <Crown className="w-5 h-5" />
              Passer à PREMIUM
            </Button>
          ) : (
            <Button variant="gold" size="lg" onClick={handleUpgrade} className="gap-2">
              <Plus className="w-5 h-5" />
              Ajouter un {label.singular}
            </Button>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

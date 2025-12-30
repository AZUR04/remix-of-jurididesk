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

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: string;
  description?: string;
}

export function UpgradeModal({ open, onOpenChange, feature, description }: UpgradeModalProps) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate("/abonnement");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          <DialogTitle className="font-display text-2xl">
            Fonctionnalité PREMIUM
          </DialogTitle>
          <DialogDescription className="text-base">
            {description || `L'accès à "${feature}" nécessite un abonnement PREMIUM.`}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-xl p-4 my-4">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-5 h-5 text-accent" />
            <span className="font-semibold">Passez à PREMIUM</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Dossiers illimités
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Rappels automatiques (App + WhatsApp)
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Chat interne par dossier
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Gestion des tâches stagiaires
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Reporting complet
            </li>
          </ul>
        </div>

        <div className="text-center mb-4">
          <p className="text-3xl font-bold font-display text-foreground">
            35 000 FC<span className="text-base font-normal text-muted-foreground">/mois</span>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="gold" size="lg" onClick={handleUpgrade} className="gap-2">
            <Crown className="w-5 h-5" />
            Passer à PREMIUM
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Plus tard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

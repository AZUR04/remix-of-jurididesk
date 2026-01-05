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
import { PLANS } from "@/types/subscription";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: string;
  description?: string;
}

export function UpgradeModal({ open, onOpenChange, feature, description }: UpgradeModalProps) {
  const navigate = useNavigate();
  const { plan } = useSubscription();
  
  // Get next available plan that has the feature
  const planOrder = ["FREE", "PREMIUM", "TEAM", "CABINET", "CABINET_XXL"] as const;
  const currentPlanIndex = planOrder.indexOf(plan);
  const nextPlan = currentPlanIndex < planOrder.length - 1 ? PLANS[planOrder[currentPlanIndex + 1]] : null;

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
            Fonctionnalité {nextPlan?.name || "PREMIUM"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {description || `L'accès à "${feature}" nécessite un abonnement supérieur.`}
          </DialogDescription>
        </DialogHeader>

        {nextPlan && (
          <div className="bg-muted/50 rounded-xl p-4 my-4">
            <div className="flex items-center gap-3 mb-3">
              <Crown className="w-5 h-5 text-accent" />
              <span className="font-semibold">Passez à {nextPlan.name}</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {nextPlan.features.slice(0, 5).map((feat, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        )}

        {nextPlan && (
          <div className="text-center mb-4">
            <p className="text-3xl font-bold font-display text-foreground">
              {nextPlan.price.toLocaleString()} FC
              <span className="text-base font-normal text-muted-foreground">/mois</span>
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button variant="gold" size="lg" onClick={handleUpgrade} className="gap-2">
            <Crown className="w-5 h-5" />
            Voir les plans
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Plus tard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

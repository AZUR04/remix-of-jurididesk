import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Lock, Sparkles, FolderPlus, FileText, Users } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { PLANS } from "@/types/subscription";

interface LimitReachedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: "dossiers" | "documents" | "users";
}

const resourceConfig = {
  dossiers: {
    icon: FolderPlus,
    singular: "dossier",
    plural: "dossiers",
  },
  documents: {
    icon: FileText,
    singular: "document",
    plural: "documents", 
  },
  users: {
    icon: Users,
    singular: "utilisateur",
    plural: "utilisateurs",
  },
};

export function LimitReachedModal({ open, onOpenChange, resource }: LimitReachedModalProps) {
  const navigate = useNavigate();
  const { plan, limits, currentUsage, extraDossiers } = useSubscription();
  const config = resourceConfig[resource];
  const Icon = config.icon;
  
  // Calculate the effective limit for dossiers
  const effectiveLimit = resource === "dossiers" 
    ? (limits.maxDossiers === Infinity ? "∞" : limits.maxDossiers + extraDossiers)
    : (limits.maxDocuments === Infinity ? "∞" : limits.maxDocuments);
  
  const usage = resource === "dossiers" 
    ? currentUsage.dossiers 
    : resource === "documents" 
      ? currentUsage.documents 
      : currentUsage.users;

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate("/abonnement");
  };
  
  // Get next available plan
  const planOrder = ["FREE", "PREMIUM", "TEAM", "CABINET", "CABINET_XXL"] as const;
  const currentPlanIndex = planOrder.indexOf(plan);
  const nextPlan = currentPlanIndex < planOrder.length - 1 ? PLANS[planOrder[currentPlanIndex + 1]] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            Vous avez atteint la limite de {effectiveLimit} {config.plural} pour le plan {plan}.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 my-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {nextPlan ? `Passez à ${nextPlan.name}` : "Limite maximale"}
              </p>
              <p className="text-sm text-muted-foreground">
                {nextPlan ? "Débloquez plus de capacité" : "Vous êtes au plan maximum"}
              </p>
            </div>
          </div>
          
          {nextPlan && (
            <>
              <ul className="space-y-2 text-sm mb-4">
                {nextPlan.features.slice(0, 5).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center pt-3 border-t border-accent/20">
                <p className="text-3xl font-bold font-display text-foreground">
                  {nextPlan.price.toLocaleString()} FC
                  <span className="text-base font-normal text-muted-foreground">/mois</span>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="gold" size="lg" onClick={handleUpgrade} className="w-full gap-2">
            <Crown className="w-5 h-5" />
            {nextPlan ? "Voir les plans" : "Gérer l'abonnement"}
          </Button>
          
          {/* Option dossier supplémentaire pour PREMIUM+ */}
          {resource === "dossiers" && plan !== "FREE" && PLANS[plan].extraDossierPrice && (
            <Button variant="outline" size="lg" onClick={handleUpgrade} className="w-full gap-2">
              <FolderPlus className="w-5 h-5" />
              Acheter un dossier ({PLANS[plan].extraDossierPrice?.toLocaleString()} FC)
            </Button>
          )}
          
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

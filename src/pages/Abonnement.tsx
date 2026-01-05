import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PLANS, SubscriptionPlan } from "@/types/subscription";
import { PlanBadge } from "@/components/subscription/PlanBadge";
import { KPayPaymentDialog } from "@/components/subscription/KPayPaymentDialog";
import {
  Crown,
  Check,
  CreditCard,
  History,
  CheckCircle2,
  XCircle,
  Clock,
  FolderPlus,
  Shield,
  Users,
  Building2,
  Loader2,
} from "lucide-react";

const planOrder: SubscriptionPlan[] = ["FREE", "PREMIUM", "TEAM", "CABINET", "CABINET_XXL"];

const paymentStatusStyles = {
  success: { label: "Réussi", icon: CheckCircle2, className: "text-success" },
  failed: { label: "Échoué", icon: XCircle, className: "text-destructive" },
  pending: { label: "En attente", icon: Clock, className: "text-warning" },
};

export default function Abonnement() {
  const { 
    plan, 
    planConfig, 
    paymentHistory, 
    loadingPayments,
    currentUsage, 
    limits,
    extraDossiers,
    upgradePlan, 
    purchaseExtraDossier,
    recordPayment,
  } = useSubscription();
  const { toast } = useToast();
  
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ type: "plan" | "dossier"; plan?: SubscriptionPlan } | null>(null);

  const handleSelectPlan = (targetPlan: SubscriptionPlan) => {
    if (targetPlan === plan) return;
    setSelectedProduct({ type: "plan", plan: targetPlan });
    setPaymentDialogOpen(true);
  };

  const handleBuyDossier = () => {
    setSelectedProduct({ type: "dossier" });
    setPaymentDialogOpen(true);
  };

  const getPaymentAmount = () => {
    if (!selectedProduct) return 0;
    if (selectedProduct.type === "dossier") {
      return planConfig.extraDossierPrice || 5000;
    }
    return selectedProduct.plan ? PLANS[selectedProduct.plan].price : 0;
  };

  const getPaymentDescription = () => {
    if (!selectedProduct) return "";
    if (selectedProduct.type === "dossier") {
      return "Dossier supplémentaire";
    }
    return `Abonnement ${selectedProduct.plan}`;
  };

  const handlePaymentSuccess = async () => {
    // Record payment in Firestore
    await recordPayment({
      date: new Date().toISOString(),
      amount: getPaymentAmount(),
      description: getPaymentDescription(),
      status: "success",
      reference: `JRD-${Date.now()}`,
      method: "kpay",
    });
    
    // Update plan or extra dossiers
    if (selectedProduct?.type === "plan" && selectedProduct.plan) {
      await upgradePlan(selectedProduct.plan);
      toast({
        title: "Abonnement activé !",
        description: `Votre plan ${selectedProduct.plan} est maintenant actif.`,
      });
    } else if (selectedProduct?.type === "dossier") {
      await purchaseExtraDossier();
      toast({
        title: "Dossier ajouté !",
        description: "Votre dossier supplémentaire a été ajouté.",
      });
    }
  };

  const closeDialog = () => {
    setPaymentDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <AppLayout
      title="Abonnement"
      subtitle="Gérez votre abonnement et vos paiements"
    >
      {/* Current Status Banner */}
      <div className={cn(
        "mb-6 p-6 rounded-xl border animate-fade-in",
        plan !== "FREE" 
          ? "bg-accent/5 border-accent/20" 
          : "bg-muted/50 border-border"
      )}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center",
              plan !== "FREE" ? "gradient-gold" : "bg-muted"
            )}>
              {plan !== "FREE" ? (
                <Crown className="w-7 h-7 text-primary" />
              ) : (
                <Shield className="w-7 h-7 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-display font-bold">
                  Abonnement
                </h2>
                <PlanBadge plan={plan} size="lg" />
              </div>
              <p className="text-muted-foreground">
                {plan === "FREE"
                  ? "Passez à un plan supérieur pour débloquer toutes les fonctionnalités"
                  : "Profitez de toutes les fonctionnalités de JuridiDesk"}
              </p>
            </div>
          </div>
        </div>

        {/* Usage stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-background/80">
            <p className="text-sm text-muted-foreground">Dossiers</p>
            <p className="text-2xl font-bold">
              {currentUsage.dossiers}/{limits.maxDossiers === Infinity ? "∞" : limits.maxDossiers + extraDossiers}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-background/80">
            <p className="text-sm text-muted-foreground">Documents</p>
            <p className="text-2xl font-bold">
              {currentUsage.documents}/{limits.maxDocuments === Infinity ? "∞" : limits.maxDocuments}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-background/80">
            <p className="text-sm text-muted-foreground">Utilisateurs</p>
            <p className="text-2xl font-bold">
              {currentUsage.users}/{limits.maxUsers === Infinity ? "∞" : limits.maxUsers}
            </p>
          </div>
          {extraDossiers > 0 && (
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm text-muted-foreground">Dossiers bonus</p>
              <p className="text-2xl font-bold text-accent">+{extraDossiers}</p>
            </div>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="mb-8">
        <h3 className="text-xl font-display font-bold mb-4">Choisissez votre plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {planOrder.map((planId, index) => {
            const planData = PLANS[planId];
            const isCurrent = plan === planId;
            const isUpgrade = planOrder.indexOf(planId) > planOrder.indexOf(plan);
            
            return (
              <Card 
                key={planId}
                className={cn(
                  "relative opacity-0 animate-fade-in transition-all",
                  isCurrent && "ring-2 ring-accent",
                  planData.popular && "border-accent/50 bg-accent/5"
                )} 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {planData.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground">Populaire</Badge>
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="outline">Actuel</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-2">
                  <CardTitle className="font-display text-lg flex items-center justify-center gap-2">
                    {planId === "PREMIUM" && <Crown className="w-5 h-5 text-accent" />}
                    {planId === "TEAM" && <Users className="w-5 h-5 text-primary" />}
                    {(planId === "CABINET" || planId === "CABINET_XXL") && <Building2 className="w-5 h-5 text-success" />}
                    {planData.name}
                  </CardTitle>
                  <p className="text-2xl font-bold font-display mt-2">
                    {planData.price === 0 ? "Gratuit" : (
                      <>
                        {planData.price.toLocaleString()} FC
                        <span className="text-sm font-normal text-muted-foreground">/mois</span>
                      </>
                    )}
                  </p>
                </CardHeader>
                
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">{planData.description}</p>
                  
                  <ul className="space-y-2 text-sm text-left mb-4">
                    {planData.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {isUpgrade ? (
                    <Button 
                      variant={planData.popular ? "gold" : "outline"} 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleSelectPlan(planId)}
                    >
                      Passer à {planData.name}
                    </Button>
                  ) : isCurrent ? (
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      Plan actuel
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="w-full" disabled>
                      —
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Additional Dossier (non-FREE plans) */}
      {plan !== "FREE" && planConfig.extraDossierPrice && (
        <Card className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-accent" />
              Dossiers supplémentaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">
                  Ajoutez des dossiers supplémentaires à la demande
                </p>
                <p className="text-2xl font-bold font-display mt-2">
                  {planConfig.extraDossierPrice.toLocaleString()} FC
                  <span className="text-sm font-normal text-muted-foreground">/dossier</span>
                </p>
              </div>
              <Button variant="outline" onClick={handleBuyDossier} className="gap-2">
                <FolderPlus className="w-4 h-4" />
                Ajouter un dossier
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "350ms" }}>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <History className="w-5 h-5" />
            Historique des paiements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingPayments ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : paymentHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun paiement effectué</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Référence</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Montant</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paymentHistory.map((payment) => {
                    const statusInfo = paymentStatusStyles[payment.status];
                    const StatusIcon = statusInfo.icon;
                    return (
                      <tr key={payment.id} className="hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 text-sm">
                          {new Date(payment.date).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="py-3 px-4 font-medium">{payment.description}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">
                            {payment.reference}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {payment.amount.toLocaleString()} FC
                        </td>
                        <td className="py-3 px-4">
                          <div className={cn("flex items-center gap-1", statusInfo.className)}>
                            <StatusIcon className="w-4 h-4" />
                            <span className="text-sm">{statusInfo.label}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* K-Pay Payment Dialog */}
      <KPayPaymentDialog
        open={paymentDialogOpen}
        onOpenChange={closeDialog}
        amount={getPaymentAmount()}
        description={getPaymentDescription()}
        onSuccess={handlePaymentSuccess}
        onError={(error) => {
          toast({
            title: "Échec du paiement",
            description: error,
            variant: "destructive",
          });
        }}
      />
    </AppLayout>
  );
}

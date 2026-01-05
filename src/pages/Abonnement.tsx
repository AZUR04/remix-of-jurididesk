import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PLANS, SubscriptionPlan } from "@/types/subscription";
import { PlanBadge } from "@/components/subscription/PlanBadge";
import {
  Crown,
  Check,
  X,
  Smartphone,
  CreditCard,
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  FolderPlus,
  Shield,
  Sparkles,
  Users,
  Building2,
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
    currentUsage, 
    limits,
    extraDossiers,
    upgradePlan, 
    purchaseExtraDossier,
    processKPayPayment 
  } = useSubscription();
  const { toast } = useToast();
  
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ type: "plan" | "dossier"; plan?: SubscriptionPlan } | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"form" | "processing" | "success" | "error">("form");

  const handleSelectPlan = (targetPlan: SubscriptionPlan) => {
    if (targetPlan === plan) return;
    setSelectedProduct({ type: "plan", plan: targetPlan });
    setPaymentStep("form");
    setPaymentDialogOpen(true);
  };

  const handleBuyDossier = () => {
    setSelectedProduct({ type: "dossier" });
    setPaymentStep("form");
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

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      toast({
        title: "Numéro invalide",
        description: "Veuillez entrer un numéro de téléphone valide.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStep("processing");

    const result = await processKPayPayment({
      amount: getPaymentAmount(),
      phoneNumber,
      description: getPaymentDescription(),
      reference: `KPAY-${Date.now()}`,
    });

    if (result.success) {
      setPaymentStep("success");
      
      if (selectedProduct?.type === "plan" && selectedProduct.plan) {
        await upgradePlan(selectedProduct.plan);
        toast({
          title: "Paiement réussi !",
          description: `Votre abonnement ${selectedProduct.plan} est maintenant actif.`,
        });
      } else if (selectedProduct?.type === "dossier") {
        await purchaseExtraDossier();
        toast({
          title: "Paiement réussi !",
          description: "Votre dossier supplémentaire a été ajouté.",
        });
      }
    } else {
      setPaymentStep("error");
      toast({
        title: "Échec du paiement",
        description: result.error || "La transaction a échoué. Veuillez réessayer.",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  const closeDialog = () => {
    setPaymentDialogOpen(false);
    setPhoneNumber("");
    setPaymentStep("form");
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
          {paymentHistory.length === 0 ? (
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
      <Dialog open={paymentDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md">
          {paymentStep === "form" && (
            <>
              <DialogHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full gradient-gold flex items-center justify-center mb-4">
                  <Smartphone className="w-8 h-8 text-primary" />
                </div>
                <DialogTitle className="font-display text-2xl">
                  Paiement K-Pay
                </DialogTitle>
                <DialogDescription>
                  {getPaymentDescription()} - {getPaymentAmount().toLocaleString()} FC
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <div className="mb-4 p-4 rounded-lg bg-muted/50 text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Paiement sécurisé via K-Pay Mobile Money</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Numéro de téléphone Mobile Money</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Ex: 0812345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Vodacom, Airtel, Orange ou Africell
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Montant à payer</span>
                      <span className="text-xl font-bold">
                        {getPaymentAmount().toLocaleString()} FC
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="gold" size="lg" onClick={handlePayment} className="gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payer maintenant
                </Button>
                <Button variant="ghost" onClick={closeDialog}>
                  Annuler
                </Button>
              </div>
            </>
          )}

          {paymentStep === "processing" && (
            <div className="py-12 text-center">
              <Loader2 className="w-16 h-16 mx-auto text-accent animate-spin mb-4" />
              <h3 className="text-xl font-display font-semibold mb-2">
                Traitement en cours...
              </h3>
              <p className="text-muted-foreground">
                Veuillez confirmer le paiement sur votre téléphone
              </p>
            </div>
          )}

          {paymentStep === "success" && (
            <div className="py-8 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">
                Paiement réussi !
              </h3>
              <p className="text-muted-foreground mb-6">
                {selectedProduct?.type === "plan"
                  ? `Votre abonnement ${selectedProduct.plan} est maintenant actif.`
                  : "Votre dossier supplémentaire a été ajouté."}
              </p>
              <Button variant="gold" onClick={closeDialog}>
                Continuer
              </Button>
            </div>
          )}

          {paymentStep === "error" && (
            <div className="py-8 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <XCircle className="w-10 h-10 text-destructive" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">
                Échec du paiement
              </h3>
              <p className="text-muted-foreground mb-6">
                La transaction a échoué. Veuillez vérifier votre solde et réessayer.
              </p>
              <div className="flex flex-col gap-2">
                <Button variant="gold" onClick={() => setPaymentStep("form")}>
                  Réessayer
                </Button>
                <Button variant="ghost" onClick={closeDialog}>
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

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
} from "lucide-react";

// Features comparison
const features = [
  { name: "Dossiers", free: "1 maximum", premium: "Illimités", icon: "folder" },
  { name: "Utilisateurs", free: "1 maximum", premium: "Illimités", icon: "users" },
  { name: "Documents", free: "5 maximum", premium: "Illimités", icon: "file" },
  { name: "Rappels automatiques", free: false, premium: true, icon: "bell" },
  { name: "Rappels WhatsApp", free: false, premium: true, icon: "phone" },
  { name: "Chat interne", free: false, premium: true, icon: "message" },
  { name: "Gestion des tâches", free: false, premium: true, icon: "check" },
  { name: "Reporting complet", free: false, premium: true, icon: "chart" },
  { name: "Support prioritaire", free: false, premium: true, icon: "support" },
];

const paymentStatusStyles = {
  success: { label: "Réussi", icon: CheckCircle2, className: "text-success" },
  failed: { label: "Échoué", icon: XCircle, className: "text-destructive" },
  pending: { label: "En attente", icon: Clock, className: "text-warning" },
};

export default function Abonnement() {
  const { status, paymentHistory, upgradeToPremium, currentUsage } = useSubscription();
  const { toast } = useToast();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<"premium" | "dossier" | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"form" | "processing" | "success" | "error">("form");

  const handleSelectProduct = (product: "premium" | "dossier") => {
    setSelectedProduct(product);
    setPaymentStep("form");
    setPaymentDialogOpen(true);
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

    // Simulate YabetooPay API call
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Simulate success (80% chance)
    const success = Math.random() > 0.2;

    if (success) {
      setPaymentStep("success");
      if (selectedProduct === "premium") {
        upgradeToPremium();
      }
      toast({
        title: "Paiement réussi !",
        description: selectedProduct === "premium" 
          ? "Votre abonnement PREMIUM est maintenant actif."
          : "Votre dossier supplémentaire a été ajouté.",
      });
    } else {
      setPaymentStep("error");
      toast({
        title: "Échec du paiement",
        description: "La transaction a échoué. Veuillez réessayer.",
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
        status === "PREMIUM" 
          ? "bg-accent/5 border-accent/20" 
          : "bg-muted/50 border-border"
      )}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center",
              status === "PREMIUM" ? "gradient-gold" : "bg-muted"
            )}>
              {status === "PREMIUM" ? (
                <Crown className="w-7 h-7 text-primary" />
              ) : (
                <Shield className="w-7 h-7 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-display font-bold">
                  Abonnement {status}
                </h2>
                <Badge variant={status === "PREMIUM" ? "default" : "secondary"}>
                  {status === "PREMIUM" ? "Actif" : "Gratuit"}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {status === "PREMIUM"
                  ? "Profitez de toutes les fonctionnalités de JuridiDesk"
                  : "Passez à PREMIUM pour débloquer toutes les fonctionnalités"}
              </p>
            </div>
          </div>
          {status === "FREE" && (
            <Button variant="gold" size="lg" onClick={() => handleSelectProduct("premium")} className="gap-2">
              <Crown className="w-5 h-5" />
              Passer à PREMIUM
            </Button>
          )}
        </div>

        {/* Usage stats for FREE */}
        {status === "FREE" && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-background/80">
              <p className="text-sm text-muted-foreground">Dossiers</p>
              <p className="text-2xl font-bold">{currentUsage.dossiers}/1</p>
            </div>
            <div className="p-4 rounded-lg bg-background/80">
              <p className="text-sm text-muted-foreground">Utilisateurs</p>
              <p className="text-2xl font-bold">{currentUsage.users}/1</p>
            </div>
            <div className="p-4 rounded-lg bg-background/80">
              <p className="text-sm text-muted-foreground">Documents</p>
              <p className="text-2xl font-bold">{currentUsage.documents}/5</p>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* FREE Plan */}
        <Card className={cn(
          "relative opacity-0 animate-fade-in",
          status === "FREE" && "ring-2 ring-primary"
        )} style={{ animationDelay: "100ms" }}>
          {status === "FREE" && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge>Votre plan actuel</Badge>
            </div>
          )}
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-display text-2xl">FREE</CardTitle>
            <p className="text-4xl font-bold font-display mt-2">
              0 FC<span className="text-base font-normal text-muted-foreground">/mois</span>
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-6">
              Pour découvrir JuridiDesk
            </p>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature.name} className="flex items-center gap-3">
                  {typeof feature.free === "boolean" ? (
                    feature.free ? (
                      <Check className="w-5 h-5 text-success flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                    )
                  ) : (
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                  )}
                  <span className={cn(
                    typeof feature.free === "boolean" && !feature.free && "text-muted-foreground/50"
                  )}>
                    {feature.name}
                    {typeof feature.free === "string" && (
                      <span className="text-muted-foreground ml-1">({feature.free})</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* PREMIUM Plan */}
        <Card className={cn(
          "relative opacity-0 animate-fade-in border-accent/30 bg-accent/5",
          status === "PREMIUM" && "ring-2 ring-accent"
        )} style={{ animationDelay: "150ms" }}>
          {status === "PREMIUM" && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-accent text-accent-foreground">Votre plan actuel</Badge>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-display text-2xl flex items-center justify-center gap-2">
              <Crown className="w-6 h-6 text-accent" />
              PREMIUM
            </CardTitle>
            <p className="text-4xl font-bold font-display mt-2">
              35 000 FC<span className="text-base font-normal text-muted-foreground">/mois</span>
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-6">
              Pour les cabinets professionnels
            </p>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature.name} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>
                    {feature.name}
                    {typeof feature.premium === "string" && (
                      <span className="text-accent ml-1">({feature.premium})</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            {status === "FREE" && (
              <Button 
                variant="gold" 
                size="lg" 
                className="w-full mt-6 gap-2"
                onClick={() => handleSelectProduct("premium")}
              >
                <Crown className="w-5 h-5" />
                S'abonner maintenant
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Dossier (PREMIUM only) */}
      {status === "PREMIUM" && (
        <Card className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
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
                  5 000 FC<span className="text-sm font-normal text-muted-foreground">/dossier</span>
                </p>
              </div>
              <Button variant="outline" onClick={() => handleSelectProduct("dossier")} className="gap-2">
                <FolderPlus className="w-4 h-4" />
                Ajouter un dossier
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "250ms" }}>
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

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md">
          {paymentStep === "form" && (
            <>
              <DialogHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full gradient-gold flex items-center justify-center mb-4">
                  <Smartphone className="w-8 h-8 text-primary" />
                </div>
                <DialogTitle className="font-display text-2xl">
                  Paiement Mobile Money
                </DialogTitle>
                <DialogDescription>
                  {selectedProduct === "premium"
                    ? "Abonnement PREMIUM - 35 000 FC/mois"
                    : "Dossier supplémentaire - 5 000 FC"}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <div className="mb-4 p-4 rounded-lg bg-muted/50 text-center">
                  <img 
                    src="https://yabetoopay.com/images/logo.png" 
                    alt="YabetooPay" 
                    className="h-8 mx-auto mb-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <p className="text-sm text-muted-foreground">Paiement sécurisé via YabetooPay</p>
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
                        {selectedProduct === "premium" ? "35 000" : "5 000"} FC
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
                {selectedProduct === "premium"
                  ? "Votre abonnement PREMIUM est maintenant actif."
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

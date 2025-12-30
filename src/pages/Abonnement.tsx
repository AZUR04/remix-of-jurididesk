import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Check,
  X,
  Crown,
  Smartphone,
  FolderPlus,
  Shield,
  Clock,
  Users,
  FileText,
  BarChart3,
  MessageSquare,
  Calendar,
  Lock,
  Zap,
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Features configuration
const features = [
  { 
    id: "dossiers_base", 
    label: "Jusqu'à 5 dossiers", 
    description: "Créez et gérez 5 dossiers clients",
    icon: FileText, 
    free: true, 
    paid: true 
  },
  { 
    id: "dossiers_unlimited", 
    label: "Dossiers illimités", 
    description: "Aucune limite sur le nombre de dossiers",
    icon: FolderPlus, 
    free: false, 
    paid: true 
  },
  { 
    id: "calendar", 
    label: "Calendrier d'audiences", 
    description: "Planifiez vos audiences et rendez-vous",
    icon: Calendar, 
    free: true, 
    paid: true 
  },
  { 
    id: "documents_base", 
    label: "Stockage 500 MB", 
    description: "Stockage de base pour vos documents",
    icon: FileText, 
    free: true, 
    paid: true 
  },
  { 
    id: "documents_unlimited", 
    label: "Stockage illimité", 
    description: "Aucune limite de stockage",
    icon: Shield, 
    free: false, 
    paid: true 
  },
  { 
    id: "tasks", 
    label: "Gestion des tâches", 
    description: "Assignez des tâches aux stagiaires",
    icon: Check, 
    free: true, 
    paid: true 
  },
  { 
    id: "chat", 
    label: "Messagerie interne", 
    description: "Communication d'équipe par dossier",
    icon: MessageSquare, 
    free: false, 
    paid: true 
  },
  { 
    id: "notifications", 
    label: "Notifications SMS/WhatsApp", 
    description: "Rappels automatiques par téléphone",
    icon: Smartphone, 
    free: false, 
    paid: true 
  },
  { 
    id: "reporting", 
    label: "Rapports et statistiques", 
    description: "Analyse de performance du cabinet",
    icon: BarChart3, 
    free: false, 
    paid: true 
  },
  { 
    id: "users", 
    label: "Équipe illimitée", 
    description: "Ajoutez tous vos collaborateurs",
    icon: Users, 
    free: false, 
    paid: true 
  },
  { 
    id: "encryption", 
    label: "Cryptage AES-256", 
    description: "Protection maximale des documents",
    icon: Lock, 
    free: false, 
    paid: true 
  },
  { 
    id: "priority", 
    label: "Support prioritaire", 
    description: "Assistance rapide par téléphone",
    icon: Zap, 
    free: false, 
    paid: true 
  },
];

const freeFeatures = features.filter(f => f.free);
const paidOnlyFeatures = features.filter(f => !f.free && f.paid);

export default function Abonnement() {
  const { toast } = useToast();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<"subscription" | "dossier">("subscription");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [currentPlan] = useState<"free" | "premium">("free");

  const handleOpenPayment = (type: "subscription" | "dossier") => {
    setPaymentType(type);
    setPaymentStatus("idle");
    setPhoneNumber("");
    setPaymentDialogOpen(true);
  };

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      toast({
        title: "Numéro invalide",
        description: "Veuillez entrer un numéro Mobile Money valide.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("processing");

    // Simulate PayDunya payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate success (80% chance) or failure
    const success = Math.random() > 0.2;

    if (success) {
      setPaymentStatus("success");
      toast({
        title: "Paiement réussi!",
        description: paymentType === "subscription" 
          ? "Votre abonnement Premium est maintenant actif."
          : "Votre dossier supplémentaire a été ajouté.",
      });
    } else {
      setPaymentStatus("error");
      toast({
        title: "Paiement échoué",
        description: "Vérifiez votre solde Mobile Money et réessayez.",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  const handleContinueFree = () => {
    toast({
      title: "Plan Gratuit actif",
      description: "Vous continuez avec les fonctionnalités de base.",
    });
  };

  return (
    <AppLayout title="Abonnement" subtitle="Choisissez votre formule">
      {/* Current Plan Badge */}
      <div className="mb-6">
        <Badge 
          variant="outline" 
          className={cn(
            "text-sm py-1 px-3",
            currentPlan === "premium" 
              ? "bg-accent/10 text-accent border-accent/30" 
              : "bg-muted text-muted-foreground"
          )}
        >
          {currentPlan === "premium" ? (
            <>
              <Crown className="w-4 h-4 mr-2" />
              Plan Premium actif
            </>
          ) : (
            "Plan Gratuit"
          )}
        </Badge>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Free Plan */}
        <Card className="relative opacity-0 animate-fade-in">
          <CardHeader>
            <CardTitle className="font-display text-xl flex items-center justify-between">
              Plan Gratuit
              <Badge variant="secondary">Actuel</Badge>
            </CardTitle>
            <CardDescription>
              Fonctionnalités de base pour démarrer
            </CardDescription>
            <div className="pt-4">
              <span className="text-4xl font-bold">0 FC</span>
              <span className="text-muted-foreground"> / mois</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {freeFeatures.map((feature) => (
                <div key={feature.id} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{feature.label}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
              {paidOnlyFeatures.slice(0, 3).map((feature) => (
                <div key={feature.id} className="flex items-start gap-3 opacity-50">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium line-through">{feature.label}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleContinueFree}
            >
              Continuer avec Gratuit
            </Button>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="relative border-accent/50 bg-gradient-to-b from-accent/5 to-transparent opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-accent text-accent-foreground px-4 py-1">
              <Crown className="w-3 h-3 mr-1" />
              Recommandé
            </Badge>
          </div>
          <CardHeader className="pt-8">
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <Crown className="w-5 h-5 text-accent" />
              Plan Premium
            </CardTitle>
            <CardDescription>
              Toutes les fonctionnalités pour votre cabinet
            </CardDescription>
            <div className="pt-4">
              <span className="text-4xl font-bold">35 000 FC</span>
              <span className="text-muted-foreground"> / mois</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {features.filter(f => f.paid).map((feature) => (
                <div key={feature.id} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{feature.label}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="gold" 
              className="w-full gap-2"
              onClick={() => handleOpenPayment("subscription")}
            >
              <Smartphone className="w-4 h-4" />
              Payer l'abonnement
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Case Option */}
      <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-primary" />
            Dossier supplémentaire
          </CardTitle>
          <CardDescription>
            Ajoutez un dossier à votre plan Gratuit sans passer au Premium
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border bg-muted/30">
            <div>
              <p className="font-medium">+1 Dossier client</p>
              <p className="text-sm text-muted-foreground">
                Paiement unique, sans abonnement
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-2xl font-bold">2 000 FC</span>
                <span className="text-muted-foreground text-sm"> / dossier</span>
              </div>
              <Button 
                variant="outline"
                onClick={() => handleOpenPayment("dossier")}
                className="gap-2"
              >
                <FolderPlus className="w-4 h-4" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Comparison Table */}
      <Card className="mt-6 opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <CardHeader>
          <CardTitle className="font-display text-lg">Comparaison des plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fonctionnalité</th>
                  <th className="text-center py-3 px-4 text-sm font-medium">Gratuit</th>
                  <th className="text-center py-3 px-4 text-sm font-medium">
                    <span className="flex items-center justify-center gap-1">
                      <Crown className="w-4 h-4 text-accent" />
                      Premium
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {features.map((feature) => (
                  <tr key={feature.id} className="hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <feature.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{feature.label}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {feature.free ? (
                        <Check className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {feature.paid ? (
                        <Check className="w-5 h-5 text-accent mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              {paymentType === "subscription" ? "Paiement Abonnement" : "Ajouter un dossier"}
            </DialogTitle>
          </DialogHeader>

          {paymentStatus === "idle" || paymentStatus === "processing" ? (
            <div className="space-y-6 py-4">
              {/* Payment Summary */}
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">
                    {paymentType === "subscription" ? "Abonnement Premium" : "Dossier supplémentaire"}
                  </span>
                  <span className="font-bold">
                    {paymentType === "subscription" ? "35 000 FC" : "2 000 FC"}
                  </span>
                </div>
                {paymentType === "subscription" && (
                  <p className="text-xs text-muted-foreground">
                    Renouvelé automatiquement chaque mois
                  </p>
                )}
              </div>

              {/* Mobile Money Form */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-accent/5 border-accent/20">
                  <Smartphone className="w-6 h-6 text-accent" />
                  <div>
                    <p className="font-medium text-sm">Paiement via Mobile Money</p>
                    <p className="text-xs text-muted-foreground">Orange Money, M-Pesa, Airtel Money</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro Mobile Money</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Ex: 0812345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isProcessing}
                  />
                  <p className="text-xs text-muted-foreground">
                    Vous recevrez une demande de confirmation sur ce numéro
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPaymentDialogOpen(false)}
                  disabled={isProcessing}
                >
                  Annuler
                </Button>
                <Button
                  variant="gold"
                  className="flex-1 gap-2"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4" />
                      Payer
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Paiement sécurisé via PayDunya
              </p>
            </div>
          ) : paymentStatus === "success" ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Paiement réussi!</h3>
                <p className="text-muted-foreground">
                  {paymentType === "subscription" 
                    ? "Votre abonnement Premium est maintenant actif."
                    : "Votre dossier supplémentaire a été ajouté."}
                </p>
              </div>
              <Button variant="gold" onClick={() => setPaymentDialogOpen(false)}>
                Continuer
              </Button>
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Paiement échoué</h3>
                <p className="text-muted-foreground">
                  Vérifiez votre solde Mobile Money et réessayez.
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                  Fermer
                </Button>
                <Button variant="gold" onClick={() => setPaymentStatus("idle")}>
                  Réessayer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

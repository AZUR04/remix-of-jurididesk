import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useKPayPayment } from "@/hooks/useKPayPayment";
import { getKPayMode } from "@/lib/kpay";
import { cn } from "@/lib/utils";
import {
  Smartphone,
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Shield,
} from "lucide-react";

interface KPayPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  description: string;
  onSuccess: () => void;
  onError?: (error: string) => void;
}

export function KPayPaymentDialog({
  open,
  onOpenChange,
  amount,
  description,
  onSuccess,
  onError,
}: KPayPaymentDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  
  const {
    status,
    transactionId,
    error,
    startPayment,
    cancelPayment,
    reset,
    validatePhone,
  } = useKPayPayment();
  
  const kpayMode = getKPayMode();
  
  // Reset on close
  useEffect(() => {
    if (!open) {
      reset();
      setPhoneNumber("");
      setPhoneError(null);
    }
  }, [open, reset]);
  
  // Handle success
  useEffect(() => {
    if (status === "success") {
      onSuccess();
    }
  }, [status, onSuccess]);
  
  // Handle error
  useEffect(() => {
    if (status === "failed" && error && onError) {
      onError(error);
    }
  }, [status, error, onError]);
  
  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    if (value.length >= 9) {
      const validation = validatePhone(value);
      setPhoneError(validation.valid ? null : validation.error || null);
    } else {
      setPhoneError(null);
    }
  };
  
  const handlePayment = async () => {
    const validation = validatePhone(phoneNumber);
    if (!validation.valid) {
      setPhoneError(validation.error || "Numéro invalide");
      return;
    }
    
    await startPayment({
      amount,
      phoneNumber,
      description,
    });
  };
  
  const handleClose = () => {
    if (status === "pending" || status === "polling" || status === "initiating") {
      cancelPayment();
    }
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {/* Initial Form */}
        {status === "idle" && (
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full gradient-gold flex items-center justify-center mb-4">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>
              <DialogTitle className="font-display text-2xl">
                Paiement K-Pay
              </DialogTitle>
              <DialogDescription className="flex items-center justify-center gap-2">
                {description}
                {kpayMode === "sandbox" && (
                  <Badge variant="outline" className="text-xs">Mode Test</Badge>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="mb-4 p-4 rounded-lg bg-muted/50 text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Paiement sécurisé via K-Pay Mobile Money
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Numéro de téléphone Mobile Money</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Ex: 0812345678"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={cn("mt-2", phoneError && "border-destructive")}
                  />
                  {phoneError ? (
                    <p className="text-xs text-destructive mt-1">{phoneError}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      Vodacom, Airtel, Orange ou Africell
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Montant à payer</span>
                    <span className="text-xl font-bold">
                      {amount.toLocaleString()} FC
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Paiement sécurisé et crypté</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                variant="gold" 
                size="lg" 
                onClick={handlePayment} 
                className="gap-2"
                disabled={!phoneNumber || !!phoneError}
              >
                <CreditCard className="w-5 h-5" />
                Payer {amount.toLocaleString()} FC
              </Button>
              <Button variant="ghost" onClick={handleClose}>
                Annuler
              </Button>
            </div>
          </>
        )}

        {/* Initiating */}
        {status === "initiating" && (
          <div className="py-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto text-accent animate-spin mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2">
              Connexion à K-Pay...
            </h3>
            <p className="text-muted-foreground">
              Veuillez patienter
            </p>
          </div>
        )}

        {/* Pending / Polling */}
        {(status === "pending" || status === "polling") && (
          <div className="py-12 text-center">
            <div className="relative mx-auto w-20 h-20 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-accent/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
              <Smartphone className="absolute inset-0 m-auto w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-2">
              En attente de confirmation
            </h3>
            <p className="text-muted-foreground mb-4">
              Veuillez confirmer le paiement de <strong>{amount.toLocaleString()} FC</strong> sur votre téléphone
            </p>
            {transactionId && (
              <p className="text-xs text-muted-foreground font-mono">
                Réf: {transactionId}
              </p>
            )}
            <Button variant="ghost" onClick={handleClose} className="mt-4">
              Annuler
            </Button>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <div className="py-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-2">
              Paiement réussi !
            </h3>
            <p className="text-muted-foreground mb-6">
              {description} - {amount.toLocaleString()} FC
            </p>
            {transactionId && (
              <p className="text-xs text-muted-foreground font-mono mb-4">
                Réf: {transactionId}
              </p>
            )}
            <Button variant="gold" onClick={handleClose}>
              Continuer
            </Button>
          </div>
        )}

        {/* Failed */}
        {status === "failed" && (
          <div className="py-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-2">
              Échec du paiement
            </h3>
            <p className="text-muted-foreground mb-6">
              {error || "La transaction a échoué. Veuillez vérifier votre solde et réessayer."}
            </p>
            <div className="flex flex-col gap-2">
              <Button variant="gold" onClick={reset}>
                Réessayer
              </Button>
              <Button variant="ghost" onClick={handleClose}>
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* Cancelled */}
        {status === "cancelled" && (
          <div className="py-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-warning/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-10 h-10 text-warning" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-2">
              Paiement annulé
            </h3>
            <p className="text-muted-foreground mb-6">
              {error || "Le paiement a été annulé."}
            </p>
            <div className="flex flex-col gap-2">
              <Button variant="gold" onClick={reset}>
                Réessayer
              </Button>
              <Button variant="ghost" onClick={handleClose}>
                Fermer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

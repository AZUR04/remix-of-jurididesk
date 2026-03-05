import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";
import { redeemActivationCode } from "@/lib/activationCodes";
import { Key, Loader2, CheckCircle2 } from "lucide-react";

export function ActivationCodeInput() {
  const { user, userData } = useAuth();
  const { refreshSubscription } = useSubscription();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRedeem = async () => {
    if (!code.trim() || !user || !userData?.cabinetId) return;

    setLoading(true);
    try {
      const result = await redeemActivationCode(code.trim(), user.uid, userData.cabinetId);

      if (result.success) {
        setSuccess(true);
        setCode("");
        await refreshSubscription();
        toast({
          title: "Abonnement activé !",
          description: `Plan ${result.plan} activé jusqu'au ${new Date(result.endDate!).toLocaleDateString("fr-FR")}`,
        });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de valider le code.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <Key className="w-5 h-5 text-accent" />
          Activer un abonnement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Entrez le code d'activation fourni par l'administrateur pour activer votre plan.
        </p>
        <div className="flex gap-3">
          <Input
            placeholder="Ex: ABCD-EF23-GHKL"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="flex-1 font-mono tracking-wider"
            maxLength={14}
          />
          <Button
            variant="gold"
            onClick={handleRedeem}
            disabled={!code.trim() || loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : success ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Key className="w-4 h-4" />
            )}
            {success ? "Activé !" : "Activer"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

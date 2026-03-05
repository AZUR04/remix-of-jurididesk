import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { PLANS, SubscriptionPlan } from "@/types/subscription";
import { PlanBadge } from "@/components/subscription/PlanBadge";
import { ActivationCodeInput } from "@/components/subscription/ActivationCodeInput";
import { ContactAdminButton } from "@/components/subscription/ContactAdminButton";
import {
  Crown,
  Check,
  Shield,
  Users,
  Building2,
  FolderOpen,
  FileText,
  Calendar,
} from "lucide-react";

const planOrder: SubscriptionPlan[] = ["FREE", "PREMIUM", "TEAM", "CABINET", "CABINET_XXL"];

export default function Abonnement() {
  const {
    plan,
    planConfig,
    currentUsage,
    limits,
    extraDossiers,
  } = useSubscription();

  const { cabinetData } = useAuth();
  const endDate = cabinetData?.subscriptionEndDate;

  return (
    <AppLayout
      title="Abonnement"
      subtitle="Gérez votre abonnement"
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
                <h2 className="text-2xl font-display font-bold">Abonnement</h2>
                <PlanBadge plan={plan} size="lg" />
              </div>
              <p className="text-muted-foreground">
                {plan === "FREE"
                  ? "Activez un plan supérieur avec un code d'activation"
                  : "Profitez de toutes les fonctionnalités de JuridiDesk"}
              </p>
              {endDate && (
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Expire le {new Date(endDate).toLocaleDateString("fr-FR")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Usage stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-background/80">
            <p className="text-sm text-muted-foreground flex items-center gap-1"><FolderOpen className="w-3.5 h-3.5" /> Dossiers</p>
            <p className="text-2xl font-bold">
              {currentUsage.dossiers}/{limits.maxDossiers === Infinity ? "∞" : limits.maxDossiers + extraDossiers}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-background/80">
            <p className="text-sm text-muted-foreground flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Documents</p>
            <p className="text-2xl font-bold">
              {currentUsage.documents}/{limits.maxDocuments === Infinity ? "∞" : limits.maxDocuments}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-background/80">
            <p className="text-sm text-muted-foreground flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Utilisateurs</p>
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

      {/* Activation Code Input */}
      <div className="mb-8">
        <ActivationCodeInput />
      </div>

      {/* Plans Grid */}
      <div className="mb-8">
        <h3 className="text-xl font-display font-bold mb-4">Nos plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {planOrder.map((planId, index) => {
            const planData = PLANS[planId];
            const isCurrent = plan === planId;

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

                  {isCurrent ? (
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      Plan actuel
                    </Button>
                  ) : planId !== "FREE" ? (
                    <ContactAdminButton planName={planData.name} planId={planId} />
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
    </AppLayout>
  );
}

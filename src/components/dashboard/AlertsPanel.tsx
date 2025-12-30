import { AlertTriangle, Clock, Gavel, FileWarning } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: number;
  type: "audience" | "deadline" | "urgent";
  title: string;
  description: string;
  dueDate: string;
  isUrgent: boolean;
}

const alerts: Alert[] = [
  {
    id: 1,
    type: "audience",
    title: "Audience aujourd'hui",
    description: "Société Minière ABC c/ État - Tribunal de Commerce",
    dueDate: "09:00",
    isUrgent: true,
  },
  {
    id: 2,
    type: "deadline",
    title: "Conclusions à déposer",
    description: "Affaire Katanga - Délai de réponse",
    dueDate: "Demain",
    isUrgent: true,
  },
  {
    id: 3,
    type: "urgent",
    title: "Document manquant",
    description: "Succession Mwamba - Acte de propriété requis",
    dueDate: "3 jours",
    isUrgent: false,
  },
];

const alertStyles = {
  audience: {
    icon: Gavel,
    bg: "bg-accent/10 border-accent/30",
    iconBg: "bg-accent/20 text-accent",
  },
  deadline: {
    icon: Clock,
    bg: "bg-destructive/10 border-destructive/30",
    iconBg: "bg-destructive/20 text-destructive",
  },
  urgent: {
    icon: FileWarning,
    bg: "bg-warning/10 border-warning/30",
    iconBg: "bg-warning/20 text-warning",
  },
};

export function AlertsPanel() {
  return (
    <div className="rounded-xl border bg-card shadow-sm opacity-0 animate-fade-in" style={{ animationDelay: "250ms" }}>
      <div className="p-6 border-b border-border flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-warning" />
        <div>
          <h3 className="font-display text-lg font-semibold">Alertes</h3>
          <p className="text-sm text-muted-foreground">Nécessite votre attention</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {alerts.map((alert) => {
          const style = alertStyles[alert.type];
          const Icon = style.icon;
          
          return (
            <div
              key={alert.id}
              className={cn(
                "p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer",
                style.bg
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg flex-shrink-0", style.iconBg)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">{alert.title}</h4>
                    {alert.isUrgent && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-destructive text-destructive-foreground">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                    {alert.description}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-foreground">
                    Échéance: {alert.dueDate}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

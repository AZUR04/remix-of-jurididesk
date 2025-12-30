import { MoreHorizontal, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const cases = [
  {
    id: "DOS-2024-001",
    title: "Société Minière ABC c/ État Congolais",
    client: "Société Minière ABC",
    status: "en_cours",
    type: "Commercial",
    nextHearing: "15 Jan 2025",
  },
  {
    id: "DOS-2024-002",
    title: "Succession Mwamba",
    client: "Famille Mwamba",
    status: "en_attente",
    type: "Civil",
    nextHearing: "22 Jan 2025",
  },
  {
    id: "DOS-2024-003",
    title: "Litige foncier Katanga",
    client: "M. Tshisekedi",
    status: "urgent",
    type: "Foncier",
    nextHearing: "10 Jan 2025",
  },
  {
    id: "DOS-2024-004",
    title: "Contrat de travail Entreprise X",
    client: "Entreprise X SARL",
    status: "termine",
    type: "Travail",
    nextHearing: "-",
  },
];

const statusConfig = {
  en_cours: { label: "En cours", className: "bg-primary/10 text-primary border-primary/20" },
  en_attente: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
  urgent: { label: "Urgent", className: "bg-destructive/10 text-destructive border-destructive/20" },
  termine: { label: "Terminé", className: "bg-success/10 text-success border-success/20" },
};

export function RecentCases() {
  return (
    <div className="rounded-xl border bg-card shadow-sm opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold">Dossiers récents</h3>
          <p className="text-sm text-muted-foreground">Dernières affaires actives</p>
        </div>
        <Button variant="ghost" size="sm" className="gap-2">
          Voir tout <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="divide-y divide-border">
        {cases.map((caseItem, index) => {
          const status = statusConfig[caseItem.status as keyof typeof statusConfig];
          return (
            <div 
              key={caseItem.id} 
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground">{caseItem.id}</span>
                    <Badge variant="outline" className={cn("text-xs", status.className)}>
                      {status.label}
                    </Badge>
                  </div>
                  <h4 className="mt-1 font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {caseItem.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{caseItem.client}</span>
                    <span className="text-xs">•</span>
                    <span>{caseItem.type}</span>
                    <span className="text-xs">•</span>
                    <span>Audience: {caseItem.nextHearing}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

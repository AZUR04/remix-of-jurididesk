import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Filter, 
  FolderOpen,
  MoreHorizontal,
  Calendar,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

const cases = [
  {
    id: "DOS-2024-001",
    title: "Société Minière ABC c/ État Congolais",
    client: "Société Minière ABC",
    status: "en_cours",
    type: "Commercial",
    createdAt: "05 Jan 2024",
    nextHearing: "15 Jan 2025",
    lawyer: "Me. Kabongo",
  },
  {
    id: "DOS-2024-002",
    title: "Succession Mwamba",
    client: "Famille Mwamba",
    status: "en_attente",
    type: "Civil",
    createdAt: "12 Dec 2023",
    nextHearing: "22 Jan 2025",
    lawyer: "Me. Kabongo",
  },
  {
    id: "DOS-2024-003",
    title: "Litige foncier Katanga",
    client: "M. Tshisekedi",
    status: "urgent",
    type: "Foncier",
    createdAt: "20 Nov 2023",
    nextHearing: "10 Jan 2025",
    lawyer: "Me. Kabongo",
  },
  {
    id: "DOS-2024-004",
    title: "Contrat de travail Entreprise X",
    client: "Entreprise X SARL",
    status: "termine",
    type: "Travail",
    createdAt: "08 Oct 2023",
    nextHearing: "-",
    lawyer: "Me. Lunda",
  },
  {
    id: "DOS-2024-005",
    title: "Affaire pénale Ngoy",
    client: "M. Ngoy",
    status: "en_cours",
    type: "Pénal",
    createdAt: "15 Jan 2024",
    nextHearing: "28 Jan 2025",
    lawyer: "Me. Kabongo",
  },
];

const statusConfig = {
  en_cours: { label: "En cours", className: "bg-primary/10 text-primary border-primary/20" },
  en_attente: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
  urgent: { label: "Urgent", className: "bg-destructive/10 text-destructive border-destructive/20" },
  termine: { label: "Terminé", className: "bg-success/10 text-success border-success/20" },
};

const filterOptions = ["Tous", "En cours", "Urgent", "En attente", "Terminé"];

export default function Dossiers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");

  return (
    <AppLayout 
      title="Dossiers" 
      subtitle={`${cases.length} dossiers au total`}
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un dossier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtres
          </Button>
          <Button variant="gold" className="gap-2">
            <Plus className="w-4 h-4" />
            Nouveau dossier
          </Button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filterOptions.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter)}
            className="flex-shrink-0"
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cases.map((caseItem, index) => {
          const status = statusConfig[caseItem.status as keyof typeof statusConfig];
          return (
            <div
              key={caseItem.id}
              className="rounded-xl border bg-card p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-muted-foreground">{caseItem.id}</span>
                    <Badge variant="outline" className={cn("ml-2 text-xs", status.className)}>
                      {status.label}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {caseItem.title}
              </h3>

              <p className="text-sm text-muted-foreground mb-4">{caseItem.client}</p>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {caseItem.lawyer}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {caseItem.nextHearing}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  User,
  Calendar,
  MoreHorizontal,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const tasks = [
  {
    id: 1,
    title: "Rédiger conclusions pour affaire Société Minière ABC",
    description: "Préparer les conclusions en réponse aux arguments de la partie adverse",
    assignee: "Stagiaire Mukendi",
    dueDate: "11 Jan 2025",
    priority: "high",
    status: "in_progress",
    dossier: "DOS-2024-001",
  },
  {
    id: 2,
    title: "Recherche jurisprudence succession",
    description: "Trouver les arrêts pertinents sur les successions contestées",
    assignee: "Stagiaire Lunda",
    dueDate: "12 Jan 2025",
    priority: "medium",
    status: "todo",
    dossier: "DOS-2024-002",
  },
  {
    id: 3,
    title: "Préparer dossier audience TGI",
    description: "Compiler tous les documents pour l'audience du 15 janvier",
    assignee: "Stagiaire Mukendi",
    dueDate: "14 Jan 2025",
    priority: "high",
    status: "todo",
    dossier: "DOS-2024-003",
  },
  {
    id: 4,
    title: "Contacter client Mwamba pour signature",
    description: "Organiser la signature des procurations",
    assignee: "Stagiaire Lunda",
    dueDate: "10 Jan 2025",
    priority: "medium",
    status: "done",
    dossier: "DOS-2024-002",
  },
  {
    id: 5,
    title: "Rédiger mise en demeure Entreprise Y",
    description: "Préparer la lettre de mise en demeure pour le client",
    assignee: "Stagiaire Mukendi",
    dueDate: "15 Jan 2025",
    priority: "low",
    status: "todo",
    dossier: "DOS-2024-005",
  },
];

const statusConfig = {
  todo: { label: "À faire", icon: Circle, color: "text-muted-foreground" },
  in_progress: { label: "En cours", icon: Clock, color: "text-warning" },
  done: { label: "Terminé", icon: CheckCircle2, color: "text-success" },
};

const priorityConfig = {
  high: { label: "Haute", className: "bg-destructive/10 text-destructive border-destructive/20" },
  medium: { label: "Moyenne", className: "bg-warning/10 text-warning border-warning/20" },
  low: { label: "Basse", className: "bg-muted text-muted-foreground border-border" },
};

const filterTabs = [
  { id: "all", label: "Toutes" },
  { id: "todo", label: "À faire" },
  { id: "in_progress", label: "En cours" },
  { id: "done", label: "Terminées" },
];

export default function Taches() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "all") return true;
    return task.status === activeFilter;
  });

  const taskCounts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === "todo").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    done: tasks.filter(t => t.status === "done").length,
  };

  return (
    <AppLayout 
      title="Tâches" 
      subtitle="Gestion des tâches des stagiaires"
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une tâche..."
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
            Nouvelle tâche
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filterTabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeFilter === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(tab.id)}
            className="flex-shrink-0 gap-2"
          >
            {tab.label}
            <span className={cn(
              "w-5 h-5 rounded-full text-xs flex items-center justify-center",
              activeFilter === tab.id 
                ? "bg-primary-foreground/20 text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            )}>
              {taskCounts[tab.id as keyof typeof taskCounts]}
            </span>
          </Button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task, index) => {
          const status = statusConfig[task.status as keyof typeof statusConfig];
          const priority = priorityConfig[task.priority as keyof typeof priorityConfig];
          const StatusIcon = status.icon;

          return (
            <div
              key={task.id}
              className={cn(
                "rounded-xl border bg-card p-5 hover:shadow-md transition-all cursor-pointer group opacity-0 animate-fade-in",
                task.status === "done" && "opacity-60"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <button className="mt-0.5 flex-shrink-0">
                  <StatusIcon className={cn("w-6 h-6", status.color)} />
                </button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={cn(
                        "font-semibold text-foreground group-hover:text-primary transition-colors",
                        task.status === "done" && "line-through"
                      )}>
                        {task.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Meta Info */}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                    <Badge variant="outline" className={priority.className}>
                      {task.priority === "high" && <AlertCircle className="w-3 h-3 mr-1" />}
                      {priority.label}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <User className="w-4 h-4" />
                      {task.assignee}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {task.dueDate}
                    </div>
                    <span className="px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground font-mono">
                      {task.dossier}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}

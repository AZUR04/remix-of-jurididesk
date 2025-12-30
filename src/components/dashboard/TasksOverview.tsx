import { CheckCircle2, Circle, AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tasks = [
  {
    id: 1,
    title: "Rédiger conclusions pour affaire ABC",
    assignee: "Stagiaire Mukendi",
    dueDate: "Demain",
    priority: "high",
    completed: false,
  },
  {
    id: 2,
    title: "Recherche jurisprudence succession",
    assignee: "Stagiaire Lunda",
    dueDate: "12 Jan",
    priority: "medium",
    completed: false,
  },
  {
    id: 3,
    title: "Préparer dossier audience TGI",
    assignee: "Stagiaire Mukendi",
    dueDate: "10 Jan",
    priority: "high",
    completed: true,
  },
  {
    id: 4,
    title: "Contacter client Mwamba",
    assignee: "Me. Kabongo",
    dueDate: "Aujourd'hui",
    priority: "medium",
    completed: false,
  },
];

const priorityStyles = {
  high: "text-destructive",
  medium: "text-warning",
  low: "text-muted-foreground",
};

export function TasksOverview() {
  return (
    <div className="rounded-xl border bg-card shadow-sm opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold">Tâches en cours</h3>
          <p className="text-sm text-muted-foreground">Suivi des stagiaires</p>
        </div>
        <Button variant="gold" size="sm">
          + Nouvelle tâche
        </Button>
      </div>

      <div className="divide-y divide-border">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={cn(
              "p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors cursor-pointer",
              task.completed && "opacity-60"
            )}
          >
            <button className="mt-0.5 flex-shrink-0">
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : task.priority === "high" ? (
                <AlertCircle className="w-5 h-5 text-destructive" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={cn(
                "font-medium text-foreground",
                task.completed && "line-through"
              )}>
                {task.title}
              </p>
              <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {task.assignee}
                </span>
                <span className={cn("font-medium", priorityStyles[task.priority as keyof typeof priorityStyles])}>
                  {task.dueDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

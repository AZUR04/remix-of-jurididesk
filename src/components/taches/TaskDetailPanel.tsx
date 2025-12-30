import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Calendar,
  Clock,
  FolderOpen,
  CheckCircle2,
  Circle,
  AlertTriangle,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: string;
  status: string;
  dossier: string;
  createdAt?: string;
  progress?: number;
}

interface TaskDetailPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

const statusOptions = [
  { id: "todo", label: "À faire", icon: Circle, color: "text-muted-foreground" },
  { id: "in_progress", label: "En cours", icon: Clock, color: "text-warning" },
  { id: "done", label: "Terminé", icon: CheckCircle2, color: "text-success" },
];

const priorityStyles: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/10 text-warning",
  low: "bg-muted text-muted-foreground",
};

const priorityLabels: Record<string, string> = {
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
};

const activityHistory = [
  { action: "Statut changé en 'En cours'", user: "Stagiaire Mukendi", time: "Il y a 2h" },
  { action: "Tâche assignée", user: "Me. Kabongo", time: "Hier" },
  { action: "Tâche créée", user: "Me. Kabongo", time: "Il y a 3 jours" },
];

export function TaskDetailPanel({ open, onOpenChange, task }: TaskDetailPanelProps) {
  const { toast } = useToast();

  if (!task) return null;

  const currentStatus = statusOptions.find((s) => s.id === task.status);
  const StatusIcon = currentStatus?.icon || Circle;

  const handleStatusChange = (newStatus: string) => {
    const statusLabel = statusOptions.find((s) => s.id === newStatus)?.label;
    toast({
      title: "Statut mis à jour",
      description: `La tâche est maintenant "${statusLabel}".`,
    });
  };

  const isOverdue = task.status !== "done" && new Date(task.dueDate) < new Date();
  const progress = task.status === "done" ? 100 : task.status === "in_progress" ? 50 : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display">Détails de la tâche</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Status & Priority Header */}
          <div className="flex items-center gap-3">
            <StatusIcon className={cn("w-6 h-6", currentStatus?.color)} />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{task.title}</h3>
            </div>
            <Badge variant="outline" className={priorityStyles[task.priority]}>
              {priorityLabels[task.priority]}
            </Badge>
          </div>

          {/* Overdue Alert */}
          {isOverdue && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">Cette tâche est en retard!</span>
            </div>
          )}

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Status Change */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Changer le statut</label>
            <Select value={task.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    <div className="flex items-center gap-2">
                      <status.icon className={cn("w-4 h-4", status.color)} />
                      {status.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <p className="text-sm text-muted-foreground p-3 rounded-lg border bg-muted/30">
              {task.description || "Aucune description"}
            </p>
          </div>

          {/* Metadata */}
          <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Assigné à:</span>
              <span className="font-medium">{task.assignee}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Échéance:</span>
              <span className={cn("font-medium", isOverdue && "text-destructive")}>
                {task.dueDate}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FolderOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Dossier:</span>
              <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                {task.dossier}
              </span>
            </div>
          </div>

          {/* Activity History */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm">Historique</span>
            </div>
            <div className="space-y-2">
              {activityHistory.map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 text-sm py-2 border-b border-border last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-foreground">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.user} • {log.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => handleStatusChange("done")}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Marquer terminée
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

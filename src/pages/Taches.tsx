import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreateTaskDialog } from "@/components/taches/CreateTaskDialog";
import { TaskDetailPanel } from "@/components/taches/TaskDetailPanel";
import { UserTaskHistory } from "@/components/taches/UserTaskHistory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  User,
  Calendar,
  MoreHorizontal,
  AlertCircle,
  AlertTriangle,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const allTasks = [
  {
    id: 1,
    title: "Rédiger conclusions pour affaire Société Minière ABC",
    description: "Préparer les conclusions en réponse aux arguments de la partie adverse",
    assignee: "Stagiaire Mukendi",
    assigneeId: "mukendi",
    dueDate: "11 Jan 2025",
    priority: "high",
    status: "in_progress",
    dossier: "DOS-2025-001",
    createdAt: "8 Jan 2025",
  },
  {
    id: 2,
    title: "Recherche jurisprudence succession",
    description: "Trouver les arrêts pertinents sur les successions contestées",
    assignee: "Stagiaire Lunda",
    assigneeId: "lunda",
    dueDate: "12 Jan 2025",
    priority: "medium",
    status: "todo",
    dossier: "DOS-2025-002",
    createdAt: "9 Jan 2025",
  },
  {
    id: 3,
    title: "Préparer dossier audience TGI",
    description: "Compiler tous les documents pour l'audience du 15 janvier",
    assignee: "Stagiaire Mukendi",
    assigneeId: "mukendi",
    dueDate: "14 Jan 2025",
    priority: "high",
    status: "todo",
    dossier: "DOS-2025-003",
    createdAt: "10 Jan 2025",
  },
  {
    id: 4,
    title: "Contacter client Mwamba pour signature",
    description: "Organiser la signature des procurations",
    assignee: "Stagiaire Lunda",
    assigneeId: "lunda",
    dueDate: "10 Jan 2025",
    priority: "medium",
    status: "done",
    dossier: "DOS-2025-002",
    createdAt: "5 Jan 2025",
  },
  {
    id: 5,
    title: "Rédiger mise en demeure Entreprise Y",
    description: "Préparer la lettre de mise en demeure pour le client",
    assignee: "Stagiaire Mukendi",
    assigneeId: "mukendi",
    dueDate: "15 Jan 2025",
    priority: "low",
    status: "todo",
    dossier: "DOS-2025-005",
    createdAt: "10 Jan 2025",
  },
  {
    id: 6,
    title: "Analyse contrat commercial",
    description: "Réviser le contrat et identifier les clauses problématiques",
    assignee: "Stagiaire Tshimanga",
    assigneeId: "tshimanga",
    dueDate: "9 Jan 2025",
    priority: "high",
    status: "in_progress",
    dossier: "DOS-2025-004",
    createdAt: "6 Jan 2025",
  },
];

const userStats = [
  { id: "all", name: "Tous les stagiaires", initials: "TS", totalTasks: 6, completedTasks: 1, inProgressTasks: 2, overdueTasks: 1 },
  { id: "mukendi", name: "Stagiaire Mukendi", initials: "SM", totalTasks: 3, completedTasks: 0, inProgressTasks: 1, overdueTasks: 0 },
  { id: "lunda", name: "Stagiaire Lunda", initials: "SL", totalTasks: 2, completedTasks: 1, inProgressTasks: 0, overdueTasks: 0 },
  { id: "tshimanga", name: "Stagiaire Tshimanga", initials: "ST", totalTasks: 1, completedTasks: 0, inProgressTasks: 1, overdueTasks: 1 },
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
  { id: "overdue", label: "En retard" },
];

export default function Taches() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedTask, setSelectedTask] = useState<typeof allTasks[0] | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Simulated "today" for demo
  const today = new Date("2025-01-10");

  // Check if task is overdue
  const isOverdue = (task: typeof allTasks[0]) => {
    if (task.status === "done") return false;
    const dueDate = new Date(task.dueDate.replace(/(\d+) (\w+) (\d+)/, "$2 $1, $3"));
    return dueDate < today;
  };

  // Filter tasks
  const filteredTasks = allTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesUser = selectedUser === "all" || task.assigneeId === selectedUser;
    
    let matchesFilter = true;
    if (activeFilter === "overdue") {
      matchesFilter = isOverdue(task);
    } else if (activeFilter !== "all") {
      matchesFilter = task.status === activeFilter;
    }
    
    return matchesSearch && matchesUser && matchesFilter;
  });

  const taskCounts = {
    all: allTasks.filter(t => selectedUser === "all" || t.assigneeId === selectedUser).length,
    todo: allTasks.filter(t => t.status === "todo" && (selectedUser === "all" || t.assigneeId === selectedUser)).length,
    in_progress: allTasks.filter(t => t.status === "in_progress" && (selectedUser === "all" || t.assigneeId === selectedUser)).length,
    done: allTasks.filter(t => t.status === "done" && (selectedUser === "all" || t.assigneeId === selectedUser)).length,
    overdue: allTasks.filter(t => isOverdue(t) && (selectedUser === "all" || t.assigneeId === selectedUser)).length,
  };

  const handleOpenDetail = (task: typeof allTasks[0]) => {
    setSelectedTask(task);
    setDetailOpen(true);
  };

  const handleStatusChange = (taskId: number, newStatus: string) => {
    toast({
      title: "Statut mis à jour",
      description: `La tâche est maintenant "${statusConfig[newStatus as keyof typeof statusConfig].label}".`,
    });
  };

  return (
    <AppLayout 
      title="Tâches" 
      subtitle="Gestion et suivi des tâches des stagiaires"
    >
      {/* Deadline Alerts */}
      {taskCounts.overdue > 0 && (
        <div className="mb-6 p-4 rounded-xl border bg-destructive/5 border-destructive/20 flex items-center gap-3 animate-fade-in">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-destructive">
              {taskCounts.overdue} tâche{taskCounts.overdue > 1 ? "s" : ""} en retard
            </p>
            <p className="text-sm text-muted-foreground">
              Action requise pour respecter les délais
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
            onClick={() => setActiveFilter("overdue")}
          >
            <Bell className="w-4 h-4 mr-2" />
            Voir
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une tâche..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <CreateTaskDialog />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeFilter === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  "flex-shrink-0 gap-2",
                  tab.id === "overdue" && activeFilter !== tab.id && "border-destructive/30 text-destructive"
                )}
              >
                {tab.label}
                <span className={cn(
                  "w-5 h-5 rounded-full text-xs flex items-center justify-center",
                  activeFilter === tab.id 
                    ? "bg-primary-foreground/20 text-primary-foreground" 
                    : tab.id === "overdue" 
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-muted-foreground"
                )}>
                  {taskCounts[tab.id as keyof typeof taskCounts]}
                </span>
              </Button>
            ))}
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="rounded-xl border bg-card p-12 text-center">
                <Circle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucune tâche trouvée</p>
              </div>
            ) : (
              filteredTasks.map((task, index) => {
                const status = statusConfig[task.status as keyof typeof statusConfig];
                const priority = priorityConfig[task.priority as keyof typeof priorityConfig];
                const StatusIcon = status.icon;
                const taskOverdue = isOverdue(task);

                return (
                  <div
                    key={task.id}
                    onClick={() => handleOpenDetail(task)}
                    className={cn(
                      "rounded-xl border bg-card p-5 hover:shadow-md transition-all cursor-pointer group opacity-0 animate-fade-in",
                      task.status === "done" && "opacity-60",
                      taskOverdue && "border-destructive/30 bg-destructive/5"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Status Icon */}
                      <button 
                        className="mt-0.5 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextStatus = task.status === "todo" ? "in_progress" : task.status === "in_progress" ? "done" : "todo";
                          handleStatusChange(task.id, nextStatus);
                        }}
                      >
                        <StatusIcon className={cn("w-6 h-6", status.color)} />
                      </button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={cn(
                                "font-semibold text-foreground group-hover:text-primary transition-colors",
                                task.status === "done" && "line-through"
                              )}>
                                {task.title}
                              </h3>
                              {taskOverdue && (
                                <Badge variant="destructive" className="text-xs">
                                  En retard
                                </Badge>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon-sm" 
                                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(task.id, "done");
                              }}>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Marquer terminée
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetail(task);
                              }}>
                                Voir détails
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                          <div className={cn(
                            "flex items-center gap-1.5",
                            taskOverdue ? "text-destructive" : "text-muted-foreground"
                          )}>
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
              })
            )}
          </div>
        </div>

        {/* Sidebar - User History */}
        <div className="lg:col-span-1">
          <UserTaskHistory
            users={userStats}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
          />
        </div>
      </div>

      {/* Task Detail Panel */}
      <TaskDetailPanel
        open={detailOpen}
        onOpenChange={setDetailOpen}
        task={selectedTask}
      />
    </AppLayout>
  );
}

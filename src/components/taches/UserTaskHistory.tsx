import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserStats {
  id: string;
  name: string;
  initials: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
}

interface UserTaskHistoryProps {
  users: UserStats[];
  onSelectUser: (userId: string) => void;
  selectedUser: string;
}

export function UserTaskHistory({ users, onSelectUser, selectedUser }: UserTaskHistoryProps) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="font-display font-semibold mb-4">Suivi par stagiaire</h3>
      <div className="space-y-3">
        {users.map((user) => {
          const completionRate = user.totalTasks > 0 
            ? Math.round((user.completedTasks / user.totalTasks) * 100) 
            : 0;

          return (
            <button
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className={cn(
                "w-full p-3 rounded-lg border text-left transition-all hover:shadow-sm",
                selectedUser === user.id 
                  ? "bg-primary/5 border-primary/30" 
                  : "bg-muted/30 hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.totalTasks} tâche{user.totalTasks > 1 ? "s" : ""} assignée{user.totalTasks > 1 ? "s" : ""}
                  </p>
                </div>
                {user.overdueTasks > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {user.overdueTasks} en retard
                  </Badge>
                )}
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-medium">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-1.5" />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Circle className="w-3 h-3" />
                  <span>{user.totalTasks - user.completedTasks - user.inProgressTasks} à faire</span>
                </div>
                <div className="flex items-center gap-1 text-warning">
                  <Clock className="w-3 h-3" />
                  <span>{user.inProgressTasks} en cours</span>
                </div>
                <div className="flex items-center gap-1 text-success">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{user.completedTasks} terminée{user.completedTasks > 1 ? "s" : ""}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

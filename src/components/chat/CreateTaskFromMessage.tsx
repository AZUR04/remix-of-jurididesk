import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckSquare, Calendar, User, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateTaskFromMessageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageContent: string;
  caseName?: string;
}

const priorities = [
  { id: "low", label: "Basse", color: "text-muted-foreground" },
  { id: "medium", label: "Moyenne", color: "text-warning" },
  { id: "high", label: "Haute", color: "text-destructive" },
];

const teamMembers = [
  { id: "mukendi", name: "Stagiaire Mukendi" },
  { id: "lunda", name: "Stagiaire Lunda" },
  { id: "tshimanga", name: "Stagiaire Tshimanga" },
];

export function CreateTaskFromMessage({
  open,
  onOpenChange,
  messageContent,
  caseName,
}: CreateTaskFromMessageProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(messageContent);
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Titre requis",
        description: "Veuillez saisir un titre pour la tâche.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Tâche créée",
      description: `La tâche "${title}" a été assignée.`,
    });

    setTitle("");
    setDescription("");
    setAssignee("");
    setPriority("medium");
    setDueDate("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-primary" />
            Créer une tâche
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Case Reference */}
          {caseName && (
            <div className="p-3 rounded-lg border bg-muted/30 text-sm">
              <span className="text-muted-foreground">Dossier: </span>
              <span className="font-medium">{caseName}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="task-title">Titre de la tâche *</Label>
            <Input
              id="task-title"
              placeholder="Ex: Analyser la jurisprudence"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description (pre-filled with message) */}
          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              placeholder="Détails de la tâche..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Pré-rempli avec le contenu du message
            </p>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Assigner à
            </Label>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un membre" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Priorité
            </Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <span className={p.color}>{p.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="task-due" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Échéance
            </Label>
            <Input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="gold">
              Créer la tâche
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

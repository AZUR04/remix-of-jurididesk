import { useState } from "react";
import { 
  X, 
  Edit2, 
  Calendar, 
  User, 
  MapPin, 
  Tag, 
  Clock,
  Plus,
  FileText,
  MessageSquare,
  CheckCircle2,
  Circle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface CaseDetailPanelProps {
  caseData: {
    id: string;
    title: string;
    client: string;
    status: string;
    type: string;
    lawyer: string;
    jurisdiction?: string;
    createdAt: string;
    nextHearing: string;
  };
  onClose: () => void;
}

const procedureSteps = [
  { id: 1, title: "Ouverture du dossier", date: "05 Jan 2024", completed: true },
  { id: 2, title: "Assignation déposée", date: "10 Jan 2024", completed: true },
  { id: 3, title: "Conclusions adverses reçues", date: "20 Jan 2024", completed: true },
  { id: 4, title: "Réponse aux conclusions", date: "En cours", completed: false, current: true },
  { id: 5, title: "Audience de plaidoirie", date: "15 Jan 2025", completed: false },
  { id: 6, title: "Délibéré / Jugement", date: "-", completed: false },
];

const actionHistory = [
  { id: 1, action: "Document ajouté", detail: "Conclusions en réponse.pdf", user: "Me. Kabongo", date: "08 Jan 2025, 14:32" },
  { id: 2, action: "Note ajoutée", detail: "Client confirmé disponibilité pour audience", user: "Stagiaire Mukendi", date: "07 Jan 2025, 10:15" },
  { id: 3, action: "Étape validée", detail: "Conclusions adverses reçues", user: "Me. Kabongo", date: "20 Jan 2024, 16:45" },
  { id: 4, action: "Audience planifiée", detail: "15 Jan 2025 - Tribunal de Commerce", user: "Me. Kabongo", date: "15 Jan 2024, 09:00" },
  { id: 5, action: "Dossier créé", detail: "Ouverture du dossier", user: "Me. Kabongo", date: "05 Jan 2024, 11:20" },
];

const notes = [
  { id: 1, content: "Client souhaite un règlement amiable si possible", author: "Me. Kabongo", date: "06 Jan 2025" },
  { id: 2, content: "Documents complémentaires demandés au client", author: "Stagiaire Mukendi", date: "03 Jan 2025" },
];

const statusConfig = {
  en_cours: { label: "En cours", className: "bg-primary/10 text-primary border-primary/20" },
  en_attente: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
  urgent: { label: "Urgent", className: "bg-destructive/10 text-destructive border-destructive/20" },
  termine: { label: "Terminé", className: "bg-success/10 text-success border-success/20" },
};

export function CaseDetailPanel({ caseData, onClose }: CaseDetailPanelProps) {
  const [newNote, setNewNote] = useState("");
  const status = statusConfig[caseData.status as keyof typeof statusConfig];

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-background border-l border-border shadow-2xl z-50 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono text-muted-foreground">{caseData.id}</span>
              <Badge variant="outline" className={cn("text-xs", status.className)}>
                {status.label}
              </Badge>
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground">{caseData.title}</h2>
            <p className="text-muted-foreground mt-1">{caseData.client}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon-sm">
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <User className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Avocat</p>
            <p className="text-sm font-medium">{caseData.lawyer}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Tag className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Type</p>
            <p className="text-sm font-medium">{caseData.type}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <MapPin className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Juridiction</p>
            <p className="text-sm font-medium text-xs">Tribunal Commerce</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-accent/10">
            <Calendar className="w-4 h-4 mx-auto text-accent mb-1" />
            <p className="text-xs text-muted-foreground">Audience</p>
            <p className="text-sm font-medium text-accent">{caseData.nextHearing}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mt-4">
          <Badge variant="secondary">Commercial</Badge>
          <Badge variant="secondary">Confidentiel</Badge>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
            <Plus className="w-3 h-3 mr-1" /> Tag
          </Button>
        </div>
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="procedure" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-6 mt-4 w-fit">
          <TabsTrigger value="procedure">Procédure</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Procedure Steps */}
          <TabsContent value="procedure" className="mt-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Étapes de procédure</h3>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Ajouter étape
              </Button>
            </div>
            <div className="relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
              <div className="space-y-4">
                {procedureSteps.map((step) => (
                  <div key={step.id} className="flex items-start gap-4 relative">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10",
                      step.completed ? "bg-success text-success-foreground" : 
                      step.current ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {step.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : step.current ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </div>
                    <div className={cn(
                      "flex-1 p-3 rounded-lg border",
                      step.current ? "bg-accent/10 border-accent/30" : "bg-card"
                    )}>
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "font-medium",
                          step.completed && "text-muted-foreground"
                        )}>
                          {step.title}
                        </span>
                        <span className="text-xs text-muted-foreground">{step.date}</span>
                      </div>
                      {step.current && (
                        <p className="text-xs text-accent mt-1">En attente de validation</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Action History */}
          <TabsContent value="historique" className="mt-0">
            <h3 className="font-semibold mb-4">Historique des actions</h3>
            <div className="space-y-3">
              {actionHistory.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {item.action.includes("Document") && <FileText className="w-4 h-4 text-primary" />}
                    {item.action.includes("Note") && <MessageSquare className="w-4 h-4 text-primary" />}
                    {item.action.includes("Étape") && <CheckCircle2 className="w-4 h-4 text-success" />}
                    {item.action.includes("Audience") && <Calendar className="w-4 h-4 text-accent" />}
                    {item.action.includes("créé") && <Plus className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.action}</span>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                    <p className="text-xs text-muted-foreground mt-1">par {item.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Notes */}
          <TabsContent value="notes" className="mt-0">
            <h3 className="font-semibold mb-4">Notes du dossier</h3>
            
            {/* Add Note */}
            <div className="mb-6 p-4 rounded-lg border bg-card">
              <Textarea
                placeholder="Ajouter une note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={2}
                className="mb-3"
              />
              <div className="flex justify-end">
                <Button variant="gold" size="sm" disabled={!newNote.trim()}>
                  Ajouter la note
                </Button>
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="p-4 rounded-lg border bg-card">
                  <p className="text-sm text-foreground">{note.content}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">{note.author}</span>
                    <span className="text-xs text-muted-foreground">{note.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

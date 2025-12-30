import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  FileText,
  Download,
  Share2,
  Trash2,
  Clock,
  User,
  FolderOpen,
  Tag,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Document {
  id: number;
  name: string;
  folder: string;
  type: string;
  size: string;
  modifiedAt: string;
  modifiedBy: string;
  category?: string;
  tags?: string[];
}

interface DocumentPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onShare: () => void;
}

const categoryStyles: Record<string, string> = {
  conclusions: "bg-primary/10 text-primary",
  contrat: "bg-accent/10 text-accent",
  pv: "bg-warning/10 text-warning",
  correspondance: "bg-success/10 text-success",
  piece: "bg-destructive/10 text-destructive",
  jurisprudence: "bg-muted text-muted-foreground",
  autre: "bg-muted text-muted-foreground",
};

const categoryLabels: Record<string, string> = {
  conclusions: "Conclusions",
  contrat: "Contrat",
  pv: "PV d'audience",
  correspondance: "Correspondance",
  piece: "Pièce justificative",
  jurisprudence: "Jurisprudence",
  autre: "Autre",
};

const activityLog = [
  { action: "Consulté par", user: "Me. Kabongo", time: "Il y a 30 min" },
  { action: "Modifié par", user: "Stagiaire Mukendi", time: "Il y a 2 heures" },
  { action: "Partagé avec", user: "Me. Lunda", time: "Hier" },
  { action: "Créé par", user: "Me. Kabongo", time: "Il y a 3 jours" },
];

export function DocumentPreview({
  open,
  onOpenChange,
  document,
  onShare,
}: DocumentPreviewProps) {
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<string[]>(document?.tags || ["Important", "À réviser"]);

  if (!document) return null;

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display">Détails du document</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Document Header */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground break-words">
                {document.name}
              </h3>
              <p className="text-sm text-muted-foreground">{document.size}</p>
              {document.category && (
                <Badge
                  variant="outline"
                  className={cn("mt-2", categoryStyles[document.category])}
                >
                  {categoryLabels[document.category] || document.category}
                </Badge>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 gap-2">
              <Eye className="w-4 h-4" />
              Aperçu
            </Button>
            <Button variant="outline" size="sm" className="flex-1 gap-2">
              <Download className="w-4 h-4" />
              Télécharger
            </Button>
            <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={onShare}>
              <Share2 className="w-4 h-4" />
              Partager
            </Button>
          </div>

          {/* Metadata */}
          <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-3 text-sm">
              <FolderOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Dossier:</span>
              <span className="font-medium">{document.folder}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Modifié:</span>
              <span className="font-medium">{document.modifiedAt}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Par:</span>
              <span className="font-medium">{document.modifiedBy}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/20"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter un tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={addTag}>
                Ajouter
              </Button>
            </div>
          </div>

          {/* Activity Log */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Historique d'activité</h4>
            <div className="space-y-2">
              {activityLog.map((log, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0"
                >
                  <div>
                    <span className="text-muted-foreground">{log.action}</span>{" "}
                    <span className="font-medium">{log.user}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delete Action */}
          <Button variant="destructive" className="w-full gap-2">
            <Trash2 className="w-4 h-4" />
            Supprimer le document
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

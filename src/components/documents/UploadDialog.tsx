import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, Image, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const documentCategories = [
  { id: "conclusions", label: "Conclusions", color: "bg-primary/10 text-primary" },
  { id: "contrat", label: "Contrat", color: "bg-accent/10 text-accent" },
  { id: "pv", label: "PV d'audience", color: "bg-warning/10 text-warning" },
  { id: "correspondance", label: "Correspondance", color: "bg-success/10 text-success" },
  { id: "piece", label: "Pièce justificative", color: "bg-destructive/10 text-destructive" },
  { id: "jurisprudence", label: "Jurisprudence", color: "bg-muted text-muted-foreground" },
  { id: "autre", label: "Autre", color: "bg-muted text-muted-foreground" },
];

const cases = [
  { id: "dos-001", name: "DOS-2025-001 - Société Minière ABC" },
  { id: "dos-002", name: "DOS-2025-002 - Succession Mwamba" },
  { id: "dos-003", name: "DOS-2025-003 - Litige foncier Katanga" },
  { id: "templates", name: "Modèles et templates" },
];

interface UploadedFile {
  file: File;
  category: string;
  autoDetected: boolean;
}

function detectCategory(fileName: string): string {
  const lowerName = fileName.toLowerCase();
  if (lowerName.includes("conclusion")) return "conclusions";
  if (lowerName.includes("contrat") || lowerName.includes("convention")) return "contrat";
  if (lowerName.includes("pv") || lowerName.includes("proces")) return "pv";
  if (lowerName.includes("lettre") || lowerName.includes("courrier")) return "correspondance";
  if (lowerName.includes("facture") || lowerName.includes("recu") || lowerName.includes("attestation")) return "piece";
  if (lowerName.includes("jurisprudence") || lowerName.includes("arret")) return "jurisprudence";
  return "autre";
}

export function UploadDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedCase, setSelectedCase] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => {
      const category = detectCategory(file.name);
      return {
        file,
        category,
        autoDetected: category !== "autre",
      };
    });

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFileCategory = (index: number, category: string) => {
    setFiles((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, category, autoDetected: false } : f
      )
    );
  };

  const handleUpload = () => {
    if (files.length === 0) {
      toast({
        title: "Aucun fichier",
        description: "Veuillez sélectionner au moins un fichier.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCase) {
      toast({
        title: "Dossier requis",
        description: "Veuillez sélectionner un dossier de destination.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Documents importés",
      description: `${files.length} fichier(s) ajouté(s) au dossier.`,
    });
    setFiles([]);
    setSelectedCase("");
    setOpen(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gold" className="gap-2">
          <Upload className="w-4 h-4" />
          Importer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Importer des documents</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Drop Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="font-medium text-foreground mb-1">
              Glissez vos fichiers ici
            </p>
            <p className="text-sm text-muted-foreground">
              ou cliquez pour sélectionner (PDF, Word, Excel, Images)
            </p>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="space-y-3">
              <Label>Fichiers sélectionnés ({files.length})</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {files.map((uploadedFile, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {getFileIcon(uploadedFile.file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={uploadedFile.category}
                        onValueChange={(value) => updateFileCategory(index, value)}
                      >
                        <SelectTrigger className="w-40 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {documentCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {uploadedFile.autoDetected && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Check className="w-3 h-3" />
                          Auto
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Destination Case */}
          <div className="space-y-2">
            <Label>Dossier de destination *</Label>
            <Select value={selectedCase} onValueChange={setSelectedCase}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un dossier" />
              </SelectTrigger>
              <SelectContent>
                {cases.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button variant="gold" onClick={handleUpload} disabled={files.length === 0}>
            Importer {files.length > 0 && `(${files.length})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

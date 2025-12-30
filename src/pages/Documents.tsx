import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UploadDialog } from "@/components/documents/UploadDialog";
import { ShareDialog } from "@/components/documents/ShareDialog";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { 
  Search, 
  Grid, 
  List,
  FileText,
  FolderOpen,
  Download,
  Eye,
  Share2,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

const folders = [
  { id: 1, name: "DOS-2025-001 - Société Minière ABC", count: 12 },
  { id: 2, name: "DOS-2025-002 - Succession Mwamba", count: 8 },
  { id: 3, name: "DOS-2025-003 - Litige foncier Katanga", count: 15 },
  { id: 4, name: "Modèles et templates", count: 24 },
];

const allDocuments = [
  { 
    id: 1, 
    name: "Conclusions_ABC_v2.pdf", 
    folder: "DOS-2025-001",
    type: "pdf",
    size: "2.4 MB",
    modifiedAt: "Il y a 2 heures",
    modifiedBy: "Me. Kabongo",
    category: "conclusions",
    tags: ["Urgent", "Final"]
  },
  { 
    id: 2, 
    name: "Contrat_travail_template.docx", 
    folder: "Modèles",
    type: "docx",
    size: "156 KB",
    modifiedAt: "Hier",
    modifiedBy: "Stagiaire Mukendi",
    category: "contrat",
    tags: ["Template"]
  },
  { 
    id: 3, 
    name: "PV_Audience_10Jan.pdf", 
    folder: "DOS-2025-003",
    type: "pdf",
    size: "890 KB",
    modifiedAt: "Il y a 3 jours",
    modifiedBy: "Me. Kabongo",
    category: "pv",
    tags: ["Archivé"]
  },
  { 
    id: 4, 
    name: "Acte_succession_Mwamba.pdf", 
    folder: "DOS-2025-002",
    type: "pdf",
    size: "1.2 MB",
    modifiedAt: "Il y a 5 jours",
    modifiedBy: "Stagiaire Lunda",
    category: "piece",
    tags: ["En attente"]
  },
  { 
    id: 5, 
    name: "Jurisprudence_foncier.pdf", 
    folder: "DOS-2025-003",
    type: "pdf",
    size: "4.8 MB",
    modifiedAt: "Il y a 1 semaine",
    modifiedBy: "Stagiaire Mukendi",
    category: "jurisprudence",
    tags: ["Référence"]
  },
  { 
    id: 6, 
    name: "Lettre_mise_en_demeure.pdf", 
    folder: "DOS-2025-001",
    type: "pdf",
    size: "320 KB",
    modifiedAt: "Il y a 2 semaines",
    modifiedBy: "Me. Lunda",
    category: "correspondance",
    tags: ["Envoyé"]
  },
];

const categoryFilters = [
  { id: "all", label: "Tous" },
  { id: "conclusions", label: "Conclusions" },
  { id: "contrat", label: "Contrats" },
  { id: "pv", label: "PV" },
  { id: "correspondance", label: "Correspondance" },
  { id: "piece", label: "Pièces" },
  { id: "jurisprudence", label: "Jurisprudence" },
];

const categoryStyles: Record<string, string> = {
  conclusions: "bg-primary/10 text-primary",
  contrat: "bg-accent/10 text-accent",
  pv: "bg-warning/10 text-warning",
  correspondance: "bg-success/10 text-success",
  piece: "bg-destructive/10 text-destructive",
  jurisprudence: "bg-muted text-muted-foreground",
};

export default function Documents() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState<typeof allDocuments[0] | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareDocName, setShareDocName] = useState("");

  // Filter documents
  const filteredDocuments = allDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.folder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openPreview = (doc: typeof allDocuments[0]) => {
    setSelectedDocument(doc);
    setPreviewOpen(true);
  };

  const openShare = (docName: string) => {
    setShareDocName(docName);
    setShareOpen(true);
  };

  return (
    <AppLayout 
      title="Documents" 
      subtitle="Gérez et partagez vos fichiers en toute sécurité"
    >
      {/* Actions Bar */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, dossier ou tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex border rounded-lg overflow-hidden">
              <Button 
                variant={viewMode === "grid" ? "default" : "ghost"} 
                size="icon"
                onClick={() => setViewMode("grid")}
                className="rounded-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "ghost"} 
                size="icon"
                onClick={() => setViewMode("list")}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <UploadDialog />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {categoryFilters.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Folders Section */}
      <div className="mb-8">
        <h2 className="font-display text-lg font-semibold mb-4">Dossiers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {folders.map((folder, index) => (
            <div
              key={folder.id}
              className="rounded-xl border bg-card p-4 hover:shadow-md transition-all cursor-pointer group opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {folder.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{folder.count} fichiers</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold">
            Documents {filteredDocuments.length > 0 && `(${filteredDocuments.length})`}
          </h2>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun document trouvé</p>
          </div>
        ) : viewMode === "list" ? (
          <div className="rounded-xl border bg-card overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nom</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Catégorie</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Dossier</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Modifié</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDocuments.map((doc) => (
                  <tr 
                    key={doc.id} 
                    className="hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => openPreview(doc)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {doc.name}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {doc.tags?.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {doc.category && (
                        <Badge variant="outline" className={cn("text-xs", categoryStyles[doc.category])}>
                          {categoryFilters.find((c) => c.id === doc.category)?.label}
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground hidden lg:table-cell">
                      {doc.folder}
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <div>
                        <p className="text-sm text-muted-foreground">{doc.modifiedAt}</p>
                        <p className="text-xs text-muted-foreground">{doc.modifiedBy}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPreview(doc);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={(e) => e.stopPropagation()}>
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openShare(doc.name);
                          }}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredDocuments.map((doc, index) => (
              <div
                key={doc.id}
                className="rounded-xl border bg-card p-4 hover:shadow-md transition-all cursor-pointer group opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => openPreview(doc)}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors mb-1">
                  {doc.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{doc.size}</p>
                {doc.category && (
                  <Badge variant="outline" className={cn("text-xs", categoryStyles[doc.category])}>
                    {categoryFilters.find((c) => c.id === doc.category)?.label}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Preview Sheet */}
      <DocumentPreview
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        document={selectedDocument}
        onShare={() => {
          if (selectedDocument) {
            openShare(selectedDocument.name);
          }
        }}
      />

      {/* Share Dialog */}
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        documentName={shareDocName}
      />
    </AppLayout>
  );
}

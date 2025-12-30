import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Upload, 
  Grid, 
  List,
  FileText,
  FolderOpen,
  MoreHorizontal,
  Download,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

const folders = [
  { id: 1, name: "DOS-2024-001 - Société Minière ABC", count: 12 },
  { id: 2, name: "DOS-2024-002 - Succession Mwamba", count: 8 },
  { id: 3, name: "DOS-2024-003 - Litige foncier Katanga", count: 15 },
  { id: 4, name: "Modèles et templates", count: 24 },
];

const recentDocuments = [
  { 
    id: 1, 
    name: "Conclusions_ABC_v2.pdf", 
    folder: "DOS-2024-001",
    type: "pdf",
    size: "2.4 MB",
    modifiedAt: "Il y a 2 heures",
    modifiedBy: "Me. Kabongo"
  },
  { 
    id: 2, 
    name: "Contrat_travail_template.docx", 
    folder: "Modèles",
    type: "docx",
    size: "156 KB",
    modifiedAt: "Hier",
    modifiedBy: "Stagiaire Mukendi"
  },
  { 
    id: 3, 
    name: "PV_Audience_10Jan.pdf", 
    folder: "DOS-2024-003",
    type: "pdf",
    size: "890 KB",
    modifiedAt: "Il y a 3 jours",
    modifiedBy: "Me. Kabongo"
  },
  { 
    id: 4, 
    name: "Acte_succession_Mwamba.pdf", 
    folder: "DOS-2024-002",
    type: "pdf",
    size: "1.2 MB",
    modifiedAt: "Il y a 5 jours",
    modifiedBy: "Stagiaire Lunda"
  },
  { 
    id: 5, 
    name: "Jurisprudence_foncier.pdf", 
    folder: "DOS-2024-003",
    type: "pdf",
    size: "4.8 MB",
    modifiedAt: "Il y a 1 semaine",
    modifiedBy: "Stagiaire Mukendi"
  },
];

const typeIcons = {
  pdf: "📄",
  docx: "📝",
  xlsx: "📊",
};

export default function Documents() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppLayout 
      title="Documents" 
      subtitle="Gérez tous vos fichiers"
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un document..."
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
          <Button variant="gold" className="gap-2">
            <Upload className="w-4 h-4" />
            Importer
          </Button>
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

      {/* Recent Documents */}
      <div>
        <h2 className="font-display text-lg font-semibold mb-4">Documents récents</h2>
        <div className="rounded-xl border bg-card overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nom</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Dossier</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Taille</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Modifié</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentDocuments.map((doc) => (
                <tr 
                  key={doc.id} 
                  className="hover:bg-muted/50 transition-colors cursor-pointer group"
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
                        <p className="text-xs text-muted-foreground md:hidden">{doc.folder}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">
                    {doc.folder}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground hidden lg:table-cell">
                    {doc.size}
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <div>
                      <p className="text-sm text-muted-foreground">{doc.modifiedAt}</p>
                      <p className="text-xs text-muted-foreground">{doc.modifiedBy}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon-sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

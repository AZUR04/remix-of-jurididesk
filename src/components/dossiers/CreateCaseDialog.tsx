import { useState } from "react";
import { X } from "lucide-react";
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

interface CreateCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const caseTypes = ["Commercial", "Civil", "Pénal", "Foncier", "Travail", "Famille", "Administratif"];
const jurisdictions = ["Tribunal de Commerce", "Tribunal de Grande Instance", "Tribunal de Paix", "Cour d'Appel", "Cour de Cassation"];
const lawyers = ["Me. Kabongo", "Me. Lunda", "Me. Mukendi"];

export function CreateCaseDialog({ open, onOpenChange }: CreateCaseDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    clientContact: "",
    caseType: "",
    jurisdiction: "",
    lawyer: "",
    description: "",
    tags: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Creating case:", formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Nouveau dossier</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Client Info */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Informations client
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Nom du client *</Label>
                <Input
                  id="client"
                  placeholder="Société ou particulier"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientContact">Contact</Label>
                <Input
                  id="clientContact"
                  placeholder="Téléphone ou email"
                  value={formData.clientContact}
                  onChange={(e) => setFormData({ ...formData, clientContact: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Case Info */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Informations dossier
            </h4>
            <div className="space-y-2">
              <Label htmlFor="title">Intitulé de l'affaire *</Label>
              <Input
                id="title"
                placeholder="Ex: Société X c/ État Congolais"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type d'affaire *</Label>
                <Select 
                  value={formData.caseType} 
                  onValueChange={(value) => setFormData({ ...formData, caseType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {caseTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Juridiction *</Label>
                <Select 
                  value={formData.jurisdiction} 
                  onValueChange={(value) => setFormData({ ...formData, jurisdiction: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {jurisdictions.map((j) => (
                      <SelectItem key={j} value={j}>{j}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Avocat responsable *</Label>
              <Select 
                value={formData.lawyer} 
                onValueChange={(value) => setFormData({ ...formData, lawyer: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {lawyers.map((lawyer) => (
                    <SelectItem key={lawyer} value={lawyer}>{lawyer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description & Tags */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Notes et classification
            </h4>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Résumé de l'affaire..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
              <Input
                id="tags"
                placeholder="urgent, confidentiel, pro-bono"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="gold">
              Créer le dossier
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

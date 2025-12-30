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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Calendar, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CreateEventDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Événement créé",
      description: "L'événement a été ajouté au calendrier.",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gold" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Événement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Nouvel événement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Event Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'événement *</Label>
            <Input id="title" placeholder="Ex: Audience TGI Kinshasa" required />
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label>Type d'événement *</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="audience">Audience</SelectItem>
                <SelectItem value="meeting">Réunion</SelectItem>
                <SelectItem value="deadline">Échéance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="date" type="date" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Heure *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="time" type="time" className="pl-10" required />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label>Durée estimée</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la durée" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30m">30 minutes</SelectItem>
                <SelectItem value="1h">1 heure</SelectItem>
                <SelectItem value="2h">2 heures</SelectItem>
                <SelectItem value="3h">3 heures</SelectItem>
                <SelectItem value="half-day">Demi-journée</SelectItem>
                <SelectItem value="full-day">Journée entière</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="location" placeholder="Ex: Tribunal de Commerce, Kinshasa" className="pl-10" />
            </div>
          </div>

          {/* Associated Case */}
          <div className="space-y-2">
            <Label>Dossier associé</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Lier à un dossier (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dos-001">DOS-2025-001 - Société Minière ABC</SelectItem>
                <SelectItem value="dos-002">DOS-2025-002 - Litige foncier Katanga</SelectItem>
                <SelectItem value="dos-003">DOS-2025-003 - Succession Mwamba</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lawyer */}
          <div className="space-y-2">
            <Label>Avocat responsable</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Assigner un avocat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kabongo">Me. Kabongo</SelectItem>
                <SelectItem value="lunda">Me. Lunda</SelectItem>
                <SelectItem value="mukendi">Me. Mukendi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Informations supplémentaires..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="gold">
              Créer l'événement
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

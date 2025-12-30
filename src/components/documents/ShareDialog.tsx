import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Share2, Copy, Check, Lock, Eye, Download, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentName: string;
}

const teamMembers = [
  { id: "kabongo", name: "Me. Kabongo", role: "Avocat associé", initials: "MK" },
  { id: "lunda", name: "Me. Lunda", role: "Avocat", initials: "ML" },
  { id: "mukendi", name: "Stagiaire Mukendi", role: "Stagiaire", initials: "SM" },
  { id: "tshimanga", name: "Stagiaire Tshimanga", role: "Stagiaire", initials: "ST" },
  { id: "admin", name: "Admin Cabinet", role: "Secrétariat", initials: "AC" },
];

const permissions = [
  { id: "view", label: "Lecture seule", icon: Eye, description: "Peut consulter" },
  { id: "download", label: "Téléchargement", icon: Download, description: "Peut télécharger" },
  { id: "edit", label: "Modification", icon: Edit, description: "Peut modifier" },
];

export function ShareDialog({ open, onOpenChange, documentName }: ShareDialogProps) {
  const { toast } = useToast();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [permission, setPermission] = useState("view");
  const [copied, setCopied] = useState(false);
  const [expiresIn, setExpiresIn] = useState("never");

  const toggleMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleShare = () => {
    if (selectedMembers.length === 0) {
      toast({
        title: "Aucun destinataire",
        description: "Veuillez sélectionner au moins un membre.",
        variant: "destructive",
      });
      return;
    }

    const permissionLabel = permissions.find((p) => p.id === permission)?.label;
    toast({
      title: "Document partagé",
      description: `Accès "${permissionLabel}" accordé à ${selectedMembers.length} membre(s).`,
    });
    setSelectedMembers([]);
    onOpenChange(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://jurididesk.app/doc/${Date.now()}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Lien copié",
      description: "Le lien sécurisé a été copié dans le presse-papier.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Partager le document
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Document Info */}
          <div className="p-3 rounded-lg border bg-muted/30">
            <p className="font-medium text-sm">{documentName}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              Partage interne sécurisé
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-3">
            <Label>Membres de l'équipe</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleMember(member.id)}
                >
                  <Checkbox
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={() => toggleMember(member.id)}
                  />
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Permission Level */}
          <div className="space-y-2">
            <Label>Niveau d'accès</Label>
            <Select value={permission} onValueChange={setPermission}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {permissions.map((perm) => (
                  <SelectItem key={perm.id} value={perm.id}>
                    <div className="flex items-center gap-2">
                      <perm.icon className="w-4 h-4" />
                      {perm.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expiration */}
          <div className="space-y-2">
            <Label>Expiration du partage</Label>
            <Select value={expiresIn} onValueChange={setExpiresIn}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Pas d'expiration</SelectItem>
                <SelectItem value="1d">1 jour</SelectItem>
                <SelectItem value="7d">7 jours</SelectItem>
                <SelectItem value="30d">30 jours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <Label>Lien sécurisé</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value="https://jurididesk.app/doc/..."
                className="flex-1 text-xs"
              />
              <Button variant="outline" size="icon" onClick={copyLink}>
                {copied ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="gold" onClick={handleShare}>
            Partager
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Users,
  Shield,
  Lock,
  Cloud,
  HardDrive,
  Plus,
  Trash2,
  Edit,
  Key,
  RefreshCw,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Building,
  Mail,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Users data
const users = [
  { id: 1, name: "Me. Kabongo", email: "kabongo@jurididesk.cd", role: "admin", status: "active", initials: "MK" },
  { id: 2, name: "Me. Lunda", email: "lunda@jurididesk.cd", role: "avocat", status: "active", initials: "ML" },
  { id: 3, name: "Me. Mukendi", email: "mukendi@jurididesk.cd", role: "avocat", status: "active", initials: "MM" },
  { id: 4, name: "Stagiaire Mukendi", email: "s.mukendi@jurididesk.cd", role: "stagiaire", status: "active", initials: "SM" },
  { id: 5, name: "Stagiaire Lunda", email: "s.lunda@jurididesk.cd", role: "stagiaire", status: "active", initials: "SL" },
  { id: 6, name: "Stagiaire Tshimanga", email: "s.tshimanga@jurididesk.cd", role: "stagiaire", status: "inactive", initials: "ST" },
];

const roleConfig = {
  admin: { label: "Administrateur", color: "bg-destructive/10 text-destructive" },
  avocat: { label: "Avocat", color: "bg-primary/10 text-primary" },
  stagiaire: { label: "Stagiaire", color: "bg-accent/10 text-accent" },
};

const permissions = [
  { id: "dossiers_view", label: "Voir les dossiers", admin: true, avocat: true, stagiaire: true },
  { id: "dossiers_create", label: "Créer des dossiers", admin: true, avocat: true, stagiaire: false },
  { id: "dossiers_delete", label: "Supprimer des dossiers", admin: true, avocat: false, stagiaire: false },
  { id: "documents_upload", label: "Importer des documents", admin: true, avocat: true, stagiaire: true },
  { id: "documents_delete", label: "Supprimer des documents", admin: true, avocat: true, stagiaire: false },
  { id: "users_manage", label: "Gérer les utilisateurs", admin: true, avocat: false, stagiaire: false },
  { id: "reporting_view", label: "Voir les rapports", admin: true, avocat: true, stagiaire: false },
  { id: "settings_access", label: "Accéder aux paramètres", admin: true, avocat: false, stagiaire: false },
];

export default function Parametres() {
  const { toast } = useToast();
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupLocation, setBackupLocation] = useState("cloud");
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [addUserOpen, setAddUserOpen] = useState(false);

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos modifications ont été enregistrées.",
    });
  };

  const handleBackupNow = () => {
    toast({
      title: "Sauvegarde en cours",
      description: "La sauvegarde de vos données a démarré.",
    });
  };

  const handleDeleteUser = (userName: string) => {
    toast({
      title: "Utilisateur supprimé",
      description: `${userName} a été retiré du système.`,
    });
  };

  return (
    <AppLayout title="Paramètres" subtitle="Configuration du cabinet">
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Accès</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="gap-2">
            <Cloud className="w-4 h-4" />
            <span className="hidden sm:inline">Sauvegarde</span>
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display">Gestion des utilisateurs</CardTitle>
                <CardDescription>Gérez les membres de votre cabinet</CardDescription>
              </div>
              <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
                <DialogTrigger asChild>
                  <Button variant="gold" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-display">Nouvel utilisateur</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Prénom</Label>
                        <Input placeholder="Prénom" />
                      </div>
                      <div className="space-y-2">
                        <Label>Nom</Label>
                        <Input placeholder="Nom" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="email@jurididesk.cd" />
                    </div>
                    <div className="space-y-2">
                      <Label>Rôle</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="avocat">Avocat</SelectItem>
                          <SelectItem value="stagiaire">Stagiaire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setAddUserOpen(false)}>
                        Annuler
                      </Button>
                      <Button
                        variant="gold"
                        onClick={() => {
                          toast({ title: "Invitation envoyée", description: "L'utilisateur recevra un email d'invitation." });
                          setAddUserOpen(false);
                        }}
                      >
                        Envoyer l'invitation
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{user.name}</p>
                          {user.status === "inactive" && (
                            <Badge variant="outline" className="text-xs">Inactif</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={roleConfig[user.role as keyof typeof roleConfig].color}>
                        {roleConfig[user.role as keyof typeof roleConfig].label}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon-sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm">
                          <Key className="w-4 h-4" />
                        </Button>
                        {user.role !== "admin" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon-sm" className="text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer l'utilisateur?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible. {user.name} perdra tout accès au système.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground"
                                  onClick={() => handleDeleteUser(user.name)}
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & Permissions Tab */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Niveaux d'accès</CardTitle>
              <CardDescription>Configurez les permissions par rôle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Permission</th>
                      <th className="text-center py-3 px-4 text-sm font-medium">
                        <Badge variant="outline" className={roleConfig.admin.color}>Admin</Badge>
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium">
                        <Badge variant="outline" className={roleConfig.avocat.color}>Avocat</Badge>
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium">
                        <Badge variant="outline" className={roleConfig.stagiaire.color}>Stagiaire</Badge>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {permissions.map((perm) => (
                      <tr key={perm.id} className="hover:bg-muted/50">
                        <td className="py-3 px-4 text-sm">{perm.label}</td>
                        <td className="py-3 px-4 text-center">
                          <Switch checked={perm.admin} disabled />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Switch checked={perm.avocat} />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Switch checked={perm.stagiaire} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-6">
                <Button variant="gold" onClick={handleSaveSettings}>
                  Sauvegarder les permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Encryption Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Cryptage des documents
                </CardTitle>
                <CardDescription>Protection des fichiers sensibles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                  <div>
                    <p className="font-medium">Cryptage AES-256</p>
                    <p className="text-sm text-muted-foreground">Chiffrement de bout en bout</p>
                  </div>
                  <Switch checked={encryptionEnabled} onCheckedChange={setEncryptionEnabled} />
                </div>

                {encryptionEnabled && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="p-4 rounded-lg border bg-success/5 border-success/20">
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">Cryptage actif</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tous les documents sont protégés par cryptage AES-256
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Clé de récupération</Label>
                      <div className="flex gap-2">
                        <Input type="password" value="••••••••••••••••••••" readOnly />
                        <Button variant="outline" size="icon">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Conservez cette clé en lieu sûr pour récupérer vos données
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Access Security */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Sécurité des accès
                </CardTitle>
                <CardDescription>Authentification et sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                  <div>
                    <p className="font-medium">Authentification à deux facteurs</p>
                    <p className="text-sm text-muted-foreground">Code SMS ou application</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                  <div>
                    <p className="font-medium">Expiration de session</p>
                    <p className="text-sm text-muted-foreground">Déconnexion automatique</p>
                  </div>
                  <Select defaultValue="4h">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 heure</SelectItem>
                      <SelectItem value="4h">4 heures</SelectItem>
                      <SelectItem value="8h">8 heures</SelectItem>
                      <SelectItem value="24h">24 heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                  <div>
                    <p className="font-medium">Journal d'audit</p>
                    <p className="text-sm text-muted-foreground">Historique des connexions</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir le journal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Backup Tab */}
        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Backup Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Configuration sauvegarde</CardTitle>
                <CardDescription>Paramètres de sauvegarde automatique</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                  <div>
                    <p className="font-medium">Sauvegarde automatique</p>
                    <p className="text-sm text-muted-foreground">Activer les sauvegardes planifiées</p>
                  </div>
                  <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                </div>

                {autoBackup && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-2">
                      <Label>Emplacement</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setBackupLocation("cloud")}
                          className={cn(
                            "p-4 rounded-lg border text-left transition-all",
                            backupLocation === "cloud"
                              ? "border-primary bg-primary/5"
                              : "hover:bg-muted/50"
                          )}
                        >
                          <Cloud className={cn("w-6 h-6 mb-2", backupLocation === "cloud" ? "text-primary" : "text-muted-foreground")} />
                          <p className="font-medium">Cloud</p>
                          <p className="text-xs text-muted-foreground">Stockage sécurisé en ligne</p>
                        </button>
                        <button
                          onClick={() => setBackupLocation("local")}
                          className={cn(
                            "p-4 rounded-lg border text-left transition-all",
                            backupLocation === "local"
                              ? "border-primary bg-primary/5"
                              : "hover:bg-muted/50"
                          )}
                        >
                          <HardDrive className={cn("w-6 h-6 mb-2", backupLocation === "local" ? "text-primary" : "text-muted-foreground")} />
                          <p className="font-medium">Local</p>
                          <p className="text-xs text-muted-foreground">Serveur du cabinet</p>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Fréquence</Label>
                      <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Toutes les heures</SelectItem>
                          <SelectItem value="daily">Quotidienne</SelectItem>
                          <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Backup Status */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display">État des sauvegardes</CardTitle>
                <CardDescription>Dernières sauvegardes et restauration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg border bg-success/5 border-success/20">
                  <div className="flex items-center gap-2 text-success mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Dernière sauvegarde réussie</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Aujourd'hui à 06:00 • 2.4 GB</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Espace utilisé</span>
                    <span className="font-medium">45.2 GB / 100 GB</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>

                <div className="space-y-3">
                  <Label>Historique</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {[
                      { date: "10 Jan 2025, 06:00", size: "2.4 GB", status: "success" },
                      { date: "9 Jan 2025, 06:00", size: "2.3 GB", status: "success" },
                      { date: "8 Jan 2025, 06:00", size: "2.3 GB", status: "success" },
                      { date: "7 Jan 2025, 06:00", size: "2.2 GB", status: "failed" },
                    ].map((backup, i) => (
                      <div key={i} className="flex items-center justify-between text-sm p-2 rounded border bg-muted/30">
                        <div className="flex items-center gap-2">
                          {backup.status === "success" ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                          )}
                          <span>{backup.date}</span>
                        </div>
                        <span className="text-muted-foreground">{backup.size}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2" onClick={handleBackupNow}>
                    <Upload className="w-4 h-4" />
                    Sauvegarder maintenant
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Download className="w-4 h-4" />
                    Restaurer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cabinet Info */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Building className="w-5 h-5" />
                Informations du cabinet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Nom du cabinet</Label>
                  <Input defaultValue="Cabinet Kabongo & Associés" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" defaultValue="contact@cabinet-kabongo.cd" />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input type="tel" defaultValue="+243 XXX XXX XXX" />
                </div>
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label>Adresse</Label>
                  <Input defaultValue="123 Avenue de la Justice, Kinshasa, RDC" />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button variant="gold" onClick={handleSaveSettings}>
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}

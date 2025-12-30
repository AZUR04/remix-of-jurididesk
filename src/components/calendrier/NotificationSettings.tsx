import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { Bell, Smartphone, MessageSquare, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function NotificationSettings() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState({
    appNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: false,
    phoneNumber: "",
    reminderTime: "24h",
  });

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences de notification ont été mises à jour.",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="w-4 h-4" />
          Notifications
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Paramètres de notification</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Reminder Time */}
          <div className="space-y-2">
            <Label>Rappel avant l'événement</Label>
            <Select
              value={settings.reminderTime}
              onValueChange={(value) => setSettings({ ...settings, reminderTime: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 heure avant</SelectItem>
                <SelectItem value="3h">3 heures avant</SelectItem>
                <SelectItem value="24h">24 heures avant</SelectItem>
                <SelectItem value="48h">48 heures avant</SelectItem>
                <SelectItem value="1w">1 semaine avant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notification Channels */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Canaux de notification</Label>

            {/* App Notifications */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Notifications App</p>
                  <p className="text-xs text-muted-foreground">Dans l'application</p>
                </div>
              </div>
              <Switch
                checked={settings.appNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, appNotifications: checked })
                }
              />
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">Email</p>
                  <p className="text-xs text-muted-foreground">Rappels par email</p>
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>

            {/* SMS Notifications */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <p className="font-medium text-sm">SMS</p>
                  <p className="text-xs text-muted-foreground">Messages texte</p>
                </div>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, smsNotifications: checked })
                }
              />
            </div>

            {/* WhatsApp Notifications */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="font-medium text-sm">WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Messages WhatsApp</p>
                </div>
              </div>
              <Switch
                checked={settings.whatsappNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, whatsappNotifications: checked })
                }
              />
            </div>

            {/* Phone Number Input */}
            {(settings.smsNotifications || settings.whatsappNotifications) && (
              <div className="space-y-2 animate-fade-in">
                <Label>Numéro de téléphone</Label>
                <Input
                  type="tel"
                  placeholder="+243 XXX XXX XXX"
                  value={settings.phoneNumber}
                  onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Format international requis pour SMS et WhatsApp
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button variant="gold" onClick={handleSave}>
            Sauvegarder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

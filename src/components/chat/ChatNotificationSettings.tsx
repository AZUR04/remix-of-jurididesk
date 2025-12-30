import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bell, Smartphone, MessageSquare, Mail, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatNotificationSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationName: string;
}

export function ChatNotificationSettings({
  open,
  onOpenChange,
  conversationName,
}: ChatNotificationSettingsProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    muted: false,
    appNotifications: true,
    emailNotifications: false,
    smsNotifications: false,
    whatsappNotifications: false,
  });

  const handleSave = () => {
    toast({
      title: "Notifications mises à jour",
      description: settings.muted 
        ? "Cette conversation est maintenant en sourdine."
        : "Vos préférences ont été sauvegardées.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-sm text-muted-foreground">
            Paramètres pour: <span className="font-medium text-foreground">{conversationName}</span>
          </p>

          {/* Mute Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <VolumeX className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <p className="font-medium text-sm">Mettre en sourdine</p>
                <p className="text-xs text-muted-foreground">Désactiver toutes les notifications</p>
              </div>
            </div>
            <Switch
              checked={settings.muted}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, muted: checked })
              }
            />
          </div>

          {!settings.muted && (
            <div className="space-y-4 animate-fade-in">
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
                    <p className="text-xs text-muted-foreground">Notifications par email</p>
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
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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

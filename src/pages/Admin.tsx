import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionPlan, PLANS } from "@/types/subscription";
import { ActivationCode, createActivationCode, fetchAllActivationCodes } from "@/lib/activationCodes";
import { fetchAdminConversations, fetchConversation, sendMessage, markMessagesAsRead, InternalMessage } from "@/lib/messaging";
import { createNotification } from "@/lib/notifications";
import { cn } from "@/lib/utils";
import {
  Key,
  MessageSquare,
  Send,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  Users,
  Shield,
} from "lucide-react";

const planOptions: SubscriptionPlan[] = ["PREMIUM", "TEAM", "CABINET", "CABINET_XXL"];

export default function Admin() {
  const { user, userData, isAdmin } = useAuth();
  const { toast } = useToast();

  // Code generation
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("PREMIUM");
  const [durationValue, setDurationValue] = useState(30);
  const [durationUnit, setDurationUnit] = useState<"days" | "months">("days");
  const [generating, setGenerating] = useState(false);
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Messaging
  const [conversations, setConversations] = useState<{ userId: string; userName: string; lastMessage: string; unreadCount: number; lastDate: string }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Load codes
  useEffect(() => {
    async function load() {
      setLoadingCodes(true);
      try {
        const data = await fetchAllActivationCodes();
        setCodes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCodes(false);
      }
    }
    if (isAdmin) load();
  }, [isAdmin]);

  // Load conversations
  useEffect(() => {
    async function load() {
      if (!user || !isAdmin) return;
      try {
        const convs = await fetchAdminConversations(user.uid);
        setConversations(convs);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [user, isAdmin]);

  // Load selected conversation messages
  useEffect(() => {
    async function load() {
      if (!user || !selectedUserId) return;
      setLoadingMessages(true);
      try {
        const msgs = await fetchConversation(user.uid, selectedUserId);
        setMessages(msgs);
        // Mark unread as read
        const unread = msgs.filter((m) => !m.read && m.receiverId === user.uid);
        if (unread.length > 0) {
          await markMessagesAsRead(unread.map((m) => m.id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMessages(false);
      }
    }
    load();
  }, [user, selectedUserId]);

  const handleGenerateCode = async () => {
    setGenerating(true);
    try {
      const code = await createActivationCode(selectedPlan, durationValue, durationUnit);
      setCodes((prev) => [code, ...prev]);
      toast({
        title: "Code généré !",
        description: `Code: ${code.code} — Plan: ${selectedPlan}`,
      });
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de générer le code.", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedUserId) return;
    try {
      const msg = await sendMessage(user.uid, userData?.displayName || "Admin", selectedUserId, newMessage.trim());
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
      // Notify user
      await createNotification(selectedUserId, "admin_reply", `L'administrateur vous a répondu.`);
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible d'envoyer le message.", variant: "destructive" });
    }
  };

  if (!isAdmin) {
    return (
      <AppLayout title="Administration" subtitle="Accès restreint">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg font-medium text-muted-foreground">Accès réservé aux administrateurs</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Administration" subtitle="Gestion des codes et messages">
      <Tabs defaultValue="codes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="codes" className="gap-2">
            <Key className="w-4 h-4" /> Codes d'activation
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2">
            <MessageSquare className="w-4 h-4" /> Messages
            {conversations.reduce((acc, c) => acc + c.unreadCount, 0) > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {conversations.reduce((acc, c) => acc + c.unreadCount, 0)}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* CODES TAB */}
        <TabsContent value="codes" className="space-y-6">
          {/* Generate Code Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Key className="w-5 h-5 text-accent" />
                Générer un code d'activation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <Label>Plan</Label>
                  <Select value={selectedPlan} onValueChange={(v) => setSelectedPlan(v as SubscriptionPlan)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {planOptions.map((p) => (
                        <SelectItem key={p} value={p}>{PLANS[p].name} — {PLANS[p].priceLabel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Durée</Label>
                  <Input
                    type="number"
                    min={1}
                    value={durationValue}
                    onChange={(e) => setDurationValue(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Unité</Label>
                  <Select value={durationUnit} onValueChange={(v) => setDurationUnit(v as "days" | "months")}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Jours</SelectItem>
                      <SelectItem value="months">Mois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="gold" onClick={handleGenerateCode} disabled={generating} className="gap-2">
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                  Générer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Codes List */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Codes générés</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingCodes ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
                </div>
              ) : codes.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Aucun code généré</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Code</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plan</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Durée</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Statut</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {codes.map((c) => (
                        <tr key={c.id} className="hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{c.code}</span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{c.planType}</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {c.durationValue} {c.durationUnit === "days" ? "jour(s)" : "mois"}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="py-3 px-4">
                            {c.used ? (
                              <Badge className="bg-success/20 text-success border-success/30 gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Utilisé
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="gap-1">
                                <Clock className="w-3 h-3" /> Disponible
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {!c.used && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyCode(c.code, c.id)}
                                className="gap-1"
                              >
                                {copiedId === c.id ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                                {copiedId === c.id ? "Copié" : "Copier"}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* MESSAGES TAB */}
        <TabsContent value="messages">
          <div className="h-[calc(100vh-16rem)] rounded-xl border bg-card overflow-hidden flex">
            {/* Conversation list */}
            <div className="w-72 border-r border-border flex flex-col">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-sm">Conversations</h3>
              </div>
              <div className="flex-1 overflow-auto">
                {conversations.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground text-center">Aucun message</p>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.userId}
                      onClick={() => setSelectedUserId(conv.userId)}
                      className={cn(
                        "w-full p-4 text-left hover:bg-muted/50 transition-colors border-b border-border/50",
                        selectedUserId === conv.userId && "bg-muted"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate">{conv.userName}</span>
                        {conv.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">{conv.unreadCount}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-1">{conv.lastMessage}</p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
              {!selectedUserId ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Sélectionnez une conversation</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-auto p-4 space-y-3">
                    {loadingMessages ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className={cn("flex", msg.senderId === user?.uid ? "justify-end" : "justify-start")}>
                          <div className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-2.5",
                            msg.senderId === user?.uid
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          )}>
                            <p className="text-sm">{msg.message}</p>
                            <p className={cn(
                              "text-xs mt-1",
                              msg.senderId === user?.uid ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}>
                              {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-4 border-t border-border flex gap-2">
                    <Input
                      placeholder="Répondre..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button variant="gold" size="icon" onClick={handleSendMessage}>
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreateTaskFromMessage } from "@/components/chat/CreateTaskFromMessage";
import { ChatNotificationSettings } from "@/components/chat/ChatNotificationSettings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Send,
  Paperclip,
  MoreHorizontal,
  Check,
  CheckCheck,
  FolderOpen,
  Bell,
  CheckSquare,
  Archive,
  Users,
  MessageSquare,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Conversations by case
const conversations = [
  {
    id: 1,
    name: "DOS-2025-001 - Société Minière ABC",
    type: "case",
    avatar: "ABC",
    lastMessage: "J'ai terminé la recherche sur la jurisprudence",
    time: "Il y a 5 min",
    unread: 2,
    participants: ["Me. Kabongo", "Stagiaire Mukendi"],
    isArchived: false,
  },
  {
    id: 2,
    name: "DOS-2025-002 - Succession Mwamba",
    type: "case",
    avatar: "SM",
    lastMessage: "D'accord, je prépare le dossier",
    time: "Il y a 1h",
    unread: 0,
    participants: ["Me. Lunda", "Stagiaire Lunda"],
    isArchived: false,
  },
  {
    id: 3,
    name: "DOS-2025-003 - Litige Katanga",
    type: "case",
    avatar: "LK",
    lastMessage: "Réunion confirmée pour demain",
    time: "Hier",
    unread: 0,
    participants: ["Me. Kabongo", "Me. Mukendi"],
    isArchived: false,
  },
  {
    id: 4,
    name: "Équipe Cabinet",
    type: "team",
    avatar: "EC",
    lastMessage: "Nouvelles procédures internes",
    time: "Lun",
    unread: 5,
    participants: ["Tous les membres"],
    isArchived: false,
  },
  {
    id: 5,
    name: "DOS-2024-015 - Affaire classée",
    type: "case",
    avatar: "AC",
    lastMessage: "Dossier clôturé",
    time: "15 Déc",
    unread: 0,
    participants: ["Me. Kabongo"],
    isArchived: true,
  },
];

const messagesData: Record<number, Array<{
  id: number;
  sender: string;
  content: string;
  time: string;
  date: string;
  isOwn: boolean;
  status?: string;
}>> = {
  1: [
    {
      id: 1,
      sender: "Stagiaire Mukendi",
      content: "Bonjour Maître, j'ai commencé la recherche sur la jurisprudence concernant les litiges miniers.",
      time: "09:30",
      date: "Aujourd'hui",
      isOwn: false,
    },
    {
      id: 2,
      sender: "Me. Kabongo",
      content: "Parfait. Concentrez-vous sur les arrêts de la Cour de Cassation des 5 dernières années.",
      time: "09:45",
      date: "Aujourd'hui",
      isOwn: true,
      status: "read",
    },
    {
      id: 3,
      sender: "Stagiaire Mukendi",
      content: "Compris. J'ai déjà trouvé 3 arrêts pertinents que je vais analyser.",
      time: "10:15",
      date: "Aujourd'hui",
      isOwn: false,
    },
    {
      id: 4,
      sender: "Stagiaire Mukendi",
      content: "J'ai terminé la recherche sur la jurisprudence. Je vous envoie le document récapitulatif.",
      time: "14:20",
      date: "Aujourd'hui",
      isOwn: false,
    },
  ],
  2: [
    {
      id: 1,
      sender: "Me. Lunda",
      content: "Il faut préparer les documents pour l'audience de la succession Mwamba.",
      time: "11:00",
      date: "Hier",
      isOwn: false,
    },
    {
      id: 2,
      sender: "Stagiaire Lunda",
      content: "D'accord, je prépare le dossier. Quels documents sont prioritaires?",
      time: "11:30",
      date: "Hier",
      isOwn: true,
      status: "read",
    },
  ],
};

export default function Messages() {
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskMessageContent, setTaskMessageContent] = useState("");
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [contextMenuMessage, setContextMenuMessage] = useState<number | null>(null);

  const messages = messagesData[selectedConversation.id] || [];

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArchived = showArchived ? conv.isArchived : !conv.isArchived;
    return matchesSearch && matchesArchived;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé.",
    });
    setNewMessage("");
  };

  const handleCreateTask = (messageContent: string) => {
    setTaskMessageContent(messageContent);
    setTaskDialogOpen(true);
  };

  const handleArchiveConversation = () => {
    toast({
      title: "Conversation archivée",
      description: "La conversation a été déplacée dans les archives.",
    });
  };

  return (
    <AppLayout 
      title="Messages" 
      subtitle="Communication interne par dossier"
    >
      <div className="h-[calc(100vh-12rem)] rounded-xl border bg-card overflow-hidden flex opacity-0 animate-fade-in">
        {/* Conversations List */}
        <div className="w-80 border-r border-border flex flex-col">
          {/* Search & Filter */}
          <div className="p-4 border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={!showArchived ? "default" : "outline"}
                size="sm"
                className="flex-1 gap-2"
                onClick={() => setShowArchived(false)}
              >
                <MessageSquare className="w-4 h-4" />
                Actifs
              </Button>
              <Button
                variant={showArchived ? "default" : "outline"}
                size="sm"
                className="flex-1 gap-2"
                onClick={() => setShowArchived(true)}
              >
                <Archive className="w-4 h-4" />
                Archives
              </Button>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Aucune conversation trouvée
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left border-b border-border/50",
                    selectedConversation.id === conv.id && "bg-muted"
                  )}
                >
                  <div className="relative">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center font-medium text-sm",
                      conv.type === "case" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-accent/10 text-accent"
                    )}>
                      {conv.type === "case" ? (
                        <FolderOpen className="w-5 h-5" />
                      ) : (
                        <Users className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium text-foreground truncate text-sm">{conv.name}</h4>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{conv.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground truncate">
                        {conv.participants.slice(0, 2).join(", ")}
                        {conv.participants.length > 2 && ` +${conv.participants.length - 2}`}
                      </span>
                    </div>
                  </div>
                  {conv.unread > 0 && (
                    <Badge variant="default" className="flex-shrink-0">
                      {conv.unread}
                    </Badge>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                selectedConversation.type === "case" 
                  ? "bg-primary/10 text-primary" 
                  : "bg-accent/10 text-accent"
              )}>
                {selectedConversation.type === "case" ? (
                  <FolderOpen className="w-5 h-5" />
                ) : (
                  <Users className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{selectedConversation.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedConversation.participants.length} participant(s)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setNotificationDialogOpen(true)}
              >
                <Bell className="w-5 h-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card">
                  <DropdownMenuItem onClick={() => setNotificationDialogOpen(true)}>
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Voir le dossier
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleArchiveConversation}>
                    <Archive className="w-4 h-4 mr-2" />
                    Archiver
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun message dans cette conversation</p>
                </div>
              </div>
            ) : (
              <>
                {/* Date separator */}
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {messages[0]?.date}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex group",
                      msg.isOwn ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className="flex items-end gap-2 max-w-[70%]">
                      {!msg.isOwn && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {msg.sender.split(" ").map(n => n[0]).join("")}
                        </div>
                      )}
                      <div>
                        {!msg.isOwn && (
                          <p className="text-xs text-muted-foreground mb-1 ml-1">{msg.sender}</p>
                        )}
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-2.5 relative",
                            msg.isOwn 
                              ? "bg-primary text-primary-foreground rounded-br-md" 
                              : "bg-muted text-foreground rounded-bl-md"
                          )}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <div className={cn(
                            "flex items-center gap-1 mt-1",
                            msg.isOwn ? "justify-end" : "justify-start"
                          )}>
                            <span className={cn(
                              "text-xs",
                              msg.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}>
                              {msg.time}
                            </span>
                            {msg.isOwn && (
                              msg.status === "read" 
                                ? <CheckCheck className="w-3 h-3 text-primary-foreground/70" />
                                : <Check className="w-3 h-3 text-primary-foreground/70" />
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Message Actions */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={msg.isOwn ? "end" : "start"} className="bg-card">
                            <DropdownMenuItem onClick={() => handleCreateTask(msg.content)}>
                              <CheckSquare className="w-4 h-4 mr-2" />
                              Créer une tâche
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                placeholder="Écrire un message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button variant="gold" size="icon" onClick={handleSendMessage}>
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Dialog */}
      <CreateTaskFromMessage
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        messageContent={taskMessageContent}
        caseName={selectedConversation.type === "case" ? selectedConversation.name : undefined}
      />

      {/* Notification Settings Dialog */}
      <ChatNotificationSettings
        open={notificationDialogOpen}
        onOpenChange={setNotificationDialogOpen}
        conversationName={selectedConversation.name}
      />
    </AppLayout>
  );
}

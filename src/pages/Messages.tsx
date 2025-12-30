import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Send,
  Paperclip,
  MoreHorizontal,
  Check,
  CheckCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const conversations = [
  {
    id: 1,
    name: "Stagiaire Mukendi",
    avatar: "SM",
    lastMessage: "J'ai terminé la recherche sur la jurisprudence",
    time: "Il y a 5 min",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Stagiaire Lunda",
    avatar: "SL",
    lastMessage: "D'accord, je prépare le dossier",
    time: "Il y a 1h",
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: "Me. Kabongo",
    avatar: "MK",
    lastMessage: "Réunion confirmée pour demain",
    time: "Hier",
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: "Équipe Dossier ABC",
    avatar: "DA",
    lastMessage: "Nouvelles pièces ajoutées au dossier",
    time: "Lun",
    unread: 5,
    online: false,
  },
];

const messages = [
  {
    id: 1,
    sender: "Stagiaire Mukendi",
    content: "Bonjour Maître, j'ai commencé la recherche sur la jurisprudence concernant les litiges miniers.",
    time: "09:30",
    isOwn: false,
  },
  {
    id: 2,
    sender: "Me. Kabongo",
    content: "Parfait. Concentrez-vous sur les arrêts de la Cour de Cassation des 5 dernières années.",
    time: "09:45",
    isOwn: true,
    status: "read",
  },
  {
    id: 3,
    sender: "Stagiaire Mukendi",
    content: "Compris. J'ai déjà trouvé 3 arrêts pertinents que je vais analyser.",
    time: "10:15",
    isOwn: false,
  },
  {
    id: 4,
    sender: "Stagiaire Mukendi",
    content: "J'ai terminé la recherche sur la jurisprudence. Je vous envoie le document récapitulatif.",
    time: "14:20",
    isOwn: false,
  },
];

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");

  return (
    <AppLayout 
      title="Messages" 
      subtitle="Communication interne"
    >
      <div className="h-[calc(100vh-12rem)] rounded-xl border bg-card overflow-hidden flex opacity-0 animate-fade-in">
        {/* Conversations List */}
        <div className="w-80 border-r border-border flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={cn(
                  "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left",
                  selectedConversation.id === conv.id && "bg-muted"
                )}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary">
                    {conv.avatar}
                  </div>
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground truncate">{conv.name}</h4>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs font-medium flex items-center justify-center flex-shrink-0">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary">
                  {selectedConversation.avatar}
                </div>
                {selectedConversation.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-card" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{selectedConversation.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedConversation.online ? "En ligne" : "Hors ligne"}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.isOwn ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2.5",
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
            ))}
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
                className="flex-1"
              />
              <Button variant="gold" size="icon">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

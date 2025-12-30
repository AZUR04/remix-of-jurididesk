import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventFilters } from "@/components/calendrier/EventFilters";
import { NotificationSettings } from "@/components/calendrier/NotificationSettings";
import { CreateEventDialog } from "@/components/calendrier/CreateEventDialog";
import { 
  ChevronLeft, 
  ChevronRight,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  User,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const allEvents = [
  { id: 1, day: 10, title: "Audience TGI", time: "09:00", type: "audience", lawyer: "kabongo", client: "abc" },
  { id: 2, day: 12, title: "Réunion client Mwamba", time: "14:00", type: "meeting", lawyer: "lunda", client: "mwamba" },
  { id: 3, day: 15, title: "Audience Commerce", time: "10:30", type: "audience", lawyer: "mukendi", client: "congo" },
  { id: 4, day: 18, title: "Dépôt conclusions", time: "11:00", type: "deadline", lawyer: "kabongo", client: "abc" },
  { id: 5, day: 22, title: "Audience Tribunal Paix", time: "09:00", type: "audience", lawyer: "lunda", client: "katanga" },
  { id: 6, day: 10, title: "Réunion préparatoire", time: "08:00", type: "meeting", lawyer: "kabongo", client: "abc" },
  { id: 7, day: 25, title: "Délai appel", time: "23:59", type: "deadline", lawyer: "mukendi", client: "congo" },
  { id: 8, day: 28, title: "Audience Cour d'Appel", time: "10:00", type: "audience", lawyer: "kabongo", client: "katanga" },
];

const upcomingEventsData = [
  {
    id: 1,
    title: "Société Minière ABC c/ État",
    date: "10 Jan 2025",
    time: "09:00 - 12:00",
    location: "Tribunal de Grande Instance, Kinshasa",
    type: "audience",
    lawyer: "kabongo",
    client: "abc",
    hasReminder: true,
  },
  {
    id: 2,
    title: "Réunion avec Famille Mwamba",
    date: "12 Jan 2025",
    time: "14:00 - 15:30",
    location: "Cabinet - Salle A",
    type: "meeting",
    lawyer: "lunda",
    client: "mwamba",
    hasReminder: true,
  },
  {
    id: 3,
    title: "Litige foncier Katanga - Audience",
    date: "15 Jan 2025",
    time: "10:30 - 13:00",
    location: "Tribunal de Commerce, Lubumbashi",
    type: "audience",
    lawyer: "mukendi",
    client: "katanga",
    hasReminder: false,
  },
  {
    id: 4,
    title: "Dépôt conclusions - Congo Trading",
    date: "18 Jan 2025",
    time: "11:00",
    location: "Greffe du Tribunal",
    type: "deadline",
    lawyer: "kabongo",
    client: "congo",
    hasReminder: true,
  },
];

const typeStyles = {
  audience: "bg-primary/10 text-primary border-primary/20",
  meeting: "bg-accent/10 text-accent border-accent/20",
  deadline: "bg-destructive/10 text-destructive border-destructive/20",
};

const typeLabels = {
  audience: "Audience",
  meeting: "Réunion",
  deadline: "Échéance",
};

const lawyerNames: Record<string, string> = {
  kabongo: "Me. Kabongo",
  lunda: "Me. Lunda",
  mukendi: "Me. Mukendi",
};

export default function Calendrier() {
  const [currentDate] = useState(new Date(2025, 0, 1));
  const [selectedLawyer, setSelectedLawyer] = useState("all");
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const currentMonth = currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  // Filter events
  const filteredEvents = allEvents.filter((event) => {
    const matchesLawyer = selectedLawyer === "all" || event.lawyer === selectedLawyer;
    const matchesClient = selectedClient === "all" || event.client === selectedClient;
    const matchesType = selectedType === "all" || event.type === selectedType;
    return matchesLawyer && matchesClient && matchesType;
  });

  const filteredUpcoming = upcomingEventsData.filter((event) => {
    const matchesLawyer = selectedLawyer === "all" || event.lawyer === selectedLawyer;
    const matchesClient = selectedClient === "all" || event.client === selectedClient;
    const matchesType = selectedType === "all" || event.type === selectedType;
    return matchesLawyer && matchesClient && matchesType;
  });

  // Generate calendar days
  const firstDayOfMonth = new Date(2025, 0, 1).getDay();
  const daysInMonth = 31;
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <AppLayout 
      title="Calendrier" 
      subtitle="Gérez vos audiences, réunions et échéances"
    >
      {/* Filters */}
      <EventFilters
        selectedLawyer={selectedLawyer}
        setSelectedLawyer={setSelectedLawyer}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 rounded-xl border bg-card p-6 opacity-0 animate-fade-in">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold capitalize">{currentMonth}</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon-sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">Aujourd'hui</Button>
              <Button variant="outline" size="icon-sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
              <NotificationSettings />
              <CreateEventDialog />
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {daysOfWeek.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              const dayEvents = filteredEvents.filter((e) => e.day === day);
              const isToday = day === 10;

              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-24 p-2 rounded-lg border border-transparent hover:border-border transition-colors cursor-pointer",
                    day && "hover:bg-muted/50",
                    isToday && "bg-accent/10 border-accent/30"
                  )}
                >
                  {day && (
                    <>
                      <span className={cn(
                        "text-sm font-medium",
                        isToday && "text-accent font-bold"
                      )}>
                        {day}
                      </span>
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "text-xs px-1.5 py-0.5 rounded truncate",
                              typeStyles[event.type as keyof typeof typeStyles]
                            )}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{dayEvents.length - 2} autres
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-6 pt-4 border-t">
            <span className="text-sm text-muted-foreground">Légende:</span>
            <div className="flex items-center gap-2">
              <span className={cn("w-3 h-3 rounded", "bg-primary")} />
              <span className="text-sm">Audience</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("w-3 h-3 rounded", "bg-accent")} />
              <span className="text-sm">Réunion</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("w-3 h-3 rounded", "bg-destructive")} />
              <span className="text-sm">Échéance</span>
            </div>
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="rounded-xl border bg-card opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="p-6 border-b border-border">
            <h3 className="font-display text-lg font-semibold">Prochains événements</h3>
            <p className="text-sm text-muted-foreground">
              {filteredUpcoming.length} événement{filteredUpcoming.length > 1 ? "s" : ""} à venir
            </p>
          </div>

          <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
            {filteredUpcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun événement correspondant aux filtres
              </p>
            ) : (
              filteredUpcoming.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", typeStyles[event.type as keyof typeof typeStyles])}
                    >
                      {typeLabels[event.type as keyof typeof typeLabels]}
                    </Badge>
                    {event.hasReminder && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Bell className="w-3 h-3 mr-1" />
                        Rappel actif
                      </div>
                    )}
                  </div>
                  <h4 className="font-medium text-foreground mb-2">{event.title}</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {lawyerNames[event.lawyer]}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

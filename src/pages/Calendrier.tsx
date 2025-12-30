import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  MapPin,
  Calendar as CalendarIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const events = [
  { id: 1, day: 10, title: "Audience TGI", time: "09:00", type: "audience" },
  { id: 2, day: 12, title: "Réunion client", time: "14:00", type: "meeting" },
  { id: 3, day: 15, title: "Audience Commerce", time: "10:30", type: "audience" },
  { id: 4, day: 18, title: "Dépôt conclusions", time: "11:00", type: "deadline" },
  { id: 5, day: 22, title: "Audience Tribunal Paix", time: "09:00", type: "audience" },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Société Minière ABC c/ État",
    date: "10 Jan 2025",
    time: "09:00 - 12:00",
    location: "Tribunal de Grande Instance, Kinshasa",
    type: "audience",
  },
  {
    id: 2,
    title: "Réunion avec Famille Mwamba",
    date: "12 Jan 2025",
    time: "14:00 - 15:30",
    location: "Cabinet - Salle A",
    type: "meeting",
  },
  {
    id: 3,
    title: "Litige foncier Katanga - Audience",
    date: "15 Jan 2025",
    time: "10:30 - 13:00",
    location: "Tribunal de Commerce, Lubumbashi",
    type: "audience",
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

export default function Calendrier() {
  const [currentDate] = useState(new Date(2025, 0, 1));
  const currentMonth = currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  // Generate calendar days
  const firstDayOfMonth = new Date(2025, 0, 1).getDay();
  const daysInMonth = 31;
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <AppLayout 
      title="Calendrier" 
      subtitle="Gérez vos audiences et rendez-vous"
    >
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
              <Button variant="gold" size="sm" className="ml-2 gap-2">
                <Plus className="w-4 h-4" />
                Événement
              </Button>
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
              const dayEvents = events.filter((e) => e.day === day);
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
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="rounded-xl border bg-card opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="p-6 border-b border-border">
            <h3 className="font-display text-lg font-semibold">Prochains événements</h3>
            <p className="text-sm text-muted-foreground">Cette semaine</p>
          </div>

          <div className="p-4 space-y-4">
            {upcomingEvents.map((event) => (
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

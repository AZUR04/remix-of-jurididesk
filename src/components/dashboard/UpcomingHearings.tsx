import { Calendar, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const hearings = [
  {
    id: 1,
    case: "Société Minière ABC c/ État",
    date: "10 Jan",
    time: "09:00",
    court: "Tribunal de Commerce",
    location: "Kinshasa",
    isToday: true,
  },
  {
    id: 2,
    case: "Litige foncier Katanga",
    date: "12 Jan",
    time: "14:30",
    court: "Tribunal de Grande Instance",
    location: "Lubumbashi",
    isToday: false,
  },
  {
    id: 3,
    case: "Succession Mwamba",
    date: "15 Jan",
    time: "10:00",
    court: "Tribunal de Paix",
    location: "Kinshasa",
    isToday: false,
  },
];

export function UpcomingHearings() {
  return (
    <div className="rounded-xl border bg-card shadow-sm opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="p-6 border-b border-border">
        <h3 className="font-display text-lg font-semibold">Prochaines audiences</h3>
        <p className="text-sm text-muted-foreground">Cette semaine</p>
      </div>

      <div className="p-4 space-y-3">
        {hearings.map((hearing) => (
          <div
            key={hearing.id}
            className={cn(
              "p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer",
              hearing.isToday 
                ? "bg-gradient-to-r from-accent/10 to-transparent border-accent/30" 
                : "bg-muted/30 border-transparent hover:border-border"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {hearing.isToday && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent text-accent-foreground">
                      Aujourd'hui
                    </span>
                  )}
                </div>
                <h4 className="mt-1 font-medium text-foreground line-clamp-1">
                  {hearing.case}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">{hearing.court}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {hearing.date}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Clock className="w-4 h-4" />
                  {hearing.time}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {hearing.location}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

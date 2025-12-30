import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Users, Briefcase } from "lucide-react";

interface EventFiltersProps {
  selectedLawyer: string;
  setSelectedLawyer: (value: string) => void;
  selectedClient: string;
  setSelectedClient: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
}

const lawyers = [
  { id: "all", name: "Tous les avocats" },
  { id: "kabongo", name: "Me. Kabongo" },
  { id: "lunda", name: "Me. Lunda" },
  { id: "mukendi", name: "Me. Mukendi" },
];

const clients = [
  { id: "all", name: "Tous les clients" },
  { id: "abc", name: "Société Minière ABC" },
  { id: "mwamba", name: "Famille Mwamba" },
  { id: "congo", name: "Congo Trading SARL" },
  { id: "katanga", name: "Groupe Katanga" },
];

const eventTypes = [
  { id: "all", label: "Tous les types" },
  { id: "audience", label: "Audiences" },
  { id: "meeting", label: "Réunions" },
  { id: "deadline", label: "Échéances" },
];

export function EventFilters({
  selectedLawyer,
  setSelectedLawyer,
  selectedClient,
  setSelectedClient,
  selectedType,
  setSelectedType,
}: EventFiltersProps) {
  const handleReset = () => {
    setSelectedLawyer("all");
    setSelectedClient("all");
    setSelectedType("all");
  };

  const hasFilters = selectedLawyer !== "all" || selectedClient !== "all" || selectedType !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-lg border bg-card mb-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filtres</span>
      </div>

      <Select value={selectedLawyer} onValueChange={setSelectedLawyer}>
        <SelectTrigger className="w-48">
          <Users className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Avocat" />
        </SelectTrigger>
        <SelectContent>
          {lawyers.map((lawyer) => (
            <SelectItem key={lawyer.id} value={lawyer.id}>
              {lawyer.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedClient} onValueChange={setSelectedClient}>
        <SelectTrigger className="w-48">
          <Briefcase className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Client" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-1">
        {eventTypes.map((type) => (
          <Button
            key={type.id}
            variant={selectedType === type.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type.id)}
          >
            {type.label}
          </Button>
        ))}
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleReset} className="ml-auto">
          Réinitialiser
        </Button>
      )}
    </div>
  );
}

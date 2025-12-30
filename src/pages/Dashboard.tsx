import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentCases } from "@/components/dashboard/RecentCases";
import { UpcomingHearings } from "@/components/dashboard/UpcomingHearings";
import { TasksOverview } from "@/components/dashboard/TasksOverview";
import { FolderOpen, Calendar, FileText, CheckSquare } from "lucide-react";

export default function Dashboard() {
  return (
    <AppLayout 
      title="Tableau de bord" 
      subtitle="Bienvenue, Me. Kabongo"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Dossiers actifs"
          value={24}
          icon={FolderOpen}
          trend={{ value: 12, isPositive: true }}
          variant="gold"
          delay={0}
        />
        <StatCard
          title="Audiences ce mois"
          value={8}
          icon={Calendar}
          trend={{ value: 5, isPositive: true }}
          delay={50}
        />
        <StatCard
          title="Documents"
          value={156}
          icon={FileText}
          delay={100}
        />
        <StatCard
          title="Tâches en cours"
          value={12}
          icon={CheckSquare}
          variant="warning"
          delay={150}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentCases />
          <TasksOverview />
        </div>
        <div>
          <UpcomingHearings />
        </div>
      </div>
    </AppLayout>
  );
}

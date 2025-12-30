import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  FolderOpen,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Users,
  FileText,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Stats data
const stats = [
  {
    title: "Dossiers actifs",
    value: 24,
    change: "+3",
    trend: "up",
    icon: FolderOpen,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Dossiers clos (mois)",
    value: 8,
    change: "+2",
    trend: "up",
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Temps moyen/affaire",
    value: "45j",
    change: "-5j",
    trend: "up",
    icon: Clock,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Dossiers problématiques",
    value: 3,
    change: "+1",
    trend: "down",
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
];

// Monthly case data
const monthlyData = [
  { month: "Juil", ouverts: 5, clos: 3 },
  { month: "Août", ouverts: 4, clos: 4 },
  { month: "Sep", ouverts: 7, clos: 5 },
  { month: "Oct", ouverts: 6, clos: 6 },
  { month: "Nov", ouverts: 8, clos: 4 },
  { month: "Déc", ouverts: 5, clos: 7 },
  { month: "Jan", ouverts: 6, clos: 8 },
];

// Case type distribution
const caseTypeData = [
  { name: "Commercial", value: 35, color: "hsl(var(--primary))" },
  { name: "Civil", value: 25, color: "hsl(var(--accent))" },
  { name: "Foncier", value: 20, color: "hsl(var(--warning))" },
  { name: "Pénal", value: 12, color: "hsl(var(--destructive))" },
  { name: "Travail", value: 8, color: "hsl(var(--success))" },
];

// Average time per case type
const avgTimeData = [
  { type: "Commercial", jours: 52 },
  { type: "Civil", jours: 38 },
  { type: "Foncier", jours: 65 },
  { type: "Pénal", jours: 45 },
  { type: "Travail", jours: 28 },
];

// Lawyer performance
const lawyerPerformance = [
  { name: "Me. Kabongo", actifs: 10, clos: 15, enRetard: 1 },
  { name: "Me. Lunda", actifs: 8, clos: 12, enRetard: 0 },
  { name: "Me. Mukendi", actifs: 6, clos: 8, enRetard: 2 },
];

// Problematic cases
const problematicCases = [
  {
    id: "DOS-2024-015",
    title: "Litige foncier Katanga Nord",
    reason: "Délai dépassé de 30 jours",
    lawyer: "Me. Mukendi",
    severity: "high",
  },
  {
    id: "DOS-2024-022",
    title: "Succession Mwamba - Contestation",
    reason: "Documents manquants depuis 15 jours",
    lawyer: "Me. Kabongo",
    severity: "medium",
  },
  {
    id: "DOS-2025-003",
    title: "Entreprise XYZ c/ État",
    reason: "Audience reportée 3 fois",
    lawyer: "Me. Mukendi",
    severity: "high",
  },
];

const severityStyles = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-muted text-muted-foreground",
};

const periods = [
  { id: "7d", label: "7 derniers jours" },
  { id: "30d", label: "30 derniers jours" },
  { id: "90d", label: "3 derniers mois" },
  { id: "1y", label: "Cette année" },
];

export default function Reporting() {
  const [period, setPeriod] = useState("30d");
  const [filterLawyer, setFilterLawyer] = useState("all");

  return (
    <AppLayout
      title="Reporting"
      subtitle="Statistiques et performance du cabinet"
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-lg border bg-card">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filtres</span>
        </div>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {periods.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterLawyer} onValueChange={setFilterLawyer}>
          <SelectTrigger className="w-48">
            <Users className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les avocats</SelectItem>
            <SelectItem value="kabongo">Me. Kabongo</SelectItem>
            <SelectItem value="lunda">Me. Lunda</SelectItem>
            <SelectItem value="mukendi">Me. Mukendi</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="ml-auto gap-2">
          <FileText className="w-4 h-4" />
          Exporter PDF
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="opacity-0 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", stat.bgColor)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  stat.trend === "up" ? "text-success" : "text-destructive"
                )}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold font-display">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly Cases Chart */}
        <Card className="lg:col-span-2 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <CardTitle className="font-display text-lg">Évolution des dossiers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="ouverts" name="Ouverts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="clos" name="Clos" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Case Type Distribution */}
        <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "250ms" }}>
          <CardHeader>
            <CardTitle className="font-display text-lg">Types d'affaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={caseTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {caseTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {caseTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Average Time per Type */}
        <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <CardHeader>
            <CardTitle className="font-display text-lg">Temps moyen par type (jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={avgTimeData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis dataKey="type" type="category" width={80} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value} jours`, "Durée moyenne"]}
                  />
                  <Bar dataKey="jours" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lawyer Performance */}
        <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "350ms" }}>
          <CardHeader>
            <CardTitle className="font-display text-lg">Performance par avocat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lawyerPerformance.map((lawyer) => (
                <div key={lawyer.name} className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">{lawyer.name}</span>
                    {lawyer.enRetard > 0 && (
                      <Badge variant="outline" className="bg-destructive/10 text-destructive text-xs">
                        {lawyer.enRetard} en retard
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{lawyer.actifs}</p>
                      <p className="text-xs text-muted-foreground">Actifs</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-success">{lawyer.clos}</p>
                      <p className="text-xs text-muted-foreground">Clos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent">
                        {Math.round((lawyer.clos / (lawyer.actifs + lawyer.clos)) * 100)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Taux résolution</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Problematic Cases */}
      <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Dossiers problématiques
          </CardTitle>
          <Badge variant="destructive">{problematicCases.length}</Badge>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Référence</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Affaire</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Problème</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Avocat</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sévérité</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {problematicCases.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">{c.id}</span>
                    </td>
                    <td className="py-3 px-4 font-medium">{c.title}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{c.reason}</td>
                    <td className="py-3 px-4 text-sm">{c.lawyer}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={severityStyles[c.severity as keyof typeof severityStyles]}>
                        {c.severity === "high" ? "Critique" : c.severity === "medium" ? "Moyen" : "Faible"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="outline" size="sm">
                        Voir dossier
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}

import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Calendar, 
  FileText, 
  MessageSquare, 
  CheckSquare,
  BarChart3,
  Scale,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", path: "/" },
  { icon: FolderOpen, label: "Dossiers", path: "/dossiers" },
  { icon: Calendar, label: "Calendrier", path: "/calendrier" },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: CheckSquare, label: "Tâches", path: "/taches" },
  { icon: BarChart3, label: "Reporting", path: "/reporting" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "h-screen bg-sidebar flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center flex-shrink-0">
          <Scale className="w-6 h-6 text-primary" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="font-display text-xl font-bold text-sidebar-foreground">JuridiDesk</h1>
            <p className="text-xs text-sidebar-foreground/60">Cabinet d'avocats</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink key={item.path} to={item.path}>
              <Button
                variant={isActive ? "sidebar-active" : "sidebar"}
                className={cn(
                  "w-full transition-all duration-200",
                  collapsed ? "justify-center px-0" : "justify-start"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
                {!collapsed && <span className="animate-fade-in">{item.label}</span>}
              </Button>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <Button
          variant="sidebar"
          className={cn("w-full", collapsed ? "justify-center px-0" : "justify-start")}
          title={collapsed ? "Paramètres" : undefined}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Paramètres</span>}
        </Button>
        <Button
          variant="sidebar"
          className={cn("w-full text-destructive hover:text-destructive", collapsed ? "justify-center px-0" : "justify-start")}
          title={collapsed ? "Déconnexion" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </Button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-muted transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </aside>
  );
}

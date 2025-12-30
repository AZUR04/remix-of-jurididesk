import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  Settings,
  Crown,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { UpgradeModal } from "@/components/subscription/UpgradeModal";

const navItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", path: "/" },
  { icon: FolderOpen, label: "Dossiers", path: "/dossiers" },
  { icon: Calendar, label: "Calendrier", path: "/calendrier" },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: MessageSquare, label: "Messages", path: "/messages", premium: true },
  { icon: CheckSquare, label: "Tâches", path: "/taches", premium: true },
  { icon: BarChart3, label: "Reporting", path: "/reporting", premium: true },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [blockedFeature, setBlockedFeature] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { status } = useSubscription();

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.premium && status === "FREE") {
      e.preventDefault();
      setBlockedFeature(item.label);
      setUpgradeModalOpen(true);
    }
  };

  return (
    <>
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
          const isPremiumLocked = item.premium && status === "FREE";
          return (
            <NavLink key={item.path} to={item.path} onClick={(e) => handleNavClick(item, e)}>
              <Button
                variant={isActive ? "sidebar-active" : "sidebar"}
                className={cn(
                  "w-full transition-all duration-200",
                  collapsed ? "justify-center px-0" : "justify-start",
                  isPremiumLocked && "opacity-60"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
                {!collapsed && (
                  <span className="animate-fade-in flex-1 text-left">{item.label}</span>
                )}
                {!collapsed && isPremiumLocked && (
                  <Crown className="w-4 h-4 text-accent" />
                )}
              </Button>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <NavLink to="/abonnement">
          {({ isActive }) => (
            <Button
              variant={isActive ? "sidebar-active" : "sidebar"}
              className={cn("w-full", collapsed ? "justify-center px-0" : "justify-start")}
              title={collapsed ? "Abonnement" : undefined}
            >
              <CreditCard className={cn("w-5 h-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
              {!collapsed && <span>Abonnement</span>}
            </Button>
          )}
        </NavLink>
        <NavLink to="/parametres">
          {({ isActive }) => (
            <Button
              variant={isActive ? "sidebar-active" : "sidebar"}
              className={cn("w-full", collapsed ? "justify-center px-0" : "justify-start")}
              title={collapsed ? "Paramètres" : undefined}
            >
              <Settings className={cn("w-5 h-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
              {!collapsed && <span>Paramètres</span>}
            </Button>
          )}
        </NavLink>
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

    <UpgradeModal
      open={upgradeModalOpen}
      onOpenChange={setUpgradeModalOpen}
      feature={blockedFeature}
    />
    </>
  );
}

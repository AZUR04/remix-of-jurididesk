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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
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
  const { logout } = useAuth();
  const { 
    plan, 
    currentUsage, 
    limits, 
    isDossierLimitReached, 
    isDocumentLimitReached 
  } = useSubscription();

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.premium && plan === "FREE") {
      e.preventDefault();
      setBlockedFeature(item.label);
      setUpgradeModalOpen(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
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
          const isPremiumLocked = item.premium && plan === "FREE";
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

      {/* Usage Counters for FREE users */}
      {plan === "FREE" && !collapsed && (
        <div className="px-3 py-3 border-t border-sidebar-border space-y-2">
          <p className="text-xs text-sidebar-foreground/60 uppercase tracking-wide px-2">Limites {plan}</p>
          <div 
            className={cn(
              "flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors",
              isDossierLimitReached 
                ? "bg-destructive/20 text-destructive" 
                : "bg-sidebar-accent/50 text-sidebar-foreground"
            )}
            onClick={() => isDossierLimitReached && setUpgradeModalOpen(true)}
          >
            <span className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Dossiers
            </span>
            <span className="flex items-center gap-1 font-medium">
              {currentUsage.dossiers}/{limits.maxDossiers === Infinity ? "∞" : limits.maxDossiers}
              {isDossierLimitReached && <Crown className="w-3 h-3 text-accent" />}
            </span>
          </div>
          <div 
            className={cn(
              "flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors",
              isDocumentLimitReached 
                ? "bg-destructive/20 text-destructive" 
                : "bg-sidebar-accent/50 text-sidebar-foreground"
            )}
            onClick={() => isDocumentLimitReached && setUpgradeModalOpen(true)}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </span>
            <span className="flex items-center gap-1 font-medium">
              {currentUsage.documents}/{limits.maxDocuments === Infinity ? "∞" : limits.maxDocuments}
              {isDocumentLimitReached && <Crown className="w-3 h-3 text-accent" />}
            </span>
          </div>
        </div>
      )}

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
              {!collapsed && plan === "FREE" && (
                <Badge className="ml-auto text-xs bg-accent text-accent-foreground">Upgrade</Badge>
              )}
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
          onClick={handleLogout}
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

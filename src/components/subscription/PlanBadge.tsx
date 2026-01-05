import { Badge } from "@/components/ui/badge";
import { Crown, Shield, Users, Building2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SubscriptionPlan } from "@/types/subscription";

interface PlanBadgeProps {
  plan: SubscriptionPlan;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const planConfig = {
  FREE: {
    icon: Shield,
    label: "FREE",
    className: "bg-muted text-muted-foreground",
  },
  PREMIUM: {
    icon: Crown,
    label: "PREMIUM",
    className: "bg-accent/20 text-accent border-accent/30",
  },
  TEAM: {
    icon: Users,
    label: "TEAM",
    className: "bg-primary/20 text-primary border-primary/30",
  },
  CABINET: {
    icon: Building2,
    label: "CABINET",
    className: "bg-success/20 text-success border-success/30",
  },
  CABINET_XXL: {
    icon: Sparkles,
    label: "CABINET XXL",
    className: "bg-gradient-to-r from-accent/20 to-primary/20 text-accent border-accent/30",
  },
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
};

export function PlanBadge({ plan, size = "md", className }: PlanBadgeProps) {
  const config = planConfig[plan];
  const Icon = config.icon;
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "gap-1 font-medium",
        config.className,
        sizeClasses[size],
        className
      )}
    >
      <Icon className={cn(
        "shrink-0",
        size === "sm" ? "w-3 h-3" : size === "md" ? "w-3.5 h-3.5" : "w-4 h-4"
      )} />
      {config.label}
    </Badge>
  );
}

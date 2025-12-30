import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PremiumBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export function PremiumBadge({ className, size = "md" }: PremiumBadgeProps) {
  return (
    <Badge 
      className={cn(
        "bg-accent/10 text-accent border-accent/20 gap-1",
        size === "sm" && "text-xs px-1.5 py-0",
        className
      )}
    >
      <Crown className={cn("w-3 h-3", size === "sm" && "w-2.5 h-2.5")} />
      PREMIUM
    </Badge>
  );
}

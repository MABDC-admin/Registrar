import { ReactNode } from "react";
import { ArrowRight, TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  badge?: string;
  trend?: "up" | "down";
  showArrow?: boolean;
  delay?: number;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  badge,
  trend,
  showArrow = false,
  delay = 0,
}: StatsCardProps) {
  return (
    <div 
      className="stats-card widget-enter hover-lift"
      style={{ animationDelay: `${delay * 0.1}s`, opacity: 0 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-display font-bold text-foreground">
              {value}
            </span>
            {badge && (
              <span className="badge-rank flex items-center gap-1">
                {trend === "up" && <TrendingUp className="w-3 h-3" />}
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
        {showArrow && (
          <button className="flex-shrink-0 p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}

import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface QuickStatCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  delay?: number;
}

export default function QuickStatCard({ icon, label, value, delay = 0 }: QuickStatCardProps) {
  return (
    <div 
      className="stats-card widget-enter hover-lift flex items-center justify-between"
      style={{ animationDelay: `${delay * 0.1}s`, opacity: 0 }}
    >
      <div className="flex items-center gap-3">
        <div className="text-3xl">{icon}</div>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-display font-bold text-foreground">{value}</span>
        <button className="p-1 hover:bg-muted rounded-full transition-colors">
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

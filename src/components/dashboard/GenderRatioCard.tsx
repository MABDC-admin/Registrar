interface GenderRatioCardProps {
  male: number;
  female: number;
  total: number;
  delay?: number;
}

export default function GenderRatioCard({ male, female, total, delay = 0 }: GenderRatioCardProps) {
  const malePercent = Math.round((male / total) * 100);
  const femalePercent = 100 - malePercent;

  return (
    <div 
      className="stats-card widget-enter hover-lift"
      style={{ animationDelay: `${delay * 0.1}s`, opacity: 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground font-medium">Male/Female Ratio</p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>{total}</span>
          <span className="text-xl">👥</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold text-primary">{malePercent}%</span>
          <span className="text-2xl">👦</span>
          <span className="text-xs text-muted-foreground">Male</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold text-accent">{femalePercent}%</span>
          <span className="text-2xl">👧</span>
          <span className="text-xs text-muted-foreground">Female</span>
        </div>
      </div>
    </div>
  );
}

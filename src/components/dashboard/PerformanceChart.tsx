import { ChevronDown } from "lucide-react";
import owlMascot from "@/assets/owl-mascot.png";

interface PerformanceChartProps {
  highPerformers: number;
  average: number;
  atRisk: number;
  completionRate: number;
  courseProgress: number;
  academicYear?: string;
  delay?: number;
}

export default function PerformanceChart({
  highPerformers,
  average,
  atRisk,
  completionRate,
  courseProgress,
  academicYear = "2025-2026",
  delay = 0,
}: PerformanceChartProps) {
  const total = highPerformers + average + atRisk;
  const highPercent = Math.round((highPerformers / total) * 100);
  const avgPercent = Math.round((average / total) * 100);
  const riskPercent = Math.round((atRisk / total) * 100);

  // Calculate stroke dasharray for donut chart
  const circumference = 2 * Math.PI * 40;
  const highDash = (highPercent / 100) * circumference;
  const avgDash = (avgPercent / 100) * circumference;
  const riskDash = (riskPercent / 100) * circumference;

  return (
    <div 
      className="stats-card widget-enter p-6"
      style={{ animationDelay: `${delay * 0.1}s`, opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Student Performance<br />Overview
        </h3>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Academic Year</p>
          <button className="flex items-center gap-1 text-xl font-display font-bold text-primary">
            {academicYear}
            <span className="text-lg">🌿</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Donut Chart */}
        <div className="relative flex-shrink-0">
          <svg width="160" height="160" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
            />
            {/* At Risk - Orange */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="hsl(var(--performance-risk))"
              strokeWidth="12"
              strokeDasharray={`${riskDash} ${circumference}`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
              className="donut-segment"
              style={{ animationDelay: `${delay * 0.1 + 0.3}s` }}
            />
            {/* Average - Yellow */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="hsl(var(--performance-average))"
              strokeWidth="12"
              strokeDasharray={`${avgDash} ${circumference}`}
              strokeDashoffset={`-${riskDash}`}
              transform="rotate(-90 50 50)"
              className="donut-segment"
              style={{ animationDelay: `${delay * 0.1 + 0.4}s` }}
            />
            {/* High Performers - Green */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="hsl(var(--performance-high))"
              strokeWidth="12"
              strokeDasharray={`${highDash} ${circumference}`}
              strokeDashoffset={`-${riskDash + avgDash}`}
              transform="rotate(-90 50 50)"
              className="donut-segment"
              style={{ animationDelay: `${delay * 0.1 + 0.5}s` }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-display font-bold text-foreground">{highPercent}%</span>
            <span className="text-xs text-muted-foreground">High Performers</span>
          </div>
        </div>

        {/* Right side - Progress bars */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Completion Rate */}
          <div className="flex items-center gap-3">
            <img src={owlMascot} alt="Owl" className="w-12 h-12 object-contain animate-bounce-soft" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Completion Rate</p>
              <div className="flex items-center gap-2">
                <div className="progress-bar flex-1">
                  <div 
                    className="progress-bar-fill animate-progress" 
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <span className="text-lg font-bold text-foreground">{completionRate}%</span>
              </div>
            </div>
          </div>

          {/* Course Progress */}
          <div className="flex items-center gap-3">
            <img src={owlMascot} alt="Owl" className="w-12 h-12 object-contain animate-float" style={{ animationDelay: "0.5s" }} />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Course Progress</p>
              <div className="flex items-center gap-2">
                <div className="progress-bar flex-1">
                  <div 
                    className="progress-bar-fill animate-progress" 
                    style={{ width: `${courseProgress}%`, animationDelay: "0.3s" }}
                  />
                </div>
                <span className="text-lg font-bold text-foreground">{courseProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-performance-average" />
          <span className="text-sm text-muted-foreground">{avgPercent}% Average</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-performance-risk" />
          <span className="text-sm text-muted-foreground">{riskPercent}% At Risk</span>
        </div>
      </div>
    </div>
  );
}

import { ChevronDown } from "lucide-react";

interface AttendanceData {
  present: number;
  absent: number;
  late: number;
  newCount: number;
}

interface AttendanceWidgetProps {
  data: AttendanceData;
  delay?: number;
}

export default function AttendanceWidget({ data, delay = 0 }: AttendanceWidgetProps) {
  return (
    <div 
      className="stats-card widget-enter p-4"
      style={{ animationDelay: `${delay * 0.1}s`, opacity: 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground">Attendance</h3>
        <span className="text-2xl">📊</span>
      </div>
      
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="emoji-indicator cursor-pointer" title="Present">😊</span>
        <span className="emoji-indicator cursor-pointer" title="Good">😃</span>
        <span className="emoji-indicator cursor-pointer" title="Neutral">😐</span>
      </div>

      <button className="flex items-center gap-2 text-sm text-primary font-medium mx-auto">
        <span>{data.newCount} New</span>
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}

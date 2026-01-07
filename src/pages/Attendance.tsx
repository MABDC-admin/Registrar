import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AttendanceRecord {
  id: string;
  studentName: string;
  grade: string;
  date: string;
  status: "present" | "absent" | "late";
}

const initialRecords: AttendanceRecord[] = [
  { id: "1", studentName: "Alex Johnson", grade: "Grade 5", date: "2026-01-04", status: "present" },
  { id: "2", studentName: "Emma Wilson", grade: "Grade 4", date: "2026-01-04", status: "present" },
  { id: "3", studentName: "Liam Brown", grade: "Grade 6", date: "2026-01-04", status: "late" },
  { id: "4", studentName: "Olivia Davis", grade: "Grade 3", date: "2026-01-04", status: "absent" },
  { id: "5", studentName: "Noah Miller", grade: "Grade 5", date: "2026-01-04", status: "present" },
];

export default function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();

  const filteredRecords = records.filter((r) => {
    const matchesSearch = r.studentName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id: string, status: "present" | "absent" | "late") => {
    setRecords(records.map((r) => (r.id === id ? { ...r, status } : r)));
    toast({ title: "Attendance updated" });
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case "present": return "😊";
      case "absent": return "😢";
      case "late": return "😐";
      default: return "❓";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present": return "bg-success/20 text-success";
      case "absent": return "bg-danger/20 text-danger";
      case "late": return "bg-warning/20 text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const stats = {
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    late: records.filter((r) => r.status === "late").length,
  };

  return (
    <DashboardLayout title="Attendance">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Attendance</h2>
            <p className="text-muted-foreground">Track daily student attendance</p>
          </div>
          <Button className="rounded-xl" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="stats-card text-center widget-enter" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <span className="text-3xl mb-2 block">😊</span>
            <span className="text-2xl font-bold text-success">{stats.present}</span>
            <p className="text-sm text-muted-foreground">Present</p>
          </div>
          <div className="stats-card text-center widget-enter" style={{ animationDelay: "0.2s", opacity: 0 }}>
            <span className="text-3xl mb-2 block">😢</span>
            <span className="text-2xl font-bold text-danger">{stats.absent}</span>
            <p className="text-sm text-muted-foreground">Absent</p>
          </div>
          <div className="stats-card text-center widget-enter" style={{ animationDelay: "0.3s", opacity: 0 }}>
            <span className="text-3xl mb-2 block">😐</span>
            <span className="text-2xl font-bold text-warning">{stats.late}</span>
            <p className="text-sm text-muted-foreground">Late</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
              className="pl-10 rounded-xl"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 rounded-xl">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="late">Late</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="stats-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">Student</th>
                  <th className="text-left p-4 font-semibold text-foreground">Grade</th>
                  <th className="text-left p-4 font-semibold text-foreground">Date</th>
                  <th className="text-left p-4 font-semibold text-foreground">Status</th>
                  <th className="text-right p-4 font-semibold text-foreground">Mark As</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr
                    key={record.id}
                    className="border-t border-border hover:bg-muted/30 transition-colors widget-enter"
                    style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getStatusEmoji(record.status)}</span>
                        <span className="font-medium text-foreground">{record.studentName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-foreground">{record.grade}</td>
                    <td className="p-4 text-muted-foreground">{record.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => updateStatus(record.id, "present")}
                          className={`text-2xl transition-transform hover:scale-125 ${record.status === "present" ? "opacity-100" : "opacity-50"}`}
                        >
                          😊
                        </button>
                        <button
                          onClick={() => updateStatus(record.id, "late")}
                          className={`text-2xl transition-transform hover:scale-125 ${record.status === "late" ? "opacity-100" : "opacity-50"}`}
                        >
                          😐
                        </button>
                        <button
                          onClick={() => updateStatus(record.id, "absent")}
                          className={`text-2xl transition-transform hover:scale-125 ${record.status === "absent" ? "opacity-100" : "opacity-50"}`}
                        >
                          😢
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

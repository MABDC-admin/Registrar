import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Record {
  id: string;
  studentName: string;
  grade: string;
  type: "transcript" | "report_card" | "certificate";
  date: string;
  status: "complete" | "pending";
}

const initialRecords: Record[] = [
  { id: "1", studentName: "Alex Johnson", grade: "Grade 5", type: "report_card", date: "2026-01-01", status: "complete" },
  { id: "2", studentName: "Emma Wilson", grade: "Grade 4", type: "transcript", date: "2026-01-02", status: "complete" },
  { id: "3", studentName: "Liam Brown", grade: "Grade 6", type: "certificate", date: "2026-01-03", status: "pending" },
  { id: "4", studentName: "Olivia Davis", grade: "Grade 3", type: "report_card", date: "2026-01-04", status: "complete" },
];

export default function Records() {
  const [records] = useState<Record[]>(initialRecords);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const filteredRecords = records.filter(
    (r) =>
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "transcript": return "📜";
      case "report_card": return "📊";
      case "certificate": return "🏆";
      default: return "📄";
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "transcript": return "Transcript";
      case "report_card": return "Report Card";
      case "certificate": return "Certificate";
      default: return type;
    }
  };

  return (
    <DashboardLayout title="Records">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Academic Records</h2>
            <p className="text-muted-foreground">Manage student transcripts and certificates</p>
          </div>
          <Button className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Generate Record
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records..."
            className="pl-10 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((record, index) => (
            <div
              key={record.id}
              className="stats-card widget-enter hover-lift"
              style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{getTypeIcon(record.type)}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{record.studentName}</h3>
                  <p className="text-sm text-muted-foreground">{record.grade}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {getTypeName(record.type)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === "complete"
                        ? "bg-success/20 text-success"
                        : "bg-warning/20 text-warning-foreground"
                    }`}>
                      {record.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{record.date}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1 rounded-lg">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-lg">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

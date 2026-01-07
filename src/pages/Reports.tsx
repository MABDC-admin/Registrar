import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  lastGenerated?: string;
}

const reportTypes: ReportType[] = [
  { id: "1", title: "Student Enrollment Report", description: "Overview of student enrollment by grade level", icon: <Users className="w-6 h-6" />, lastGenerated: "2026-01-03" },
  { id: "2", title: "Attendance Summary", description: "Monthly attendance statistics and trends", icon: <BarChart3 className="w-6 h-6" />, lastGenerated: "2026-01-02" },
  { id: "3", title: "Academic Performance", description: "Grade distribution and performance metrics", icon: <FileText className="w-6 h-6" />, lastGenerated: "2026-01-01" },
  { id: "4", title: "Financial Report", description: "Fee collection and payment status overview", icon: <DollarSign className="w-6 h-6" />, lastGenerated: "2026-01-04" },
  { id: "5", title: "Teacher Workload", description: "Class assignments and teaching hours", icon: <Users className="w-6 h-6" /> },
  { id: "6", title: "Room Utilization", description: "Classroom usage and availability", icon: <BarChart3 className="w-6 h-6" /> },
];

export default function Reports() {
  const { toast } = useToast();

  const handleGenerate = (title: string) => {
    toast({ title: `Generating ${title}...`, description: "This may take a moment." });
  };

  const handleDownload = (title: string) => {
    toast({ title: `Downloading ${title}` });
  };

  return (
    <DashboardLayout title="Reports">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Reports</h2>
          <p className="text-muted-foreground">Generate and download school reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report, index) => (
            <div
              key={report.id}
              className="stats-card widget-enter hover-lift"
              style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  {report.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                </div>
              </div>
              
              {report.lastGenerated && (
                <p className="text-xs text-muted-foreground mb-4">
                  Last generated: {report.lastGenerated}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-lg"
                  onClick={() => handleGenerate(report.title)}
                >
                  Generate
                </Button>
                {report.lastGenerated && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => handleDownload(report.title)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

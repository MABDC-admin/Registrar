import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, BookOpen, Calendar, ClipboardCheck, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlMascot from "@/assets/owl-mascot.png";
import foxMascot from "@/assets/fox-mascot.png";
import schoolBackground from "@/assets/school-background.png";

interface Grade {
  subject: string;
  grade: string;
  percentage: number;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
}

const mockGrades: Grade[] = [
  { subject: "Mathematics", grade: "A", percentage: 92 },
  { subject: "Science", grade: "A-", percentage: 88 },
  { subject: "English", grade: "B+", percentage: 85 },
  { subject: "History", grade: "A", percentage: 94 },
  { subject: "Art", grade: "A+", percentage: 98 },
];

const mockAssignments: Assignment[] = [
  { id: "1", title: "Math Problem Set #5", subject: "Mathematics", dueDate: "2026-01-08", status: "pending" },
  { id: "2", title: "Science Lab Report", subject: "Science", dueDate: "2026-01-10", status: "pending" },
  { id: "3", title: "Book Report", subject: "English", dueDate: "2026-01-05", status: "submitted" },
];

const mockAttendance = {
  present: 45,
  absent: 2,
  late: 3,
  total: 50,
};

export default function StudentPortal() {
  const [studentName] = useState("Alex Johnson");
  const [grade] = useState("Grade 5");

  const attendancePercentage = Math.round((mockAttendance.present / mockAttendance.total) * 100);

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${schoolBackground})` }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-primary text-primary-foreground p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={owlMascot} alt="Mascot" className="w-10 h-10" />
              <span className="font-display font-bold text-lg">Student Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-primary-foreground">
                <Bell className="w-5 h-5" />
              </Button>
              <Link to="/auth">
                <Button variant="ghost" size="icon" className="text-primary-foreground">
                  <LogOut className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-6 space-y-6">
          {/* Welcome */}
          <div className="stats-card widget-enter flex items-center gap-4" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl">
              👦
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold text-foreground">Welcome, {studentName}!</h1>
              <p className="text-muted-foreground">{grade} • Academic Year 2025-2026</p>
            </div>
            <img src={foxMascot} alt="Fox" className="w-20 h-20 animate-float hidden md:block" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Grades */}
            <div className="lg:col-span-2 stats-card widget-enter" style={{ animationDelay: "0.2s", opacity: 0 }}>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">My Grades</h2>
              </div>
              <div className="space-y-3">
                {mockGrades.map((grade, index) => (
                  <div key={grade.subject} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground w-28">{grade.subject}</span>
                    <div className="flex-1">
                      <div className="progress-bar">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${grade.percentage}%`, animationDelay: `${index * 0.1}s` }}
                        />
                      </div>
                    </div>
                    <span className="text-lg font-bold text-primary w-8">{grade.grade}</span>
                    <span className="text-sm text-muted-foreground w-12">{grade.percentage}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  GPA: <span className="font-bold text-primary text-lg">3.8</span>
                </p>
              </div>
            </div>

            {/* Attendance */}
            <div className="stats-card widget-enter" style={{ animationDelay: "0.3s", opacity: 0 }}>
              <div className="flex items-center gap-2 mb-4">
                <ClipboardCheck className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">My Attendance</h2>
              </div>
              <div className="text-center mb-4">
                <div className="relative inline-flex items-center justify-center">
                  <svg width="120" height="120" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                    <circle 
                      cx="50" cy="50" r="40" fill="none" 
                      stroke="hsl(var(--primary))" strokeWidth="10"
                      strokeDasharray={`${attendancePercentage * 2.51} 251`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      className="donut-segment"
                    />
                  </svg>
                  <span className="absolute text-2xl font-bold text-foreground">{attendancePercentage}%</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <span className="block text-lg font-bold text-success">{mockAttendance.present}</span>
                  <span className="text-muted-foreground">Present</span>
                </div>
                <div>
                  <span className="block text-lg font-bold text-danger">{mockAttendance.absent}</span>
                  <span className="text-muted-foreground">Absent</span>
                </div>
                <div>
                  <span className="block text-lg font-bold text-warning">{mockAttendance.late}</span>
                  <span className="text-muted-foreground">Late</span>
                </div>
              </div>
            </div>
          </div>

          {/* Assignments */}
          <div className="stats-card widget-enter" style={{ animationDelay: "0.4s", opacity: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Upcoming Assignments</h2>
            </div>
            <div className="space-y-3">
              {mockAssignments.map((assignment) => (
                <div 
                  key={assignment.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <span className="text-2xl">📝</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">{assignment.subject} • Due: {assignment.dueDate}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    assignment.status === "pending"
                      ? "bg-warning/20 text-warning-foreground"
                      : assignment.status === "submitted"
                      ? "bg-info/20 text-info"
                      : "bg-success/20 text-success"
                  }`}>
                    {assignment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

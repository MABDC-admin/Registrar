import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import GenderRatioCard from "@/components/dashboard/GenderRatioCard";
import QuickStatCard from "@/components/dashboard/QuickStatCard";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import TasksWidget from "@/components/dashboard/TasksWidget";
import AttendanceWidget from "@/components/dashboard/AttendanceWidget";
import MessagesWidget from "@/components/dashboard/MessagesWidget";
import EventsWidget from "@/components/dashboard/EventsWidget";

const mockTasks = [
  { id: "1", title: "Check Behavior Incidents", count: 5, icon: "📋" },
  { id: "2", title: "Review Late Homework", count: 18, icon: "📝" },
];

const mockMessages = [
  { id: "1", title: "Meeting at 3 PM", icon: "✉️" },
  { id: "2", title: "Grades Updated", icon: "📧" },
];

const mockEvents = [
  { id: "1", title: "Science Fair", date: "April 18", icon: "🔬" },
  { id: "2", title: "Sports Day", date: "April 25", icon: "⚽" },
];

export default function Index() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column - Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Total Enrolled Students */}
          <StatsCard
            title="Total Enrolled Students"
            value={534}
            badge="Rank Increase"
            trend="up"
            subtitle="New Admissions"
            delay={1}
          />

          {/* Gender Ratio */}
          <GenderRatioCard
            male={172}
            female={159}
            total={331}
            delay={2}
          />

          {/* Quick Stats */}
          <QuickStatCard
            icon="📚"
            label="Active Classes"
            value={14}
            delay={3}
          />
          <QuickStatCard
            icon="👨‍🏫"
            label="Active Teachers"
            value={13}
            delay={4}
          />
          <QuickStatCard
            icon="🚪"
            label="Available Rooms"
            value={15}
            delay={5}
          />
        </div>

        {/* Right Column - Performance & Widgets */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* Performance Overview */}
          <PerformanceChart
            highPerformers={62}
            average={23}
            atRisk={10}
            completionRate={72}
            courseProgress={72}
            delay={2}
          />

          {/* Bottom Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TasksWidget tasks={mockTasks} delay={6} />
            
            <div className="space-y-4">
              <AttendanceWidget
                data={{ present: 85, absent: 10, late: 5, newCount: 5 }}
                delay={7}
              />
              <MessagesWidget messages={mockMessages} delay={8} />
            </div>
            
            <EventsWidget events={mockEvents} delay={9} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

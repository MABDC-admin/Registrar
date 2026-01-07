import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "academic" | "sports" | "cultural" | "holiday";
}

const initialEvents: Event[] = [
  { id: "1", title: "Science Fair", date: "2026-01-18", time: "9:00 AM", type: "academic" },
  { id: "2", title: "Sports Day", date: "2026-01-25", time: "8:00 AM", type: "sports" },
  { id: "3", title: "Cultural Festival", date: "2026-02-14", time: "10:00 AM", type: "cultural" },
  { id: "4", title: "Spring Break", date: "2026-03-15", time: "", type: "holiday" },
];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [currentMonth, setCurrentMonth] = useState(0); // January 2026
  const [currentYear] = useState(2026);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", date: "", time: "", type: "academic" as Event["type"] });
  const { toast } = useToast();

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "academic": return "bg-info";
      case "sports": return "bg-success";
      case "cultural": return "bg-accent";
      case "holiday": return "bg-danger";
      default: return "bg-primary";
    }
  };

  const handleSave = () => {
    const newEvent: Event = {
      id: Date.now().toString(),
      ...formData,
    };
    setEvents([...events, newEvent]);
    toast({ title: "Event added successfully" });
    setIsDialogOpen(false);
    setFormData({ title: "", date: "", time: "", type: "academic" });
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    toast({ title: "Event deleted", variant: "destructive" });
  };

  return (
    <DashboardLayout title="Calendar">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">School Calendar</h2>
            <p className="text-muted-foreground">Manage school events and schedules</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-display">Add New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Event Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Science Fair"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time (optional)</Label>
                  <Input
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="9:00 AM"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["academic", "sports", "cultural", "holiday"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: t })}
                        className={`p-2 rounded-xl border-2 transition-all text-sm font-medium capitalize ${
                          formData.type === t
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={handleSave} className="w-full rounded-xl">
                  Add Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2 stats-card widget-enter" style={{ animationDelay: "0.1s", opacity: 0 }}>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h3 className="text-xl font-display font-bold text-foreground">
                {months[currentMonth]} {currentYear}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {days.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2 h-20" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEvents = getEventsForDay(day);
                const isToday = day === 4 && currentMonth === 0; // Jan 4, 2026
                
                return (
                  <div
                    key={day}
                    className={`p-2 h-20 rounded-lg border transition-colors ${
                      isToday
                        ? "border-primary bg-primary/10"
                        : "border-transparent hover:bg-muted"
                    }`}
                  >
                    <span className={`text-sm font-medium ${isToday ? "text-primary" : "text-foreground"}`}>
                      {day}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs px-1 py-0.5 rounded text-white truncate ${getEventColor(event.type)}`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="stats-card widget-enter" style={{ animationDelay: "0.2s", opacity: 0 }}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className={`w-3 h-3 rounded-full mt-1 ${getEventColor(event.type)}`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{event.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {event.date} {event.time && `• ${event.time}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

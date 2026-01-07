import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, BookOpen, Calendar, MessageSquare, CreditCard, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import owlMascot from "@/assets/owl-mascot.png";
import foxMascot from "@/assets/fox-mascot.png";
import schoolBackground from "@/assets/school-background.png";
import { useToast } from "@/hooks/use-toast";

interface Child {
  id: string;
  name: string;
  grade: string;
  avatar: string;
  gpa: number;
  attendance: number;
}

interface Message {
  id: string;
  teacher: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
}

const mockChildren: Child[] = [
  { id: "1", name: "Alex Johnson", grade: "Grade 5", avatar: "👦", gpa: 3.8, attendance: 90 },
  { id: "2", name: "Emma Johnson", grade: "Grade 3", avatar: "👧", gpa: 3.9, attendance: 95 },
];

const mockMessages: Message[] = [
  { id: "1", teacher: "Dr. Sarah Smith", subject: "Math Progress Update", preview: "Alex has been doing great in...", date: "2026-01-04", unread: true },
  { id: "2", teacher: "Ms. Emily Brown", subject: "Upcoming Science Fair", preview: "I wanted to let you know about...", date: "2026-01-03", unread: false },
];

export default function ParentPortal() {
  const [parentName] = useState("Mrs. Johnson");
  const [selectedChild, setSelectedChild] = useState<Child>(mockChildren[0]);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const sendMessage = () => {
    if (newMessage.trim()) {
      toast({ title: "Message sent", description: "Your message has been sent to the teacher." });
      setNewMessage("");
    }
  };

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
              <span className="font-display font-bold text-lg">Parent Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-primary-foreground relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                  2
                </span>
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
              👩
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold text-foreground">Welcome, {parentName}!</h1>
              <p className="text-muted-foreground">Academic Year 2025-2026</p>
            </div>
            <img src={foxMascot} alt="Fox" className="w-20 h-20 animate-float hidden md:block" />
          </div>

          {/* Child Selector */}
          <div className="stats-card widget-enter" style={{ animationDelay: "0.15s", opacity: 0 }}>
            <h2 className="text-lg font-semibold text-foreground mb-4">My Children</h2>
            <div className="flex flex-wrap gap-3">
              {mockChildren.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    selectedChild.id === child.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-3xl">{child.avatar}</span>
                  <div className="text-left">
                    <p className="font-medium text-foreground">{child.name}</p>
                    <p className="text-sm text-muted-foreground">{child.grade}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Child Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="stats-card widget-enter" style={{ animationDelay: "0.2s", opacity: 0 }}>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">GPA</p>
                      <p className="text-2xl font-bold text-primary">{selectedChild.gpa}</p>
                    </div>
                  </div>
                </div>
                <div className="stats-card widget-enter" style={{ animationDelay: "0.25s", opacity: 0 }}>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-success" />
                    <div>
                      <p className="text-sm text-muted-foreground">Attendance</p>
                      <p className="text-2xl font-bold text-success">{selectedChild.attendance}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="stats-card widget-enter" style={{ animationDelay: "0.3s", opacity: 0 }}>
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Messages from Teachers</h2>
                </div>
                <div className="space-y-3 mb-4">
                  {mockMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-xl transition-colors cursor-pointer ${
                        message.unread ? "bg-primary/10 border border-primary/30" : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{message.teacher}</p>
                          <p className="text-sm font-medium text-foreground">{message.subject}</p>
                          <p className="text-sm text-muted-foreground">{message.preview}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{message.date}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-medium text-foreground mb-2">Send a Message</h3>
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message to the teacher..."
                    className="rounded-xl mb-2"
                  />
                  <Button onClick={sendMessage} className="rounded-xl">
                    Send Message
                  </Button>
                </div>
              </div>
            </div>

            {/* Financial Info */}
            <div className="space-y-6">
              <div className="stats-card widget-enter" style={{ animationDelay: "0.35s", opacity: 0 }}>
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Payments</h2>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-warning/10 border border-warning/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">Tuition Fee</span>
                      <span className="px-2 py-1 bg-warning/20 text-warning-foreground text-xs rounded-full">Due</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">$1,500</p>
                    <p className="text-sm text-muted-foreground">Due: Jan 15, 2026</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">Materials Fee</span>
                      <span className="px-2 py-1 bg-success/20 text-success text-xs rounded-full">Paid</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">$150</p>
                    <p className="text-sm text-muted-foreground">Paid: Dec 20, 2025</p>
                  </div>
                </div>
                <Button className="w-full mt-4 rounded-xl">
                  Pay Now
                </Button>
              </div>

              {/* Upcoming Events */}
              <div className="stats-card widget-enter" style={{ animationDelay: "0.4s", opacity: 0 }}>
                <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Events</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔬</span>
                    <div>
                      <p className="font-medium text-foreground">Science Fair</p>
                      <p className="text-sm text-muted-foreground">Jan 18, 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👨‍👩‍👧</span>
                    <div>
                      <p className="font-medium text-foreground">Parent-Teacher Meeting</p>
                      <p className="text-sm text-muted-foreground">Jan 22, 2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

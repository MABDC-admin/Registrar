import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  FileText,
  UserCheck,
  BookOpen,
  ClipboardCheck,
  Calendar,
  Wallet,
  BarChart3,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import owlMascot from "@/assets/owl-mascot.png";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  roles?: ("admin" | "teacher")[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", roles: ["admin", "teacher"] },
  { icon: GraduationCap, label: "Grade Levels", path: "/grade-levels", roles: ["admin"] },
  { icon: Users, label: "Students", path: "/students", roles: ["admin", "teacher"] },
  { icon: FileText, label: "Records", path: "/records", roles: ["admin", "teacher"] },
  { icon: UserCheck, label: "Teachers", path: "/teachers", roles: ["admin"] },
  { icon: BookOpen, label: "Classes", path: "/classes", roles: ["admin", "teacher"] },
  { icon: ClipboardCheck, label: "Attendance", path: "/attendance", roles: ["admin", "teacher"] },
  { icon: Calendar, label: "Calendar", path: "/calendar", roles: ["admin", "teacher"] },
  { icon: Wallet, label: "Finance", path: "/finance", roles: ["admin"] },
  { icon: BarChart3, label: "Reports", path: "/reports", roles: ["admin"] },
  { icon: Settings, label: "Settings", path: "/settings", roles: ["admin"] },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, signOut } = useAuth();
  const [notifications] = useState(3);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  // Filter nav items based on role
  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (role && item.roles.includes(role as "admin" | "teacher"))
  );

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-primary flex flex-col z-50">
      {/* Logo Section */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center overflow-hidden">
          <img src={owlMascot} alt="School Mascot" className="w-8 h-8 object-contain" />
        </div>
        <span className="font-display font-semibold text-lg text-sidebar-foreground">
          School Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          <button className="relative p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
            <Bell className="w-5 h-5 text-sidebar-foreground" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 badge-notification text-xs">
                {notifications}
              </span>
            )}
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
            title="Sign out"
          >
            <LogOut className="w-5 h-5 text-sidebar-foreground" />
          </button>
        </div>
      </div>
    </aside>
  );
}

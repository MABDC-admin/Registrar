import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import schoolBackground from "@/assets/school-background.png";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function DashboardLayout({
  children,
  title,
}: DashboardLayoutProps) {
  const { user } = useAuth();
  
  // Get user name from profile or email
  const displayName = user?.user_metadata?.first_name 
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`
    : user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 ml-56 relative">
        {/* Background Image */}
        <div 
          className="fixed inset-0 ml-56 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ 
            backgroundImage: `url(${schoolBackground})`,
            opacity: 0.4,
          }}
        />
        
        {/* Content Overlay */}
        <div className="relative z-10 p-6">
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Welcome {displayName}!
              </h1>
            </div>
            <button className="flex items-center gap-2 text-primary font-medium hover:underline transition-colors">
              Load Report
              <span className="text-lg">→</span>
            </button>
          </header>

          {/* Page Content */}
          {children}
        </div>
      </main>
    </div>
  );
}

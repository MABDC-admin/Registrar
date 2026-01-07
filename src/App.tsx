import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GradeLevels from "./pages/GradeLevels";
import Students from "./pages/Students";
import Records from "./pages/Records";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Attendance from "./pages/Attendance";
import Calendar from "./pages/Calendar";
import Finance from "./pages/Finance";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import StudentPortal from "./pages/StudentPortal";
import ParentPortal from "./pages/ParentPortal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Admin/Teacher routes */}
            <Route path="/" element={
              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/grade-levels" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <GradeLevels />
              </ProtectedRoute>
            } />
            <Route path="/students" element={
              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                <Students />
              </ProtectedRoute>
            } />
            <Route path="/records" element={
              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                <Records />
              </ProtectedRoute>
            } />
            <Route path="/teachers" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Teachers />
              </ProtectedRoute>
            } />
            <Route path="/classes" element={
              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                <Classes />
              </ProtectedRoute>
            } />
            <Route path="/attendance" element={
              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                <Attendance />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                <Calendar />
              </ProtectedRoute>
            } />
            <Route path="/finance" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Finance />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* Student portal */}
            <Route path="/student-portal" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentPortal />
              </ProtectedRoute>
            } />
            
            {/* Parent portal */}
            <Route path="/parent-portal" element={
              <ProtectedRoute allowedRoles={["parent"]}>
                <ParentPortal />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

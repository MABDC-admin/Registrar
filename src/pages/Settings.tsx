import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import owlMascot from "@/assets/owl-mascot.png";

export default function Settings() {
  const [schoolName, setSchoolName] = useState("Smart School Hub");
  const [email, setEmail] = useState("admin@smartschool.edu");
  const [phone, setPhone] = useState("+1 234 567 8900");
  const [address, setAddress] = useState("123 Education Lane, Learning City");
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: "Settings saved successfully" });
  };

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6 max-w-3xl">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Settings</h2>
          <p className="text-muted-foreground">Manage school configuration</p>
        </div>

        {/* School Info */}
        <div className="stats-card widget-enter" style={{ animationDelay: "0.1s", opacity: 0 }}>
          <div className="flex items-center gap-4 mb-6">
            <img src={owlMascot} alt="Mascot" className="w-16 h-16" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">School Information</h3>
              <p className="text-sm text-muted-foreground">Basic details about your school</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>School Name</Label>
              <Input
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Input
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="stats-card widget-enter" style={{ animationDelay: "0.2s", opacity: 0 }}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Notifications</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">In-App Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications within the app</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Alerts</p>
                <p className="text-sm text-muted-foreground">Receive important alerts via email</p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="stats-card widget-enter border-2 border-danger/20" style={{ animationDelay: "0.3s", opacity: 0 }}>
          <h3 className="text-lg font-semibold text-danger mb-4">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            These actions are irreversible. Please proceed with caution.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl border-danger text-danger hover:bg-danger hover:text-white">
              Reset All Data
            </Button>
          </div>
        </div>

        <Button onClick={handleSave} className="rounded-xl">
          Save Changes
        </Button>
      </div>
    </DashboardLayout>
  );
}

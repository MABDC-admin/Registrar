import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: string;
  studentName: string;
  grade: string;
  amount: number;
  type: "tuition" | "materials" | "activities" | "other";
  status: "paid" | "pending" | "overdue";
  dueDate: string;
}

const initialPayments: Payment[] = [
  { id: "1", studentName: "Alex Johnson", grade: "Grade 5", amount: 1500, type: "tuition", status: "paid", dueDate: "2026-01-15" },
  { id: "2", studentName: "Emma Wilson", grade: "Grade 4", amount: 1500, type: "tuition", status: "pending", dueDate: "2026-01-15" },
  { id: "3", studentName: "Liam Brown", grade: "Grade 6", amount: 150, type: "materials", status: "paid", dueDate: "2026-01-10" },
  { id: "4", studentName: "Olivia Davis", grade: "Grade 3", amount: 1500, type: "tuition", status: "overdue", dueDate: "2025-12-15" },
  { id: "5", studentName: "Noah Miller", grade: "Grade 5", amount: 75, type: "activities", status: "pending", dueDate: "2026-01-20" },
];

export default function Finance() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ studentName: "", grade: "", amount: "", type: "tuition" as Payment["type"], dueDate: "" });
  const { toast } = useToast();

  const filteredPayments = payments.filter(
    (p) => p.studentName.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    totalReceived: payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0),
    overdue: payments.filter((p) => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0),
  };

  const handleSave = () => {
    const newPayment: Payment = {
      id: Date.now().toString(),
      studentName: formData.studentName,
      grade: formData.grade,
      amount: parseFloat(formData.amount),
      type: formData.type,
      status: "pending",
      dueDate: formData.dueDate,
    };
    setPayments([...payments, newPayment]);
    toast({ title: "Payment record added" });
    setIsDialogOpen(false);
    setFormData({ studentName: "", grade: "", amount: "", type: "tuition", dueDate: "" });
  };

  const markAsPaid = (id: string) => {
    setPayments(payments.map((p) => (p.id === id ? { ...p, status: "paid" as const } : p)));
    toast({ title: "Marked as paid" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-success/20 text-success";
      case "pending": return "bg-warning/20 text-warning-foreground";
      case "overdue": return "bg-danger/20 text-danger";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout title="Finance">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Finance</h2>
            <p className="text-muted-foreground">Manage fees and payments</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="font-display">Add Payment Record</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Student Name</Label>
                    <Input
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      placeholder="John Doe"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Grade</Label>
                    <Input
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      placeholder="Grade 5"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount ($)</Label>
                    <Input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="1500"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <Button onClick={handleSave} className="w-full rounded-xl">
                    Add Record
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stats-card widget-enter" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">💰</span>
              <div>
                <p className="text-sm text-muted-foreground">Total Received</p>
                <p className="text-2xl font-bold text-success">${stats.totalReceived.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="stats-card widget-enter" style={{ animationDelay: "0.2s", opacity: 0 }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">⏳</span>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">${stats.pending.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="stats-card widget-enter" style={{ animationDelay: "0.3s", opacity: 0 }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-danger">${stats.overdue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payments..."
            className="pl-10 rounded-xl"
          />
        </div>

        {/* Table */}
        <div className="stats-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">Student</th>
                  <th className="text-left p-4 font-semibold text-foreground">Grade</th>
                  <th className="text-left p-4 font-semibold text-foreground">Type</th>
                  <th className="text-left p-4 font-semibold text-foreground">Amount</th>
                  <th className="text-left p-4 font-semibold text-foreground">Due Date</th>
                  <th className="text-left p-4 font-semibold text-foreground">Status</th>
                  <th className="text-right p-4 font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, index) => (
                  <tr
                    key={payment.id}
                    className="border-t border-border hover:bg-muted/30 transition-colors widget-enter"
                    style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
                  >
                    <td className="p-4 font-medium text-foreground">{payment.studentName}</td>
                    <td className="p-4 text-foreground">{payment.grade}</td>
                    <td className="p-4 text-foreground capitalize">{payment.type}</td>
                    <td className="p-4 font-bold text-foreground">${payment.amount.toLocaleString()}</td>
                    <td className="p-4 text-muted-foreground">{payment.dueDate}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end">
                        {payment.status !== "paid" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-success"
                            onClick={() => markAsPaid(payment.id)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

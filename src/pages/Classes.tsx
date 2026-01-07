import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Class {
  id: string;
  name: string;
  grade: string;
  teacher: string;
  room: string;
  students: number;
  schedule: string;
}

const initialClasses: Class[] = [
  { id: "1", name: "Math 101", grade: "Grade 5", teacher: "Dr. Sarah Smith", room: "Room 101", students: 28, schedule: "Mon, Wed, Fri 9:00 AM" },
  { id: "2", name: "Science Lab", grade: "Grade 6", teacher: "Mr. John Davis", room: "Lab 1", students: 25, schedule: "Tue, Thu 10:00 AM" },
  { id: "3", name: "English Literature", grade: "Grade 4", teacher: "Ms. Emily Brown", room: "Room 203", students: 30, schedule: "Mon, Wed 11:00 AM" },
  { id: "4", name: "History 101", grade: "Grade 5", teacher: "Mr. Michael Wilson", room: "Room 105", students: 27, schedule: "Tue, Thu 9:00 AM" },
];

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [search, setSearch] = useState("");
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", grade: "", teacher: "", room: "", schedule: "" });
  const { toast } = useToast();

  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.teacher.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (editingClass) {
      setClasses(
        classes.map((c) =>
          c.id === editingClass.id ? { ...c, ...formData } : c
        )
      );
      toast({ title: "Class updated successfully" });
    } else {
      const newClass: Class = {
        id: Date.now().toString(),
        ...formData,
        students: 0,
      };
      setClasses([...classes, newClass]);
      toast({ title: "Class created successfully" });
    }
    setIsDialogOpen(false);
    setFormData({ name: "", grade: "", teacher: "", room: "", schedule: "" });
    setEditingClass(null);
  };

  const handleEdit = (cls: Class) => {
    setEditingClass(cls);
    setFormData({ name: cls.name, grade: cls.grade, teacher: cls.teacher, room: cls.room, schedule: cls.schedule });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setClasses(classes.filter((c) => c.id !== id));
    toast({ title: "Class deleted", variant: "destructive" });
  };

  return (
    <DashboardLayout title="Classes">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Classes</h2>
            <p className="text-muted-foreground">Manage class sections and schedules</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="rounded-xl"
                onClick={() => {
                  setEditingClass(null);
                  setFormData({ name: "", grade: "", teacher: "", room: "", schedule: "" });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingClass ? "Edit Class" : "Add New Class"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Class Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Math 101"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => setFormData({ ...formData, grade: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"].map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Teacher</Label>
                  <Input
                    value={formData.teacher}
                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                    placeholder="Dr. Jane Doe"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Room</Label>
                  <Input
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="Room 101"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Schedule</Label>
                  <Input
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    placeholder="Mon, Wed, Fri 9:00 AM"
                    className="rounded-xl"
                  />
                </div>
                <Button onClick={handleSave} className="w-full rounded-xl">
                  {editingClass ? "Update" : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search classes..."
            className="pl-10 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClasses.map((cls, index) => (
            <div
              key={cls.id}
              className="stats-card widget-enter hover-lift"
              style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📚</span>
                    <h3 className="text-lg font-semibold text-foreground">{cls.name}</h3>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground"><span className="font-medium text-foreground">Grade:</span> {cls.grade}</p>
                    <p className="text-muted-foreground"><span className="font-medium text-foreground">Teacher:</span> {cls.teacher}</p>
                    <p className="text-muted-foreground"><span className="font-medium text-foreground">Room:</span> {cls.room}</p>
                    <p className="text-muted-foreground"><span className="font-medium text-foreground">Schedule:</span> {cls.schedule}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xl">👨‍🎓</span>
                    <span className="font-bold text-foreground">{cls.students}</span>
                    <span className="text-sm text-muted-foreground">students</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(cls)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(cls.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

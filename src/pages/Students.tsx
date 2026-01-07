import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Eye, Loader2 } from "lucide-react";
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
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent, Student, StudentFormData } from "@/hooks/useStudents";
import { useGradeLevels } from "@/hooks/useGradeLevels";

export default function Students() {
  const { data: students = [], isLoading } = useStudents();
  const { data: gradeLevels = [] } = useGradeLevels();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<StudentFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    grade_level_id: "",
    parent_name: "",
    parent_email: "",
  });

  const filteredStudents = students.filter(
    (s) =>
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.student_id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (editingStudent) {
      await updateStudent.mutateAsync({ id: editingStudent.id, ...formData });
    } else {
      await createStudent.mutateAsync(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email || "",
      phone: student.phone || "",
      gender: student.gender || "",
      grade_level_id: student.grade_level_id || "",
      parent_name: student.parent_name || "",
      parent_email: student.parent_email || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteStudent.mutateAsync(id);
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: "",
      grade_level_id: "",
      parent_name: "",
      parent_email: "",
    });
    setEditingStudent(null);
  };

  const getGradeName = (gradeId: string | null) => {
    if (!gradeId) return "Unassigned";
    const grade = gradeLevels.find((g) => g.id === gradeId);
    return grade?.name || "Unassigned";
  };

  const isSaving = createStudent.isPending || updateStudent.isPending;

  return (
    <DashboardLayout title="Students">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Students</h2>
            <p className="text-muted-foreground">Manage student enrollment and profiles</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="rounded-xl" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Enroll Student
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingStudent ? "Edit Student" : "Enroll New Student"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="John"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="Doe"
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@school.com"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Grade Level</Label>
                    <Select
                      value={formData.grade_level_id}
                      onValueChange={(value) => setFormData({ ...formData, grade_level_id: value })}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeLevels.map((g) => (
                          <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Parent/Guardian Info</p>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Parent Name</Label>
                      <Input
                        value={formData.parent_name}
                        onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                        placeholder="Jane Doe"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Parent Email</Label>
                      <Input
                        type="email"
                        value={formData.parent_email}
                        onChange={(e) => setFormData({ ...formData, parent_email: e.target.value })}
                        placeholder="jane@email.com"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleSave} 
                  className="w-full rounded-xl"
                  disabled={isSaving || !formData.first_name || !formData.last_name}
                >
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingStudent ? "Update" : "Enroll"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="pl-10 rounded-xl"
          />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : students.length === 0 ? (
          <div className="stats-card text-center py-12">
            <p className="text-4xl mb-4">👨‍🎓</p>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Students Yet</h3>
            <p className="text-muted-foreground mb-4">Start by enrolling your first student</p>
            <Button className="rounded-xl" onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Enroll Student
            </Button>
          </div>
        ) : (
          /* Table */
          <div className="stats-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-foreground">Student</th>
                    <th className="text-left p-4 font-semibold text-foreground">Email</th>
                    <th className="text-left p-4 font-semibold text-foreground">Grade</th>
                    <th className="text-left p-4 font-semibold text-foreground">Gender</th>
                    <th className="text-left p-4 font-semibold text-foreground">Status</th>
                    <th className="text-right p-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr 
                      key={student.id} 
                      className="border-t border-border hover:bg-muted/30 transition-colors widget-enter"
                      style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{student.gender === "male" ? "👦" : student.gender === "female" ? "👧" : "🧑"}</span>
                          <div>
                            <span className="font-medium text-foreground">{student.first_name} {student.last_name}</span>
                            <p className="text-xs text-muted-foreground">{student.student_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{student.email || "-"}</td>
                      <td className="p-4 text-foreground">{getGradeName(student.grade_level_id)}</td>
                      <td className="p-4 text-foreground capitalize">{student.gender || "-"}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === "active"
                            ? "bg-success/20 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(student)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDelete(student.id)}
                            disabled={deleteStudent.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

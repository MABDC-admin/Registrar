import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useTeachers, useCreateTeacher, useUpdateTeacher, useDeleteTeacher, Teacher, TeacherFormData } from "@/hooks/useTeachers";

export default function Teachers() {
  const { data: teachers = [], isLoading } = useTeachers();
  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();

  const [search, setSearch] = useState("");
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<TeacherFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    subject: "",
    qualification: "",
  });

  const filteredTeachers = teachers.filter(
    (t) =>
      `${t.first_name} ${t.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      t.subject?.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (editingTeacher) {
      await updateTeacher.mutateAsync({ id: editingTeacher.id, ...formData });
    } else {
      await createTeacher.mutateAsync(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      email: teacher.email,
      phone: teacher.phone || "",
      subject: teacher.subject || "",
      qualification: teacher.qualification || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteTeacher.mutateAsync(id);
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      subject: "",
      qualification: "",
    });
    setEditingTeacher(null);
  };

  const isSaving = createTeacher.isPending || updateTeacher.isPending;

  return (
    <DashboardLayout title="Teachers">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Teachers</h2>
            <p className="text-muted-foreground">Manage teaching staff</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="rounded-xl" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="Jane"
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
                    placeholder="jane@school.com"
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
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Mathematics"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Qualification</Label>
                  <Input
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="Ph.D. in Mathematics"
                    className="rounded-xl"
                  />
                </div>
                <Button 
                  onClick={handleSave} 
                  className="w-full rounded-xl"
                  disabled={isSaving || !formData.first_name || !formData.last_name || !formData.email}
                >
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingTeacher ? "Update" : "Add"}
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
            placeholder="Search teachers..."
            className="pl-10 rounded-xl"
          />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : teachers.length === 0 ? (
          <div className="stats-card text-center py-12">
            <p className="text-4xl mb-4">👨‍🏫</p>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Teachers Yet</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first teacher</p>
            <Button className="rounded-xl" onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Teacher
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeachers.map((teacher, index) => (
              <div
                key={teacher.id}
                className="stats-card widget-enter hover-lift"
                style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">👨‍🏫</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {teacher.first_name} {teacher.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">{teacher.email}</p>
                    <p className="text-xs text-muted-foreground">{teacher.teacher_id}</p>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      {teacher.subject && (
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                          {teacher.subject}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        teacher.status === "active"
                          ? "bg-success/20 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {teacher.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(teacher)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(teacher.id)}
                      disabled={deleteTeacher.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

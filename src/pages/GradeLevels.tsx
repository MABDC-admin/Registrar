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
import { useGradeLevels, useCreateGradeLevel, useUpdateGradeLevel, useDeleteGradeLevel, GradeLevel } from "@/hooks/useGradeLevels";

export default function GradeLevels() {
  const { data: grades = [], isLoading } = useGradeLevels();
  const createGradeLevel = useCreateGradeLevel();
  const updateGradeLevel = useUpdateGradeLevel();
  const deleteGradeLevel = useDeleteGradeLevel();

  const [search, setSearch] = useState("");
  const [editingGrade, setEditingGrade] = useState<GradeLevel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const filteredGrades = grades.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (editingGrade) {
      await updateGradeLevel.mutateAsync({ id: editingGrade.id, ...formData });
    } else {
      await createGradeLevel.mutateAsync(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (grade: GradeLevel) => {
    setEditingGrade(grade);
    setFormData({ name: grade.name, description: grade.description || "" });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteGradeLevel.mutateAsync(id);
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingGrade(null);
  };

  const isSaving = createGradeLevel.isPending || updateGradeLevel.isPending;

  return (
    <DashboardLayout title="Grade Levels">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Grade Levels</h2>
            <p className="text-muted-foreground">Manage grade levels in your school</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="rounded-xl" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Grade Level
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingGrade ? "Edit Grade Level" : "Add Grade Level"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Grade 7"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ages 11-12"
                    className="rounded-xl"
                  />
                </div>
                <Button 
                  onClick={handleSave} 
                  className="w-full rounded-xl"
                  disabled={isSaving || !formData.name}
                >
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingGrade ? "Update" : "Create"}
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
            placeholder="Search grade levels..."
            className="pl-10 rounded-xl"
          />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : grades.length === 0 ? (
          <div className="stats-card text-center py-12">
            <p className="text-4xl mb-4">🎓</p>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Grade Levels Yet</h3>
            <p className="text-muted-foreground mb-4">Start by creating your first grade level</p>
            <Button className="rounded-xl" onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Grade Level
            </Button>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGrades.map((grade, index) => (
              <div
                key={grade.id}
                className="stats-card widget-enter hover-lift"
                style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{grade.name}</h3>
                    <p className="text-sm text-muted-foreground">{grade.description || "No description"}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-2xl">🎓</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(grade)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(grade.id)}
                      disabled={deleteGradeLevel.isPending}
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

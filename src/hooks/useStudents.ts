import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  grade_level_id: string | null;
  address: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  parent_email: string | null;
  enrollment_date: string;
  status: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  grade_level_id: string;
  parent_name: string;
  parent_email: string;
}

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Student[];
    },
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (formData: StudentFormData) => {
      // Generate a unique student ID
      const studentId = `STU-${Date.now().toString(36).toUpperCase()}`;
      
      const { data, error } = await supabase
        .from("students")
        .insert({
          student_id: studentId,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email || null,
          phone: formData.phone || null,
          gender: formData.gender || null,
          grade_level_id: formData.grade_level_id || null,
          parent_name: formData.parent_name || null,
          parent_email: formData.parent_email || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Student enrolled successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to enroll student", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...formData }: StudentFormData & { id: string }) => {
      const { data, error } = await supabase
        .from("students")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email || null,
          phone: formData.phone || null,
          gender: formData.gender || null,
          grade_level_id: formData.grade_level_id || null,
          parent_name: formData.parent_name || null,
          parent_email: formData.parent_email || null,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Student updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update student", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Student removed", variant: "destructive" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to remove student", description: error.message, variant: "destructive" });
    },
  });
}

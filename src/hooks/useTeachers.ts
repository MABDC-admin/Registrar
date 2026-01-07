import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Teacher {
  id: string;
  teacher_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  qualification: string | null;
  hire_date: string;
  status: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeacherFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
}

export function useTeachers() {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Teacher[];
    },
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (formData: TeacherFormData) => {
      // Generate a unique teacher ID
      const teacherId = `TCH-${Date.now().toString(36).toUpperCase()}`;
      
      const { data, error } = await supabase
        .from("teachers")
        .insert({
          teacher_id: teacherId,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject || null,
          qualification: formData.qualification || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast({ title: "Teacher added successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to add teacher", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...formData }: TeacherFormData & { id: string }) => {
      const { data, error } = await supabase
        .from("teachers")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject || null,
          qualification: formData.qualification || null,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast({ title: "Teacher updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update teacher", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("teachers")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast({ title: "Teacher removed", variant: "destructive" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to remove teacher", description: error.message, variant: "destructive" });
    },
  });
}

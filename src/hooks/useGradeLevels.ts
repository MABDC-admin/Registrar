import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface GradeLevel {
  id: string;
  name: string;
  description: string | null;
  order_index: number;
  created_at: string;
}

export function useGradeLevels() {
  return useQuery({
    queryKey: ["grade_levels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grade_levels")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as GradeLevel[];
    },
  });
}

export function useCreateGradeLevel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (formData: { name: string; description: string }) => {
      const { data, error } = await supabase
        .from("grade_levels")
        .insert({
          name: formData.name,
          description: formData.description || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grade_levels"] });
      toast({ title: "Grade level created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create grade level", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateGradeLevel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, name, description }: { id: string; name: string; description: string }) => {
      const { data, error } = await supabase
        .from("grade_levels")
        .update({ name, description: description || null })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grade_levels"] });
      toast({ title: "Grade level updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update grade level", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteGradeLevel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("grade_levels")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grade_levels"] });
      toast({ title: "Grade level deleted", variant: "destructive" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete grade level", description: error.message, variant: "destructive" });
    },
  });
}

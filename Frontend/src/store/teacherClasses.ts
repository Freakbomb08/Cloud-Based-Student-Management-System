// Teacher's classes (sections + subjects they teach), backed by Supabase.
import { supabase } from "@/integrations/supabase/client";

export type TeacherClass = {
  id: string;
  teacherId: string;
  section: string;   // e.g. "BCA VI E2"
  subject: string;   // e.g. "Major Project"
  status: string;    // "Active" | "Reviewing"
  avgGrade: number;
  attendance: number;
  createdAt: number;
};

type Row = {
  id: string;
  teacher_id: string;
  section: string;
  subject: string;
  status: string;
  avg_grade: number;
  attendance: number;
  created_at: string;
};

const toClass = (r: Row): TeacherClass => ({
  id: r.id,
  teacherId: r.teacher_id,
  section: r.section,
  subject: r.subject,
  status: r.status,
  avgGrade: r.avg_grade,
  attendance: r.attendance,
  createdAt: new Date(r.created_at).getTime(),
});

export async function fetchTeacherClasses(teacherId: string): Promise<TeacherClass[]> {
  const { data, error } = await supabase
    .from("teacher_classes")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchTeacherClasses error", error);
    return [];
  }
  return (data as Row[]).map(toClass);
}

export type NewTeacherClass = {
  teacherId: string;
  section: string;
  subject: string;
  status?: string;
  avgGrade?: number;
  attendance?: number;
};

export async function addTeacherClass(input: NewTeacherClass): Promise<TeacherClass> {
  const { data, error } = await supabase
    .from("teacher_classes")
    .insert({
      teacher_id: input.teacherId,
      section: input.section,
      subject: input.subject,
      status: input.status ?? "Active",
      avg_grade: input.avgGrade ?? 0,
      attendance: input.attendance ?? 0,
    })
    .select("*")
    .single();
  if (error) throw error;
  return toClass(data as Row);
}

export async function deleteTeacherClass(id: string): Promise<void> {
  const { error } = await supabase.from("teacher_classes").delete().eq("id", id);
  if (error) throw error;
}

export function subscribeTeacherClasses(onChange: () => void): () => void {
  const channel = supabase
    .channel("teacher-classes-stream")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "teacher_classes" },
      () => onChange(),
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

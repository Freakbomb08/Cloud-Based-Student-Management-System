// Assignments store backed by Lovable Cloud (Supabase).
// - Persists assignments in the `assignments` table
// - Uploads PDF/DOCX files to the public `assignments` storage bucket
// - Real-time subscription so student dashboards update instantly

import { supabase } from "@/integrations/supabase/client";

export type Assignment = {
  id: string;
  course: string;        // subject, e.g. "CS-402"
  section: string;       // target class/section, e.g. "BCA VI E1"
  title: string;
  dueDate: string;       // yyyy-mm-dd
  points: number;
  postedAt: number;      // epoch ms (derived from created_at)
  postedBy: string;
  fileUrl?: string | null;
  fileName?: string | null;
};

// Available student sections (UI-only catalogue)
export const STUDENT_SECTIONS = [
  "BCA VI E1",
  "BCA VI E2",
  "BCA IV E1",
  "BCA IV E2",
  "BCA II E1",
  "BCA II E2",
  "MCA II A",
  "MCA II B",
] as const;
export type StudentSection = (typeof STUDENT_SECTIONS)[number];

type Row = {
  id: string;
  course: string;
  section: string;
  title: string;
  due_date: string;
  points: number;
  posted_by: string;
  file_url: string | null;
  file_name: string | null;
  created_at: string;
};

function rowToAssignment(r: Row): Assignment {
  return {
    id: r.id,
    course: r.course,
    section: r.section,
    title: r.title,
    dueDate: r.due_date,
    points: r.points,
    postedAt: new Date(r.created_at).getTime(),
    postedBy: r.posted_by,
    fileUrl: r.file_url,
    fileName: r.file_name,
  };
}

export async function fetchAssignments(): Promise<Assignment[]> {
  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchAssignments error", error);
    return [];
  }
  return (data as Row[]).map(rowToAssignment);
}

export async function uploadAssignmentFile(file: File): Promise<{ url: string; name: string }> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("assignments")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("assignments").getPublicUrl(path);
  return { url: data.publicUrl, name: file.name };
}

export type NewAssignmentInput = {
  course: string;
  section: string;
  title: string;
  dueDate: string;
  points: number;
  postedBy: string;
  fileUrl?: string | null;
  fileName?: string | null;
};

export async function addAssignment(input: NewAssignmentInput): Promise<Assignment> {
  const { data, error } = await supabase
    .from("assignments")
    .insert({
      course: input.course,
      section: input.section,
      title: input.title,
      due_date: input.dueDate,
      points: input.points,
      posted_by: input.postedBy,
      file_url: input.fileUrl ?? null,
      file_name: input.fileName ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return rowToAssignment(data as Row);
}

export function subscribeAssignments(onChange: () => void): () => void {
  const channel = supabase
    .channel("assignments-stream")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "assignments" },
      () => onChange(),
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

export function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "JUST NOW";
  if (m < 60) return `${m}M AGO`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}H AGO`;
  const d = Math.floor(h / 24);
  if (d === 1) return "YESTERDAY";
  return `${d} DAYS AGO`;
}

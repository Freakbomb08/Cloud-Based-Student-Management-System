// Announcements / notifications posted by teachers to a section.
import { supabase } from "@/integrations/supabase/client";

export type Announcement = {
  id: string;
  teacherId: string;
  postedBy: string;
  section: string;
  subject: string;
  message: string;
  postedAt: number;
};

type Row = {
  id: string;
  teacher_id: string;
  posted_by: string;
  section: string;
  subject: string;
  message: string;
  created_at: string;
};

const toAnnouncement = (r: Row): Announcement => ({
  id: r.id,
  teacherId: r.teacher_id,
  postedBy: r.posted_by,
  section: r.section,
  subject: r.subject,
  message: r.message,
  postedAt: new Date(r.created_at).getTime(),
});

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchAnnouncements error", error);
    return [];
  }
  return (data as Row[]).map(toAnnouncement);
}

export type NewAnnouncement = {
  teacherId: string;
  postedBy: string;
  section: string;
  subject: string;
  message: string;
};

export async function addAnnouncement(input: NewAnnouncement): Promise<Announcement> {
  const { data, error } = await supabase
    .from("announcements")
    .insert({
      teacher_id: input.teacherId,
      posted_by: input.postedBy,
      section: input.section,
      subject: input.subject,
      message: input.message,
    })
    .select("*")
    .single();
  if (error) throw error;
  return toAnnouncement(data as Row);
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw error;
}

export function subscribeAnnouncements(onChange: () => void): () => void {
  const channel = supabase
    .channel("announcements-stream")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "announcements" },
      () => onChange(),
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

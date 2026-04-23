-- Teacher classes table (the classes/sections a teacher teaches)
CREATE TABLE public.teacher_classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  section TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  avg_grade INTEGER NOT NULL DEFAULT 0,
  attendance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.teacher_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view teacher classes"
  ON public.teacher_classes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert teacher classes"
  ON public.teacher_classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update teacher classes"
  ON public.teacher_classes FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete teacher classes"
  ON public.teacher_classes FOR DELETE USING (true);

-- Announcements / notifications
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  posted_by TEXT NOT NULL,
  section TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view announcements"
  ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Anyone can insert announcements"
  ON public.announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update announcements"
  ON public.announcements FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete announcements"
  ON public.announcements FOR DELETE USING (true);

CREATE INDEX idx_announcements_section ON public.announcements(section);
CREATE INDEX idx_teacher_classes_teacher ON public.teacher_classes(teacher_id);

-- Assignments table
create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  course text not null,
  section text not null,
  title text not null,
  due_date date not null,
  points integer not null default 0,
  posted_by text not null,
  file_url text,
  file_name text,
  created_at timestamptz not null default now()
);

alter table public.assignments enable row level security;

-- Open policies for now (no auth yet). To be tightened once roles exist.
create policy "Anyone can view assignments"
  on public.assignments for select
  using (true);

create policy "Anyone can insert assignments"
  on public.assignments for insert
  with check (true);

create policy "Anyone can delete assignments"
  on public.assignments for delete
  using (true);

create index assignments_section_idx on public.assignments (section, created_at desc);

-- Public storage bucket for assignment files
insert into storage.buckets (id, name, public)
values ('assignments', 'assignments', true);

create policy "Public read assignment files"
  on storage.objects for select
  using (bucket_id = 'assignments');

create policy "Anyone can upload assignment files"
  on storage.objects for insert
  with check (bucket_id = 'assignments');

create policy "Anyone can delete assignment files"
  on storage.objects for delete
  using (bucket_id = 'assignments');

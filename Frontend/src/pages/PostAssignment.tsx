import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FilePlus2, FileUp, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PortalTopbar } from "@/components/PortalTopbar";
import { mockTeacher } from "@/data/mock";
import { addAssignment, uploadAssignmentFile } from "@/store/assignments";
import { useTeacherClasses } from "@/hooks/use-teacher-classes";

const ACCEPTED = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

const PostAssignment = () => {
  const navigate = useNavigate();
  const teacherClasses = useTeacherClasses(mockTeacher.id);
  const [classId, setClassId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [points, setPoints] = useState("20");
  const [submitting, setSubmitting] = useState(false);

  const onFilePick = (f: File | null) => {
    if (!f) return setFile(null);
    const okExt = /\.(pdf|docx?|)$/i.test(f.name);
    if (!okExt) {
      toast.error("Only PDF or DOCX files are allowed.");
      return;
    }
    if (f.size > MAX_BYTES) {
      toast.error("File too large. Max 15 MB.");
      return;
    }
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cls = teacherClasses.find((c) => c.id === classId);
    if (!title.trim() || !cls || !dueDate) {
      toast.error("Please pick a class and fill in title and due date.");
      return;
    }
    setSubmitting(true);
    try {
      let fileUrl: string | null = null;
      let fileName: string | null = null;
      if (file) {
        const uploaded = await uploadAssignmentFile(file);
        fileUrl = uploaded.url;
        fileName = uploaded.name;
      }
      await addAssignment({
        course: cls.subject,
        section: cls.section,
        title: title.trim(),
        dueDate,
        points: Number(points) || 0,
        postedBy: mockTeacher.name,
        fileUrl,
        fileName,
      });
      toast.success("Assignment posted", { description: `${cls.section} • ${cls.subject} • ${title}` });
      setTimeout(() => navigate("/teacher"), 400);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error("Could not post assignment", { description: msg });
      setSubmitting(false);
    }
  };

  return (
    <>
      <PortalTopbar search="Search students, classes…" />
      <div className="bg-surface min-h-screen">
        <div className="px-5 lg:px-10 pt-6 pb-24 lg:pb-10 max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary mb-4 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <header className="mb-6">
            <p className="text-[11px] tracking-[0.25em] font-bold text-secondary-foreground">FACULTY TOOLS</p>
            <h1 className="mt-2 font-display font-extrabold text-4xl lg:text-display-md text-primary tracking-tight">
              Post <span className="italic font-light text-foreground/70">Assignment</span>
            </h1>
            <p className="mt-2 text-sm text-foreground/80">
              Upload the assignment as a PDF or DOCX. Students in the selected section will be notified instantly and can download it from their dashboard.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="bg-surface-lowest rounded-2xl p-6 shadow-card space-y-5">
            <div className="space-y-2">
              <Label htmlFor="cls">Class / Section — Subject</Label>
              {teacherClasses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/60 bg-surface px-4 py-3 text-sm text-muted-foreground">
                  You haven't added any classes yet. Add a class from the Teacher Dashboard first.
                </div>
              ) : (
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger id="cls"><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    {teacherClasses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.section} — {c.subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <p className="text-xs text-muted-foreground">Only students in the selected section will be notified.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due">Due date</Label>
              <Input id="due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. Assignment 4: Integrals"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Assignment file (PDF or DOCX)</Label>
              {!file ? (
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 bg-surface px-6 py-10 text-center cursor-pointer hover:bg-surface/70 transition-colors"
                >
                  <FileUp className="h-8 w-8 text-primary" />
                  <p className="font-display font-bold text-primary">Click to upload assignment</p>
                  <p className="text-xs text-muted-foreground">PDF or DOCX • up to 15 MB</p>
                  <input
                    id="file"
                    type="file"
                    accept={ACCEPTED}
                    className="sr-only"
                    onChange={(e) => onFilePick(e.target.files?.[0] ?? null)}
                  />
                </label>
              ) : (
                <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 border border-border/60">
                  <span className="grid place-items-center h-10 w-10 rounded-lg bg-primary-fixed text-on-primary-fixed shrink-0">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-primary truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="grid place-items-center h-9 w-9 rounded-md hover:bg-destructive/10 text-destructive"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="points">Total points</Label>
                <Input
                  id="points"
                  type="number"
                  min={0}
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                <FilePlus2 /> {submitting ? "Posting…" : "Post Assignment"}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => navigate("/teacher")}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostAssignment;

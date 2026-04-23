import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CalendarPlus, ClipboardCheck, FilePlus2, MoreHorizontal, Pencil, Plus, Send, Trash2, UserCircle, X } from "lucide-react";
import { toast } from "sonner";
import { mockTeacher, recentSubmissions } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PortalTopbar } from "@/components/PortalTopbar";
import { useTeacherClasses } from "@/hooks/use-teacher-classes";
import { addTeacherClass, deleteTeacherClass } from "@/store/teacherClasses";
import { useAnnouncements } from "@/hooks/use-announcements";
import { addAnnouncement, deleteAnnouncement } from "@/store/announcements";
import { STUDENT_SECTIONS } from "@/store/assignments";
import { relativeTime } from "@/store/assignments";

const TeacherDashboard = () => {
  const teacherClasses = useTeacherClasses(mockTeacher.id);
  const allAnnouncements = useAnnouncements();
  const myAnnouncements = allAnnouncements.filter((a) => a.teacherId === mockTeacher.id);

  // ----- Add class dialog -----
  const [classOpen, setClassOpen] = useState(false);
  const [newSection, setNewSection] = useState<string>(STUDENT_SECTIONS[0]);
  const [newSubject, setNewSubject] = useState("");
  const [savingClass, setSavingClass] = useState(false);

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) {
      toast.error("Please enter a subject.");
      return;
    }
    setSavingClass(true);
    try {
      await addTeacherClass({
        teacherId: mockTeacher.id,
        section: newSection,
        subject: newSubject.trim(),
      });
      toast.success("Class added", { description: `${newSection} • ${newSubject}` });
      setNewSubject("");
      setClassOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not add class";
      toast.error(msg);
    } finally {
      setSavingClass(false);
    }
  };

  const handleDeleteClass = async (id: string) => {
    try {
      await deleteTeacherClass(id);
      toast.success("Class removed");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not remove class";
      toast.error(msg);
    }
  };

  // ----- Announcement dialog -----
  const [annOpen, setAnnOpen] = useState(false);
  const [annClassId, setAnnClassId] = useState<string>("");
  const [annMessage, setAnnMessage] = useState("");
  const [postingAnn, setPostingAnn] = useState(false);

  const openAnnouncement = () => {
    if (teacherClasses.length === 0) {
      toast.error("Add a class first to post a notification.");
      return;
    }
    setAnnClassId(teacherClasses[0].id);
    setAnnMessage("");
    setAnnOpen(true);
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    const cls = teacherClasses.find((c) => c.id === annClassId);
    if (!cls || !annMessage.trim()) {
      toast.error("Pick a class and write a message.");
      return;
    }
    setPostingAnn(true);
    try {
      await addAnnouncement({
        teacherId: mockTeacher.id,
        postedBy: mockTeacher.name,
        section: cls.section,
        subject: cls.subject,
        message: annMessage.trim(),
      });
      toast.success("Notification posted", { description: `${cls.section} • ${cls.subject}` });
      setAnnOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not post notification";
      toast.error(msg);
    } finally {
      setPostingAnn(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await deleteAnnouncement(id);
      toast.success("Notification removed");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not remove";
      toast.error(msg);
    }
  };

  return (
    <>
      <PortalTopbar search="Search students, classes…" />

      <div className="bg-surface min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-5 pt-6 pb-4">
          <p className="font-display font-extrabold text-primary tracking-tight">Academic Authority</p>
          <div className="flex items-center gap-3">
            <button className="grid place-items-center h-10 w-10 rounded-full hover:bg-surface-low">
              <Bell className="h-5 w-5 text-primary" />
            </button>
            <span className="grid place-items-center h-10 w-10 rounded-full bg-primary text-primary-foreground">
              <UserCircle className="h-6 w-6" />
            </span>
          </div>
        </header>

        <div className="px-5 lg:px-10 pb-24 lg:pb-10 space-y-7 max-w-6xl mx-auto">
          {/* Title */}
          <section>
            <h1 className="font-display font-extrabold text-4xl lg:text-display-md text-primary tracking-tight">
              Teacher Dashboard
            </h1>
            <p className="mt-2 text-sm lg:text-base text-foreground/80">
              Welcome back, {mockTeacher.name.split(" ").slice(-1)}. You teach{" "}
              <span className="font-bold text-primary underline decoration-secondary decoration-2 underline-offset-2">
                {teacherClasses.length} {teacherClasses.length === 1 ? "class" : "classes"}
              </span>{" "}
              and have posted {myAnnouncements.length} notifications.
            </p>
          </section>

          {/* Quick Actions */}
          <section>
            <p className="text-[11px] tracking-[0.25em] font-bold text-muted-foreground mb-3">QUICK ACTIONS</p>
            <div className="space-y-3">
              <Link to="/attendance">
                <button className="w-full bg-primary text-primary-foreground rounded-xl px-5 h-14 flex items-center justify-between shadow-card hover:opacity-95 transition">
                  <span className="font-display font-bold text-lg">Mark Attendance</span>
                  <ClipboardCheck className="h-5 w-5" />
                </button>
              </Link>
              <Link to="/post-assignment">
                <button className="w-full bg-surface-lowest text-primary rounded-xl px-5 h-14 flex items-center justify-between shadow-card hover:bg-surface-low transition">
                  <span className="font-display font-bold text-lg">Post Assignment</span>
                  <FilePlus2 className="h-5 w-5" />
                </button>
              </Link>
              <button
                onClick={openAnnouncement}
                className="w-full bg-surface-lowest text-primary rounded-xl px-5 h-14 flex items-center justify-between shadow-card hover:bg-surface-low transition"
              >
                <span className="font-display font-bold text-lg">Post Notification</span>
                <Send className="h-5 w-5" />
              </button>
              <button className="w-full bg-surface-lowest text-primary rounded-xl px-5 h-14 flex items-center justify-between shadow-card">
                <span className="font-display font-bold text-lg">Schedule Meeting</span>
                <CalendarPlus className="h-5 w-5" />
              </button>
            </div>
          </section>

          {/* My Announcements (posted by teacher) */}
          <section className="bg-surface-low rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] tracking-[0.25em] font-bold text-muted-foreground">MY ANNOUNCEMENTS</p>
              <button onClick={openAnnouncement} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                <Pencil className="h-3.5 w-3.5" /> New
              </button>
            </div>
            {myAnnouncements.length === 0 ? (
              <div className="bg-surface-lowest rounded-xl p-6 text-center">
                <p className="text-sm text-muted-foreground">No notifications posted yet.</p>
                <Button variant="primary" size="sm" className="mt-3" onClick={openAnnouncement}>
                  <Send /> Post First Notification
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myAnnouncements.map((a) => (
                  <div key={a.id} className="bg-surface-lowest rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] tracking-[0.2em] font-bold text-destructive">
                          {a.section} • {a.subject}
                        </p>
                        <p className="mt-1 text-sm text-foreground">{a.message}</p>
                        <p className="mt-2 text-[11px] text-muted-foreground">{relativeTime(a.postedAt)}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteAnnouncement(a.id)}
                        className="grid place-items-center h-8 w-8 rounded-md text-destructive hover:bg-destructive/10 shrink-0"
                        aria-label="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Class overview */}
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display font-extrabold text-2xl lg:text-3xl text-primary">Class Overview</h2>
              <button
                onClick={() => setClassOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Add Class
              </button>
            </div>
            {teacherClasses.length === 0 ? (
              <div className="bg-surface-lowest rounded-2xl p-8 shadow-card text-center">
                <p className="font-display font-bold text-primary text-lg">No classes yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add the classes you teach (e.g. <em>BCA VI E2 — Major Project</em>) to start posting assignments and notifications.
                </p>
                <Button variant="primary" className="mt-4" onClick={() => setClassOpen(true)}>
                  <Plus /> Add Class
                </Button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-3">
                {teacherClasses.map((c) => (
                  <article key={c.id} className="bg-surface-lowest rounded-2xl p-5 shadow-card">
                    <div className="flex justify-between items-start">
                      <span className={`px-3 py-1 rounded-full text-[10px] tracking-[0.2em] font-bold ${
                        c.status === "Active" ? "bg-primary-fixed/20 text-primary" : "bg-destructive/15 text-destructive"
                      }`}>{c.status.toUpperCase()}</span>
                      <button
                        onClick={() => handleDeleteClass(c.id)}
                        className="grid place-items-center h-8 w-8 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        aria-label="Remove class"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="mt-3 font-display font-extrabold text-2xl text-primary">{c.subject}</p>
                    <p className="text-sm text-muted-foreground">{c.section}</p>
                    <div className="mt-5 flex gap-8">
                      <div>
                        <p className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground">AVG GRADE</p>
                        <p className="font-display font-extrabold text-2xl text-primary">{c.avgGrade}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground">ATTENDANCE</p>
                        <p className="font-display font-extrabold text-2xl text-primary">{c.attendance}%</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Recent submissions */}
          <section className="bg-surface-low rounded-2xl p-5">
            <h3 className="font-display font-extrabold text-2xl text-primary mb-4">Recent Submissions</h3>
            <div className="space-y-3">
              {recentSubmissions.map((s, i) => (
                <div key={i} className="bg-surface-lowest rounded-xl p-4 flex items-center gap-3">
                  <span className={`grid place-items-center h-11 w-11 rounded-full text-xs font-bold shrink-0 ${
                    s.tone === "blue" ? "bg-primary-fixed/25 text-primary" : "bg-destructive/15 text-destructive"
                  }`}>{s.initials}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-primary text-sm">{s.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.course} • {s.item}</p>
                  </div>
                  <Button variant="primary" size="sm">Grade</Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ===== Add Class Dialog ===== */}
      <Dialog open={classOpen} onOpenChange={setClassOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a class you teach</DialogTitle>
            <DialogDescription>
              Pick the student section and enter the subject (e.g. <em>Major Project</em>).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddClass} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cls-section">Class / Section</Label>
              <Select value={newSection} onValueChange={setNewSection}>
                <SelectTrigger id="cls-section"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STUDENT_SECTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cls-subject">Subject</Label>
              <Input
                id="cls-subject"
                placeholder="e.g. Major Project"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setClassOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={savingClass}>
                <Plus /> {savingClass ? "Adding…" : "Add Class"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ===== Post Notification Dialog ===== */}
      <Dialog open={annOpen} onOpenChange={setAnnOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Post a notification</DialogTitle>
            <DialogDescription>
              Choose one of your classes and write a message. Students in that section will see it on their dashboard.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePostAnnouncement} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ann-class">Class / Section — Subject</Label>
              <Select value={annClassId} onValueChange={setAnnClassId}>
                <SelectTrigger id="ann-class"><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {teacherClasses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.section} — {c.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ann-msg">Message</Label>
              <Textarea
                id="ann-msg"
                placeholder="e.g. Mid-term review notes uploaded to portal."
                rows={4}
                value={annMessage}
                onChange={(e) => setAnnMessage(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAnnOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={postingAnn}>
                <Send /> {postingAnn ? "Posting…" : "Post Notification"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeacherDashboard;

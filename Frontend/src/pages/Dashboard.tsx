import { Link } from "react-router-dom";
import { BadgeCheck, BookMarked, Calendar, ChevronRight, Clock, FilePlus2, IdCard, MapPin, Megaphone, MoreHorizontal } from "lucide-react";
import { mockStudent, upcomingClasses } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { PortalTopbar } from "@/components/PortalTopbar";
import { MobileHeader } from "@/components/MobileHeader";
import { useAssignments } from "@/hooks/use-assignments";
import { useAnnouncements } from "@/hooks/use-announcements";
import { relativeTime } from "@/store/assignments";

const Dashboard = () => {
  const allAssignments = useAssignments();
  const assignments = allAssignments.filter((a) => a.section === mockStudent.section);
  const allAnnouncements = useAnnouncements();
  const announcements = allAnnouncements.filter((a) => a.section === mockStudent.section);

  return (
    <>
      <PortalTopbar search="Search resources..." />

      {/* ==================== MOBILE ==================== */}
      <div className="lg:hidden bg-surface min-h-screen">
        <MobileHeader />
        <div className="px-5 pt-2 pb-6 space-y-7">
          {/* Welcome */}
          <section>
            <p className="text-[11px] tracking-[0.25em] font-bold text-secondary-foreground">WELCOME BACK, SCHOLAR</p>
            <h1 className="mt-2 font-display font-extrabold text-5xl tracking-tight text-primary leading-none">
              {mockStudent.name.split(" ")[0]}{" "}
              <span className="italic font-light text-foreground/70">{mockStudent.name.split(" ")[1]}</span>
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip>{mockStudent.program} (Honours)</Chip>
              <Chip>Semester {mockStudent.semester}</Chip>
              <Chip variant="gold">Section {mockStudent.section}</Chip>
            </div>
            <Button variant="primary" className="mt-5">
              <IdCard /> VIEW ID CARD
            </Button>
          </section>

          {/* Notification Center */}
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-display font-extrabold text-2xl text-primary">Notification Center</h2>
              <button className="text-xs font-bold text-primary">Mark all as read</button>
            </div>
            <div className="space-y-3">
              {assignments.map((a) => (
                <NotifCard
                  key={a.id}
                  tone="blue"
                  icon={<FilePlus2 className="h-5 w-5" />}
                  title={`New Assignment: ${a.title}`}
                  time={relativeTime(a.postedAt)}
                  body={`${a.section} • ${a.course} • Due ${new Date(a.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })} • ${a.points} pts`}
                  action={
                    a.fileUrl ? (
                      <Button asChild variant="primary" size="sm">
                        <a href={a.fileUrl} target="_blank" rel="noopener noreferrer" download={a.fileName ?? undefined}>
                          Download Assignment
                        </a>
                      </Button>
                    ) : (
                      <Button variant="primary" size="sm">View Assignment</Button>
                    )
                  }
                />
              ))}
              {announcements.map((n) => (
                <NotifCard
                  key={n.id}
                  tone="gold"
                  icon={<Megaphone className="h-5 w-5" />}
                  title={`${n.subject} — ${n.postedBy}`}
                  time={relativeTime(n.postedAt)}
                  body={n.message}
                />
              ))}
              {assignments.length === 0 && announcements.length === 0 && (
                <div className="bg-surface-lowest rounded-xl p-6 text-center shadow-card">
                  <p className="text-sm text-muted-foreground">No notifications yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Today's Schedule */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-extrabold text-2xl text-primary">Today's Schedule</h2>
              <button className="grid place-items-center h-8 w-8 rounded-full bg-surface-lowest"><MoreHorizontal className="h-4 w-4 text-primary" /></button>
            </div>

            <div>
              <p className="text-[11px] tracking-[0.25em] font-bold text-secondary-foreground mb-2 ml-1">ONGOING</p>
              <div className="rounded-2xl bg-gradient-primary text-primary-foreground p-5 shadow-card border-l-4 border-secondary">
                <p className="font-display font-extrabold text-2xl">Web Development</p>
                <p className="text-sm opacity-80 mt-1">Lab 402 • Prof. Sharma</p>
                <p className="mt-3 inline-flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" /> 09:30 AM – 11:00 AM
                </p>
              </div>
            </div>

            <p className="text-[11px] tracking-[0.25em] font-bold text-muted-foreground mt-5 mb-2 ml-1">NEXT UP</p>
            <div className="space-y-3">
              {upcomingClasses.slice(1).map((c) => (
                <div key={c.title} className="bg-surface-lowest rounded-xl p-4 shadow-card border-l-4 border-border/40">
                  <p className="font-display font-bold text-lg text-primary">{c.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{c.room} • {c.prof}</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-foreground">
                    <Clock className="h-4 w-4 text-muted-foreground" /> {c.time} – {c.tag === "Practical" ? "03:00" : "04:30"} PM
                  </p>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 rounded-xl py-4 text-sm font-bold text-foreground border-2 border-dashed border-border/60 hover:bg-surface-lowest">
              View Full Week Schedule
            </button>
          </section>
        </div>

        {/* Mobile footer band */}
        <footer className="bg-gradient-primary text-primary-foreground py-8 mt-6 mb-20 mx-0 text-center">
          <p className="font-display italic font-extrabold tracking-[0.25em] text-secondary text-sm">IITM JANAKPURI</p>
          <p className="text-[11px] tracking-[0.22em] mt-1 opacity-80">EDITORIAL INFORMATION SYSTEM</p>
          <div className="mt-4 flex justify-center gap-5 text-xs opacity-90">
            <a href="#">Privacy Policy</a><a href="#">Support</a><a href="#">Academic Integrity</a>
          </div>
          <p className="mt-3 text-xs opacity-70">© 2024 IITM Janakpuri. All rights reserved.</p>
        </footer>
      </div>

      {/* ==================== DESKTOP ==================== */}
      <div className="hidden lg:block px-10 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-6 min-w-0">
            <section className="relative overflow-hidden rounded-2xl bg-gradient-primary text-primary-foreground p-10 shadow-card">
              <div className="absolute -right-10 -bottom-10 opacity-30">
                <div className="h-64 w-64 border-4 border-secondary/30 rounded-3xl rotate-12" />
                <div className="h-40 w-40 border-4 border-secondary/40 rounded-2xl absolute -top-10 -left-10 -rotate-6" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary text-[11px] tracking-[0.2em] font-bold ring-1 ring-secondary/40">
                ACADEMIC SESSION 2024-25
              </span>
              <h2 className="mt-6 font-display font-extrabold text-display-md tracking-tight max-w-xl">
                Welcome back, <br />{mockStudent.name}.
              </h2>
              <p className="mt-3 text-primary-foreground/80 max-w-md">
                You have {upcomingClasses.length} upcoming classes today. Your attendance is currently at {mockStudent.attendance}% — keep it up!
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="gold" size="lg"><IdCard /> View ID Card</Button>
                <Button variant="outline" size="lg" className="bg-transparent text-primary-foreground ghost-border hover:bg-primary-foreground/10">
                  <Calendar /> Academic Calendar
                </Button>
              </div>
            </section>

            <section>
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="font-display font-extrabold text-2xl text-primary">Upcoming Classes</h3>
                <Link to="/courses" className="text-xs font-bold text-primary hover:underline">Full Schedule</Link>
              </div>
              <div className="space-y-3">
                {upcomingClasses.map((c) => (
                  <article key={c.title} className="bg-surface-lowest rounded-xl p-4 flex items-center gap-5 shadow-card">
                    <div className="bg-surface rounded-lg p-3 min-w-[80px] text-center">
                      <p className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground">TODAY</p>
                      <p className="font-display font-extrabold text-2xl text-primary">{c.time}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-primary text-lg truncate">{c.title}</p>
                      <p className="text-sm text-muted-foreground truncate inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> {c.room} • {c.prof}
                      </p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      c.tag === "Practical" ? "bg-secondary text-secondary-foreground" : "bg-primary-fixed text-on-primary-fixed"
                    }`}>{c.tag}</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <Card>
              <p className="text-[11px] tracking-[0.22em] font-bold text-muted-foreground">ENROLLED PROGRAM</p>
              <div className="mt-1 flex items-start justify-between">
                <p className="font-display font-extrabold text-2xl text-primary">{mockStudent.program}, Semester {mockStudent.semester}</p>
                <span className="grid place-items-center h-10 w-10 rounded-md bg-primary-fixed text-on-primary-fixed">
                  <BookMarked className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <BadgeCheck className="h-4 w-4 text-success" /> Section {mockStudent.section}
              </div>
            </Card>
            <Card>
              <p className="text-[11px] tracking-[0.22em] font-bold text-muted-foreground">NEXT EXAM</p>
              <p className="mt-1 font-display font-extrabold text-2xl text-primary">Cloud Computing</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-destructive font-bold">In 4 Days</span>
                <span className="text-muted-foreground">Oct 24, 2024</span>
              </div>
            </Card>
            <div>
              <h3 className="font-display font-extrabold text-2xl text-primary mb-4">Notifications</h3>
              <div className="space-y-3">
                {assignments.map((a) => (
                  <div key={a.id} className="bg-surface-lowest rounded-xl p-4 shadow-card border-l-4 border-primary-fixed">
                    <div className="flex items-center gap-2">
                      <FilePlus2 className="h-4 w-4 text-primary" />
                      <p className="text-[10px] tracking-[0.2em] font-bold text-primary">{a.section} • {a.course}</p>
                    </div>
                    <p className="font-display font-bold text-primary text-sm mt-1">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Due {new Date(a.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })} • {a.points} pts
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[11px] text-primary font-semibold">{relativeTime(a.postedAt)}</p>
                      {a.fileUrl && (
                        <a
                          href={a.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={a.fileName ?? undefined}
                          className="text-[11px] font-bold text-primary hover:underline"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {announcements.map((n) => (
                  <div key={n.id} className="bg-surface-lowest rounded-xl p-4 shadow-card border-l-4 border-secondary">
                    <div className="flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-primary" />
                      <p className="text-[10px] tracking-[0.2em] font-bold text-primary">{n.section} • {n.subject}</p>
                    </div>
                    <p className="font-display font-bold text-primary text-sm mt-1">{n.message}</p>
                    <p className="text-[11px] text-primary font-semibold mt-2">{relativeTime(n.postedAt)} • {n.postedBy}</p>
                  </div>
                ))}
                {assignments.length === 0 && announcements.length === 0 && (
                  <div className="bg-surface-lowest rounded-xl p-4 shadow-card">
                    <p className="text-sm text-muted-foreground">No notifications yet.</p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

function Chip({ children, variant = "blue" }: { children: React.ReactNode; variant?: "blue" | "gold" }) {
  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
      variant === "gold" ? "bg-secondary text-secondary-foreground" : "bg-primary-fixed text-on-primary-fixed"
    }`}>{children}</span>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-surface-lowest rounded-xl p-5 shadow-card">{children}</div>;
}

function NotifCard({ tone, icon, title, time, body, action }: {
  tone: "gold" | "blue" | "rose"; icon: React.ReactNode; title: string; time: string; body: string; action?: React.ReactNode;
}) {
  const ring = tone === "gold" ? "border-secondary" : tone === "blue" ? "border-primary-fixed" : "border-destructive";
  const iconBg = tone === "gold" ? "bg-secondary text-secondary-foreground" : tone === "blue" ? "bg-primary-fixed text-on-primary-fixed" : "bg-destructive/15 text-destructive";
  return (
    <div className={`bg-surface-lowest rounded-xl p-4 shadow-card border-l-4 ${ring}`}>
      <div className="flex gap-3">
        <span className={`grid place-items-center h-10 w-10 rounded-lg shrink-0 ${iconBg}`}>{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-3">
            <p className="font-display font-bold text-primary leading-tight">{title}</p>
            <span className="text-[10px] tracking-[0.18em] font-bold text-muted-foreground shrink-0">{time}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

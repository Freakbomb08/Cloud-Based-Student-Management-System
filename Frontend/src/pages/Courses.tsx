import { useState } from "react";
import { BarChart3, BookmarkPlus, BookOpen, Calendar, ChevronLeft, ChevronRight, Grid2x2, Leaf, List, Megaphone, Plus, ShieldCheck, SquarePlay } from "lucide-react";
import { courses } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { PortalTopbar } from "@/components/PortalTopbar";
import { MobileHeader } from "@/components/MobileHeader";

const Courses = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const featured = courses.find((c) => c.featured)!;
  const others = courses.filter((c) => !c.featured);

  return (
    <>
      <PortalTopbar search="Search courses..." />

      {/* ==================== MOBILE ==================== */}
      <div className="lg:hidden bg-surface min-h-screen">
        <MobileHeader showBell={false} />
        <div className="px-5 pb-6 space-y-6">
          {/* Hero panel */}
          <section className="rounded-2xl bg-gradient-primary text-primary-foreground p-6 shadow-card">
            <p className="text-[11px] tracking-[0.25em] font-bold text-secondary">SEMESTER IV • ACADEMIC YEAR 2024</p>
            <h1 className="mt-3 font-display font-extrabold text-4xl leading-tight">Current Course Load</h1>
            <p className="mt-3 text-sm opacity-80">
              Manage your academic progress, track attendance, and access curriculum resources for your active subjects.
            </p>
          </section>

          {/* Featured (carousel-style) */}
          <article className="bg-surface-lowest rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold tracking-wider">CS-204</span>
              <span className="text-xs italic text-muted-foreground">Core Subject</span>
            </div>
            <h3 className="mt-3 font-display font-extrabold text-2xl text-primary">Programming in Java</h3>

            <div className="mt-4 inline-block bg-surface rounded-lg p-4 border-l-4 border-secondary">
              <p className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground">ATTENDANCE</p>
              <p className="font-display font-extrabold text-3xl text-primary">92%</p>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <Row label="Instructor" value="Dr. Arvind Sharma" />
              <Row label="Next Lecture" value="Tomorrow, 10:30 AM" />
              <Row label="Lab Venue" value="Advanced Computing Lab" />
            </div>

            <div className="mt-5 space-y-3">
              <Button variant="gold" className="w-full"><Calendar /> View Attendance</Button>
              <Button variant="outline" className="w-full">Course Materials</Button>
            </div>

            <div className="flex justify-center gap-1.5 mt-5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="h-2 w-2 rounded-full bg-border" />
              <span className="h-2 w-2 rounded-full bg-border" />
            </div>
          </article>

          {/* Additional Electives */}
          <section>
            <h2 className="font-display font-extrabold text-2xl text-primary mb-3">Additional Electives</h2>
            <div className="space-y-3">
              <ElectiveCard icon={<SquarePlay className="h-5 w-5" />} title="Discrete Mathematics" pct={85} consistency="High" />
              <ElectiveCard icon={<Leaf className="h-5 w-5" />} title="Environmental Science" pct={100} consistency="Perfect" />
              <ElectiveCard icon={<Megaphone className="h-5 w-5" />} title="Technical Communication" pct={94} consistency="High" />
            </div>
          </section>
        </div>

        <footer className="bg-gradient-primary text-primary-foreground py-4 text-center mb-20">
          <p className="text-xs opacity-80">© 2024 IITM Janakpuri. Editorial Information System.</p>
        </footer>
      </div>

      {/* ==================== DESKTOP ==================== */}
      <div className="hidden lg:block px-10 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Stat icon={<BarChart3 className="h-5 w-5" />} label="GLOBAL ATTENDANCE" value="94.2%" tone="blue" />
          <Stat icon={<BookOpen className="h-5 w-5" />} label="TOTAL CLASSES" value="142" tone="gold" />
          <Stat icon={<ShieldCheck className="h-5 w-5" />} label="CONSECUTIVE PRESENCE" value="12 Days" tone="green" highlight />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-extrabold text-3xl text-primary">My Courses</h2>
          <div className="flex bg-surface-low rounded-md p-1">
            <button onClick={() => setView("grid")} className={`grid place-items-center h-9 w-9 rounded ${view === "grid" ? "bg-surface-lowest text-primary shadow-card" : "text-muted-foreground"}`}>
              <Grid2x2 className="h-4 w-4" />
            </button>
            <button onClick={() => setView("list")} className={`grid place-items-center h-9 w-9 rounded ${view === "list" ? "bg-surface-lowest text-primary shadow-card" : "text-muted-foreground"}`}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <article className="bg-surface-lowest rounded-2xl p-6 lg:p-8 shadow-card mb-6">
          <div className="grid lg:grid-cols-[1fr_auto] gap-8">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold tracking-wider">{featured.code}</span>
              <h3 className="mt-4 font-display font-extrabold text-3xl text-primary">{featured.title}</h3>
              <p className="mt-2 text-muted-foreground">{featured.prof} • {featured.room}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="primary">View Syllabus</Button>
                <Button variant="gold"><Calendar /> View Attendance</Button>
              </div>
            </div>
            <div className="bg-surface-low rounded-xl p-5 min-w-[280px]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Attendance</p>
                <p className="font-display font-extrabold text-2xl text-primary">{featured.attendance}%</p>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-primary">
                <button><ChevronLeft className="h-4 w-4" /></button>
                <span className="tracking-[0.2em]">OCTOBER 2024</span>
                <button><ChevronRight className="h-4 w-4" /></button>
              </div>
              <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px]">
                {["MO","TU","WE","TH","FR","SA","SU"].map((d) => <div key={d} className="text-muted-foreground font-bold">{d}</div>)}
                {[
                  {d:30,s:""},{d:1,s:"p"},{d:2,s:"p"},{d:3,s:"p"},{d:4,s:"p"},{d:5,s:""},{d:6,s:""},
                  {d:7,s:"p"},{d:8,s:"l"},{d:9,s:"p"},{d:10,s:"p"},{d:11,s:"a"},{d:12,s:""},{d:13,s:""},
                  {d:14,s:"p"},{d:15,s:"p"},{d:16,s:"today"},{d:17,s:""},{d:18,s:""},{d:19,s:""},{d:20,s:""},
                ].map((c, i) => (
                  <div key={i} className={`aspect-square grid place-items-center rounded-md font-semibold ${
                    c.s === "p" ? "bg-success/15 text-success" :
                    c.s === "l" ? "bg-warning/15 text-warning" :
                    c.s === "a" ? "bg-destructive/15 text-destructive" :
                    c.s === "today" ? "ghost-border bg-surface-lowest text-primary ring-2 ring-primary" :
                    "text-muted-foreground"
                  }`}>{c.d}</div>
                ))}
              </div>
              <div className="mt-3 flex justify-center gap-3 text-[10px] font-bold tracking-wider">
                <Legend dot="bg-success">PRESENT</Legend>
                <Legend dot="bg-warning">LATE</Legend>
                <Legend dot="bg-destructive">ABSENT</Legend>
              </div>
            </div>
          </div>
        </article>

        <div className="grid md:grid-cols-2 gap-5">
          {others.map((c) => (
            <article key={c.code} className="bg-surface-lowest rounded-2xl p-6 shadow-card">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold tracking-wider">{c.code}</span>
                <button className="text-muted-foreground hover:text-primary"><BookmarkPlus className="h-5 w-5" /></button>
              </div>
              <h3 className="mt-4 font-display font-extrabold text-2xl text-primary">{c.title}</h3>
              <p className="mt-1 text-muted-foreground">{c.prof} • {c.room}</p>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-[11px] tracking-[0.2em] font-bold text-muted-foreground">CURRENT ATTENDANCE</span>
                <span className="font-display font-extrabold text-primary">{c.attendance}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-surface-low overflow-hidden">
                <div className={`h-full rounded-full ${c.attendance >= 90 ? "bg-success" : c.attendance >= 80 ? "bg-primary" : "bg-warning"}`} style={{ width: `${c.attendance}%` }} />
              </div>
              <Button variant="outline" className="w-full mt-5">View Attendance</Button>
            </article>
          ))}
        </div>

        <button className="hidden lg:grid fixed bottom-8 right-8 place-items-center h-14 w-14 rounded-2xl bg-secondary text-secondary-foreground shadow-float hover:brightness-105">
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </>
  );
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-display font-bold text-primary">{value}</p>
    </div>
  );
}

function ElectiveCard({ icon, title, pct, consistency }: { icon: React.ReactNode; title: string; pct: number; consistency: string }) {
  return (
    <div className="bg-surface-low rounded-xl p-4">
      <div className="flex items-center justify-between">
        <p className="font-display font-bold text-primary">{title}</p>
        <span className="grid place-items-center h-9 w-9 rounded-md bg-surface-lowest text-primary">{icon}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="font-display font-extrabold text-3xl text-primary">{pct}%</p>
        <p className="text-xs italic text-muted-foreground">Consistency: {consistency}</p>
      </div>
      <button className="mt-2 text-[11px] tracking-[0.2em] font-bold text-primary">VIEW ATTENDANCE</button>
    </div>
  );
}

function Legend({ dot, children }: { dot: string; children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1 text-muted-foreground"><span className={`h-2 w-2 rounded-full ${dot}`} /> {children}</span>;
}

interface StatProps { icon: React.ReactNode; label: string; value: string; tone: "blue" | "gold" | "green"; highlight?: boolean }
function Stat({ icon, label, value, tone, highlight }: StatProps) {
  const iconBg = tone === "blue" ? "bg-primary-fixed text-on-primary-fixed" : tone === "gold" ? "bg-secondary/30 text-secondary-foreground" : "bg-success/15 text-success";
  return (
    <div className={`bg-surface-lowest rounded-2xl p-6 shadow-card flex items-center justify-between ${highlight ? "border-l-4 border-secondary" : ""}`}>
      <div>
        <p className="text-[11px] tracking-[0.22em] font-bold text-muted-foreground">{label}</p>
        <p className="mt-2 font-display font-extrabold text-3xl text-primary">{value}</p>
      </div>
      <span className={`grid place-items-center h-12 w-12 rounded-xl ${iconBg}`}>{icon}</span>
    </div>
  );
}

export default Courses;

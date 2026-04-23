import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Search, X } from "lucide-react";
import { classRoster, teacherClasses } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { PortalTopbar } from "@/components/PortalTopbar";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Status = "present" | "absent" | null;

const Attendance = () => {
  const navigate = useNavigate();
  const [classCode, setClassCode] = useState(teacherClasses[0].code);
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  const cls = teacherClasses.find((c) => c.code === classCode)!;
  const filtered = useMemo(
    () => classRoster.filter((s) => s.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  const presentCount = Object.values(statuses).filter((s) => s === "present").length;
  const absentCount = Object.values(statuses).filter((s) => s === "absent").length;
  const remaining = classRoster.length - presentCount - absentCount;

  const setAll = (status: Status) =>
    setStatuses(Object.fromEntries(classRoster.map((s) => [s.id, status])));

  const submit = () => {
    toast({
      title: "Attendance submitted",
      description: `${cls.code} • ${presentCount} present, ${absentCount} absent`,
    });
    navigate("/teacher");
  };

  return (
    <>
      <PortalTopbar search="Search students…" />
      <div className="bg-surface min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-5 pt-6 pb-4">
          <Link to="/teacher" className="grid place-items-center h-10 w-10 rounded-full hover:bg-surface-low">
            <ArrowLeft className="h-5 w-5 text-primary" />
          </Link>
          <p className="font-display font-extrabold text-primary text-lg">Mark Attendance</p>
        </header>

        <div className="px-5 lg:px-10 pb-32 lg:pb-12 space-y-6 max-w-5xl mx-auto">
          {/* Title (desktop) */}
          <h1 className="hidden lg:block font-display font-extrabold text-display-md text-primary tracking-tight">
            Mark Attendance
          </h1>

          {/* Class selector */}
          <section className="bg-surface-lowest rounded-2xl p-5 shadow-card">
            <p className="text-[11px] tracking-[0.25em] font-bold text-muted-foreground mb-3">SELECT CLASS</p>
            <div className="flex flex-wrap gap-2">
              {teacherClasses.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setClassCode(c.code)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold transition",
                    classCode === c.code
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-low text-foreground"
                  )}
                >
                  {c.code} • {c.title}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </section>

          {/* Stats + bulk */}
          <section className="grid grid-cols-3 gap-3">
            <Stat label="PRESENT" value={presentCount} tone="success" />
            <Stat label="ABSENT" value={absentCount} tone="destructive" />
            <Stat label="REMAINING" value={remaining} tone="muted" />
          </section>

          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" onClick={() => setAll("present")}>Mark all present</Button>
            <Button variant="ghost" size="sm" onClick={() => setAll(null)}>Reset</Button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-surface-lowest rounded-full h-12 px-4 ghost-border">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search students…"
              className="bg-transparent outline-none flex-1 text-sm"
            />
          </div>

          {/* Roster */}
          <section className="space-y-2">
            {filtered.map((s) => {
              const st = statuses[s.id] ?? null;
              return (
                <div key={s.id} className="bg-surface-lowest rounded-xl p-4 flex items-center gap-3 shadow-card">
                  <span className="grid place-items-center h-11 w-11 rounded-full bg-primary-fixed/20 text-primary text-xs font-bold shrink-0">
                    {s.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-primary text-sm">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.roll}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="Present"
                      onClick={() => setStatuses((p) => ({ ...p, [s.id]: "present" }))}
                      className={cn(
                        "h-10 w-10 rounded-full grid place-items-center transition",
                        st === "present" ? "bg-success text-success-foreground" : "bg-surface-low text-muted-foreground"
                      )}
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      aria-label="Absent"
                      onClick={() => setStatuses((p) => ({ ...p, [s.id]: "absent" }))}
                      className={cn(
                        "h-10 w-10 rounded-full grid place-items-center transition",
                        st === "absent" ? "bg-destructive text-destructive-foreground" : "bg-surface-low text-muted-foreground"
                      )}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-10">No students match your search.</p>
            )}
          </section>
        </div>

        {/* Sticky submit */}
        <div className="fixed bottom-0 inset-x-0 bg-surface-lowest/95 backdrop-blur border-t border-border/40 px-5 lg:px-10 py-4 z-40">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {presentCount + absentCount}/{classRoster.length} marked
            </p>
            <Button variant="primary" size="lg" onClick={submit} disabled={presentCount + absentCount === 0}>
              Submit Attendance
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

function Stat({ label, value, tone }: { label: string; value: number; tone: "success" | "destructive" | "muted" }) {
  const cls = tone === "success" ? "text-success" : tone === "destructive" ? "text-destructive" : "text-primary";
  return (
    <div className="bg-surface-lowest rounded-xl p-4 shadow-card text-center">
      <p className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground">{label}</p>
      <p className={cn("font-display font-extrabold text-3xl mt-1", cls)}>{value}</p>
    </div>
  );
}

export default Attendance;

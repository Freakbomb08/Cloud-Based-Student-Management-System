import { useState } from "react";
import { MoreVertical, Phone, Plus, Search, Send, Smile, Video } from "lucide-react";
import { conversations, messages, mockStudent } from "@/data/mock";
import { PortalTopbar } from "@/components/PortalTopbar";
import { MobileHeader } from "@/components/MobileHeader";

const facultyDirectory = [
  { name: "Dr. Arpita Sharma", role: "HOD - Computer Science", preview: '"The seminar has been rescheduled..."', time: "10:45 AM", active: true, initials: "AS", featured: true },
  { name: "Prof. Rajiv Mehra", role: "Mathematics Department", preview: "Please upload the assignment by tonight.", time: "Yesterday", initials: "RM" },
  { name: "Ms. Neha Gupta", role: "Communication Skills", preview: "Your feedback on the project is ready.", time: "Monday", initials: "NG" },
  { name: "Dr. Vikram Singh", role: "Dean of Academics", preview: "Application for leave has been approved.", time: "23 Oct", initials: "VS" },
];

const Chat = () => {
  const [tab, setTab] = useState("All");

  return (
    <>
      <PortalTopbar search="Search conversations..." />

      {/* ==================== MOBILE ==================== */}
      <div className="lg:hidden bg-surface min-h-screen pb-24">
        <MobileHeader />
        <div className="px-5 mt-3">
          <h1 className="font-display font-extrabold text-4xl text-primary">Faculty Directory</h1>
          <div className="mt-5 flex items-center gap-2 bg-surface-high rounded-full h-12 px-4 ghost-border">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input className="bg-transparent outline-none flex-1 text-sm" placeholder="Search faculty member..." />
          </div>

          <div className="mt-5 space-y-4">
            {facultyDirectory.map((f) => (
              <button
                key={f.name}
                className={`w-full text-left rounded-xl p-4 shadow-card flex items-start gap-3 transition-all ${
                  f.featured ? "bg-surface-lowest border-l-4 border-secondary" : "bg-surface-lowest"
                }`}
              >
                <div className="relative shrink-0">
                  <span className="grid place-items-center h-12 w-12 rounded-xl bg-primary-fixed text-on-primary-fixed font-bold">{f.initials}</span>
                  {f.active && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-surface-lowest" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <p className="font-display font-bold text-primary">{f.name}</p>
                    <span className="text-[11px] text-muted-foreground shrink-0">{f.time}</span>
                  </div>
                  <p className="text-sm text-foreground font-semibold">{f.role}</p>
                  <p className="text-sm text-muted-foreground mt-1 italic truncate">{f.preview}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== DESKTOP ==================== */}
      <div className="hidden lg:block px-10 py-2 h-[calc(100vh-5rem)]">
        <div className="h-full grid grid-cols-[360px_1fr] gap-6">
          {/* Conversation list */}
          <section className="flex flex-col min-h-0">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display font-extrabold text-3xl text-primary">Messages</h2>
              <span className="text-[11px] tracking-[0.22em] font-bold text-muted-foreground">12 ACTIVE</span>
            </div>
            <div className="flex gap-2 mb-4">
              {["All","Students","Faculty","Support"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 h-9 rounded-full text-xs font-bold ${tab === t ? "bg-primary text-primary-foreground" : "bg-surface-lowest text-foreground ghost-border"}`}
                >{t}</button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {conversations.map((c, i) => (
                <button
                  key={c.id}
                  className={`w-full text-left rounded-xl p-4 shadow-card flex items-center gap-3 transition-all ${
                    i === 0 ? "bg-surface-lowest border-l-4 border-secondary" : "bg-surface-lowest hover:translate-x-0.5"
                  }`}
                >
                  <div className="relative">
                    <span className="grid place-items-center h-11 w-11 rounded-lg bg-primary-fixed text-on-primary-fixed font-bold text-sm">{c.initials}</span>
                    {c.active && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-surface-lowest" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-display font-bold text-primary truncate">{c.name}</p>
                      <span className="text-[11px] text-muted-foreground shrink-0">{c.time}</span>
                    </div>
                    <p className={`text-xs truncate ${c.preview === "Typing…" ? "italic text-primary font-semibold" : "text-muted-foreground"}`}>
                      {c.preview}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Thread */}
          <section className="bg-surface-lowest rounded-2xl shadow-card flex flex-col min-h-0">
            <div className="flex items-center justify-between p-5 ghost-border border-b">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center h-11 w-11 rounded-lg bg-primary-fixed text-on-primary-fixed font-bold">AS</span>
                <div>
                  <p className="font-display font-bold text-primary">Dr. Ananya Sharma</p>
                  <p className="text-xs text-success font-semibold">● Active Now</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <button className="grid place-items-center h-10 w-10 rounded-full hover:bg-surface-low"><Video className="h-5 w-5" /></button>
                <button className="grid place-items-center h-10 w-10 rounded-full hover:bg-surface-low"><Phone className="h-5 w-5" /></button>
                <button className="grid place-items-center h-10 w-10 rounded-full hover:bg-surface-low"><MoreVertical className="h-5 w-5" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <p className="text-center text-[11px] tracking-[0.2em] font-bold text-muted-foreground">── TODAY ──</p>
              {messages.map((m, i) => (
                <Bubble key={i} from={m.from as "me" | "them"} text={m.text} time={m.time} />
              ))}
              <Bubble from="them" text="..." time="" typing />
            </div>

            <div className="p-4 ghost-border border-t">
              <div className="flex items-center gap-3 bg-surface rounded-full pl-4 pr-2 h-12 ghost-border">
                <button className="text-muted-foreground"><Plus className="h-5 w-5" /></button>
                <input className="flex-1 bg-transparent outline-none text-sm" placeholder="Type a message…" />
                <button className="text-muted-foreground"><Smile className="h-5 w-5" /></button>
                <button className="grid place-items-center h-9 w-9 rounded-full bg-gradient-primary text-primary-foreground">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

function Bubble({ from, text, time, typing }: { from: "me" | "them"; text: string; time: string; typing?: boolean }) {
  const me = from === "me";
  return (
    <div className={`flex items-end gap-3 ${me ? "flex-row-reverse" : ""}`}>
      {!me && <span className="grid place-items-center h-8 w-8 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold shrink-0">AS</span>}
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${me ? "bg-gradient-primary text-primary-foreground" : "bg-surface text-foreground"}`}>
        {typing ? (
          <div className="flex gap-1 py-1">
            <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse-soft" />
            <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse-soft" style={{ animationDelay: "0.2s" }} />
            <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse-soft" style={{ animationDelay: "0.4s" }} />
          </div>
        ) : (
          <>
            <p className="text-sm leading-relaxed">{text}</p>
            {time && <p className={`text-[10px] mt-2 ${me ? "text-primary-foreground/70 text-right" : "text-muted-foreground"}`}>{time}</p>}
          </>
        )}
      </div>
    </div>
  );
}

// Need mockStudent import even if unused — keep imports tidy
void mockStudent;

export default Chat;

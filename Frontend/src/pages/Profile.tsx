import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, Calendar, Edit2, Eye, EyeOff, GraduationCap, IdCard, LogOut, Mail, MapPin, Phone, Settings, Shield, ShieldCheck, User } from "lucide-react";
import { mockStudent } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { PortalTopbar } from "@/components/PortalTopbar";

const Profile = () => {
  const navigate = useNavigate();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <>
      <PortalTopbar />

      {/* ==================== MOBILE ==================== */}
      <div className="lg:hidden bg-surface min-h-screen">
        {/* Mobile top */}
        <div className="flex items-center justify-between px-5 pt-5">
          <button onClick={() => navigate(-1)} className="grid place-items-center h-10 w-10 rounded-full hover:bg-surface-low">
            <ArrowLeft className="h-5 w-5 text-primary" />
          </button>
          <h1 className="font-display font-extrabold text-xl text-primary">Student Profile</h1>
          <button className="grid place-items-center h-10 w-10 rounded-full hover:bg-surface-low">
            <Settings className="h-5 w-5 text-primary" />
          </button>
        </div>

        <div className="px-5 mt-5 space-y-7">
          {/* Hero card */}
          <section className="rounded-2xl bg-gradient-primary text-primary-foreground p-5 shadow-card relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-secondary/10 rounded-full -translate-y-10 translate-x-10" />
            <div className="relative flex items-center gap-4">
              <div className="relative">
                <img src={mockStudent.avatar} alt={mockStudent.name} className="h-20 w-20 rounded-2xl object-cover ring-4 ring-secondary/40" />
                <span className="absolute -bottom-1 -right-1 grid place-items-center h-6 w-6 rounded-full bg-secondary text-secondary-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-extrabold text-2xl truncate">{mockStudent.name}</h2>
                <p className="text-xs opacity-80 mt-0.5">ID: {mockStudent.id}</p>
                <span className="mt-2 inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary text-[11px] tracking-[0.2em] font-bold ring-1 ring-secondary/40">
                  BATCH 2024-28
                </span>
              </div>
            </div>
            <div className="relative mt-5 grid grid-cols-2 gap-3">
              <Button variant="gold" className="w-full"><Edit2 /> Edit Profile</Button>
              <Button variant="outline" onClick={() => navigate("/login")} className="w-full bg-transparent text-primary-foreground ghost-border hover:bg-primary-foreground/10">
                <LogOut /> Sign Out
              </Button>
            </div>
          </section>

          {/* Academic Info */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-extrabold text-2xl text-primary">Academic Info</h3>
              <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-bold tracking-[0.18em]">IITM JANAKPURI</span>
            </div>
            <div className="bg-surface-lowest rounded-xl p-4 shadow-card flex items-center gap-3">
              <span className="grid place-items-center h-12 w-12 rounded-lg bg-primary-fixed text-on-primary-fixed">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground">COURSE</p>
                <p className="font-display font-extrabold text-primary leading-tight">Bachelor of Computer Applications</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="bg-surface-lowest rounded-xl p-4 shadow-card">
                <p className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground">SEMESTER</p>
                <p className="mt-1 font-display font-extrabold text-3xl text-primary">0{mockStudent.semester}</p>
              </div>
              <div className="bg-surface-lowest rounded-xl p-4 shadow-card">
                <p className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground">SECTION</p>
                <p className="mt-1 font-display font-extrabold text-3xl text-primary">{mockStudent.section}</p>
              </div>
            </div>
          </section>

          {/* Personal Details */}
          <section>
            <h3 className="font-display font-extrabold text-2xl text-primary mb-3">Personal Details</h3>
            <div className="space-y-3">
              <MobileInfoRow icon={<Mail className="h-5 w-5" />} label="EMAIL ADDRESS" value="jayesh.dawar24@iitmjp.ac.in" />
              <MobileInfoRow icon={<Phone className="h-5 w-5" />} label="PHONE NUMBER" value="+91 98765 43210" />
              <MobileInfoRow icon={<Calendar className="h-5 w-5" />} label="DATE OF BIRTH" value="October 14, 2005" />
            </div>
          </section>

          {/* Security */}
          <section>
            <h3 className="font-display font-extrabold text-2xl text-primary mb-3">Security</h3>
            <div className="bg-surface-lowest rounded-xl p-4 shadow-card flex items-center gap-3">
              <span className="grid place-items-center h-12 w-12 rounded-lg bg-primary-fixed text-on-primary-fixed">
                <Shield className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground">ACCOUNT ACCESS</p>
                <p className="font-display font-bold text-primary">Password & Authentication</p>
              </div>
              <Button variant="gold" size="sm">Update<br/>Password</Button>
            </div>
          </section>

          {/* Address */}
          <section>
            <h3 className="font-display font-extrabold text-2xl text-primary mb-3">Contact Address</h3>
            <div className="bg-surface-lowest rounded-xl p-4 shadow-card flex gap-3">
              <span className="grid place-items-center h-12 w-12 rounded-lg bg-secondary/30 text-secondary-foreground shrink-0">
                <MapPin className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-display font-bold text-primary leading-relaxed">
                  H-12, Green Park Extension,<br />New Delhi - 110016,<br />India
                </p>
                <button className="mt-3 text-sm font-bold text-primary inline-flex items-center gap-1 hover:underline">
                  View on Maps ↗
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ==================== DESKTOP ==================== */}
      <div className="hidden lg:block px-10 pb-12">
        <header className="pt-2 pb-8 max-w-3xl">
          <h1 className="font-display font-extrabold text-display-lg tracking-tight text-primary">Student Profile</h1>
          <p className="mt-3 text-muted-foreground text-base max-w-xl">
            Manage your academic identity, contact details, and account security within the IITM Janakpuri portal.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Left identity column */}
          <div className="col-span-4 space-y-6">
            <section className="bg-surface-lowest rounded-2xl p-8 shadow-card text-center">
              <div className="relative inline-block">
                <img src={mockStudent.avatar} alt={mockStudent.name} className="h-36 w-36 rounded-2xl object-cover ring-4 ring-surface-low" />
                <button className="absolute -bottom-2 -right-2 grid place-items-center h-10 w-10 rounded-xl bg-secondary text-secondary-foreground shadow-card hover:brightness-105">
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
              <h2 className="mt-5 font-display font-extrabold text-3xl text-primary">{mockStudent.name}</h2>
              <p className="mt-1 text-muted-foreground">B.Tech – Computer Science</p>
              <div className="mt-5 flex flex-col items-center gap-2">
                <span className="px-4 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] tracking-[0.18em] font-bold">ACTIVE STUDENT</span>
                <span className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-[11px] tracking-[0.18em] font-bold">BATCH 2024</span>
              </div>
            </section>

            <section className="bg-gradient-primary text-primary-foreground rounded-2xl p-6 shadow-card relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-secondary/10" />
              <div className="relative flex items-center justify-between">
                <p className="text-[11px] tracking-[0.22em] font-bold opacity-80">ATTENDANCE</p>
                <span className="grid place-items-center h-9 w-9 rounded-md bg-primary-foreground/15">
                  <BarChart3 className="h-4 w-4" />
                </span>
              </div>
              <p className="relative mt-4 font-display font-extrabold text-5xl">{mockStudent.attendance}%</p>
              <div className="relative mt-4 h-2 rounded-full bg-primary-foreground/15 overflow-hidden">
                <div className="h-full rounded-full bg-secondary" style={{ width: `${mockStudent.attendance}%` }} />
              </div>
            </section>
          </div>

          {/* Right info column */}
          <div className="col-span-8 space-y-6">
            <section className="bg-surface-lowest rounded-2xl p-8 shadow-card">
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                  <span className="grid place-items-center h-12 w-12 rounded-xl bg-secondary text-secondary-foreground">
                    <User className="h-5 w-5" />
                  </span>
                  <h3 className="font-display font-extrabold text-3xl text-primary">Personal Info</h3>
                </div>
                <button className="text-sm font-bold text-primary hover:underline">Edit Details</button>
              </div>

              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                <DesktopField icon={<Mail className="h-4 w-4" />} label="EMAIL ADDRESS" value="jayesh.dawar@iitm.edu" />
                <DesktopField icon={<Phone className="h-4 w-4" />} label="PHONE NUMBER" value="+91 98765 43210" />
                <DesktopField icon={<Calendar className="h-4 w-4" />} label="DATE OF BIRTH" value="14 July 2002" />
                <DesktopField icon={<IdCard className="h-4 w-4" />} label="STUDENT ID" value="2024-IITM-01" />
              </div>

              <div className="mt-6 bg-surface rounded-xl p-5">
                <p className="text-[11px] tracking-[0.22em] font-bold text-muted-foreground">ADDRESS</p>
                <div className="mt-2 flex items-center gap-2 text-foreground">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="font-display font-bold text-primary">H-12, Sector 5, Janakpuri, New Delhi, Delhi 110058</p>
                </div>
              </div>
            </section>

            <section className="bg-surface-lowest rounded-2xl p-8 shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <span className="grid place-items-center h-12 w-12 rounded-xl bg-destructive/15 text-destructive">
                  <Shield className="h-5 w-5" />
                </span>
                <h3 className="font-display font-extrabold text-3xl text-primary">Security</h3>
              </div>
              <p className="mt-2 text-muted-foreground max-w-md">
                Update your account password to maintain academic integrity and protect your student portal data.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-8">
                <form className="space-y-5">
                  <PasswordField id="cur" label="Current Password" show={showCurrent} onToggle={() => setShowCurrent((s) => !s)} />
                  <PasswordField id="new" label="New Password" show={showNew} onToggle={() => setShowNew((s) => !s)} />
                  <Button variant="primary" size="lg">Update Password</Button>
                </form>

                <aside className="bg-surface rounded-xl p-6 border-l-4 border-secondary">
                  <h4 className="font-display font-extrabold text-primary text-lg">Security Recommendations</h4>
                  <ul className="mt-4 space-y-3 text-sm">
                    {[
                      "Use at least 12 characters with symbols.",
                      "Avoid using your Student ID in passwords.",
                      "Enable 2FA from the settings panel.",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2 text-foreground">
                        <span className="grid place-items-center h-5 w-5 rounded-full bg-secondary/30 text-secondary-foreground shrink-0 mt-0.5">
                          <ShieldCheck className="h-3 w-3" />
                        </span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-4 ghost-border border-t flex justify-between items-center text-xs">
                    <span className="tracking-[0.2em] font-bold text-muted-foreground">LAST CHANGED</span>
                    <span className="font-semibold text-foreground">3 months ago</span>
                  </div>
                </aside>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

function DesktopField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.22em] font-bold text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-center gap-2 text-foreground">
        <span className="text-muted-foreground">{icon}</span>
        <p className="font-display font-bold text-primary">{value}</p>
      </div>
    </div>
  );
}

function MobileInfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-surface-lowest rounded-xl p-4 shadow-card flex items-center gap-3">
      <span className="text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground">{label}</p>
        <p className="font-display font-bold text-primary truncate">{value}</p>
      </div>
    </div>
  );
}

function PasswordField({ id, label, show, onToggle }: { id: string; label: string; show: boolean; onToggle: () => void }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-foreground">{label}</label>
      <div className="mt-2 flex items-center gap-3 bg-surface-high rounded-md h-12 px-4 ghost-border focus-within:bg-surface-lowest focus-within:shadow-[inset_0_-2px_0_0_hsl(var(--primary))] transition-colors">
        <input
          id={id}
          type={show ? "text" : "password"}
          defaultValue="password"
          className="flex-1 bg-transparent outline-none text-foreground tracking-widest"
        />
        <button type="button" onClick={onToggle} className="text-muted-foreground hover:text-primary">
          {show ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export default Profile;

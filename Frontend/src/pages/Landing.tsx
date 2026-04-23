import { Link } from "react-router-dom";
import { ArrowRight, Calendar, ClipboardCheck, GraduationCap, Library, Receipt, ShieldCheck, Shield, BookOpenCheck } from "lucide-react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import campusHero from "@/assets/campus-hero.jpg";
import students from "@/assets/students.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-surface text-foreground">
      {/* Top bar */}
      <header className="container flex items-center justify-between py-6">
        <Brand variant="compact" />
        <button aria-label="Menu" className="md:hidden p-2">
          <span className="block w-6 h-0.5 bg-primary mb-1.5" />
          <span className="block w-6 h-0.5 bg-primary mb-1.5" />
          <span className="block w-6 h-0.5 bg-primary" />
        </button>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <a href="#ecosystem" className="text-foreground hover:text-primary">Ecosystem</a>
          <a href="#legacy" className="text-foreground hover:text-primary">Legacy</a>
          <a href="#access" className="text-foreground hover:text-primary">Portal Access</a>
          <Link to="/login">
            <Button variant="primary" size="sm">Student Login <ArrowRight /></Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="container pt-6 pb-16">
        <p className="text-[11px] tracking-[0.25em] font-semibold text-muted-foreground mb-6">
          ──── ESTABLISHED EXCELLENCE
        </p>

        <h1 className="font-display font-extrabold text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.98] tracking-tight text-primary text-balance max-w-5xl">
          The Digital{" "}
          <span className="relative inline-block">
            <span className="relative z-10 px-3">Campus</span>
            <span aria-hidden className="absolute inset-0 bg-secondary -skew-y-2 rounded-sm" />
          </span>
          <br />
          Experience.
        </h1>

        <p className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
          An editorial-first student management system designed for the scholars of tomorrow.
          Manage your academic journey with institutional precision and modern fluidity.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/login">
            <Button variant="primary" size="lg">Access Student Portal <ArrowRight /></Button>
          </Link>
          <Button variant="outline" size="lg">Faculty Resources</Button>
        </div>

        {/* Hero image with badge */}
        <div className="relative mt-14 rounded-2xl overflow-hidden shadow-ambient">
          <img src={campusHero} alt="IITM Janakpuri campus at twilight" width={1536} height={1024} className="w-full h-[280px] md:h-[440px] object-cover" />
          <div className="absolute top-5 right-5 glass rounded-xl px-4 py-3 flex items-center gap-3 shadow-float">
            <span className="grid place-items-center h-8 w-8 rounded-md bg-secondary text-secondary-foreground">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <p className="text-[11px] tracking-[0.18em] font-bold text-primary">OFFICIAL INSTITUTIONAL PORTAL</p>
              <p className="text-[10px] text-muted-foreground">Sanctioned. Driven. Encrypted.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section id="ecosystem" className="container py-12 md:py-20">
        <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight text-primary text-balance">
          Academic <br className="md:hidden" />Ecosystem
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl">
          Every tool you need to excel, curated into a single, seamless digital experience.
        </p>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-2 gap-5">
          <FeatureCard
            tone="lowest"
            icon={<ClipboardCheck className="h-5 w-5" />}
            kicker=""
            title="Live Attendance"
            body="Real-time tracking of lecture presence with automated bio-attendance alerts for students."
          />
          <FeatureCard
            tone="navy"
            icon={<BookOpenCheck className="h-5 w-5" />}
            kicker="EXAM RESULTS & ANALYSIS"
            title="Exam Results & Analysis"
            body="Access comprehensive scorecards, historical CGPA trends, and percentile rankings across all academic departments."
            chips={["Semester Archives", "Credit Tracking"]}
          />
          <FeatureCard
            tone="low"
            icon={<Receipt className="h-5 w-5" />}
            kicker="FINANCIAL PORTAL"
            title="Fee Status & Receipts"
            body="Seamlessly settle tuition fees, track payment history, and download official receipts for scholarship verification."
          />
          <FeatureCard
            tone="lowest"
            icon={<Calendar className="h-5 w-5" />}
            kicker=""
            title="Academic Calendar"
            body="Stay synchronized with university holidays, exam schedules, and cultural event timelines."
            footer={
              <div className="mt-4 rounded-xl bg-surface p-5">
                <p className="font-display text-4xl font-extrabold tracking-tight text-primary">2024</p>
                <p className="text-[11px] tracking-[0.22em] font-semibold text-muted-foreground mt-1">CALENDAR ACTIVE</p>
              </div>
            }
          />
        </div>
      </section>

      {/* Legacy */}
      <section id="legacy" className="container py-12 md:py-20">
        <h2 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight text-primary text-balance max-w-3xl">
          Legacy of Learning, Engineered for Impact.
        </h2>

        <div className="mt-12 grid md:grid-cols-2 gap-12 items-start">
          <ol className="space-y-7">
            {[
              { n: "01", title: "Renowned Faculty", body: "Learn from industry veterans and PhD scholars dedicated to mentorship and research." },
              { n: "02", title: "Modern Infrastructure", body: "Smart classrooms, high-tech labs, and a sprawling library system integrated with digital resources." },
              { n: "03", title: "Global Network", body: "Connect with over 20,000 alumni worldwide holding leadership positions in top-tier organizations." },
            ].map((it) => (
              <li key={it.n} className="grid grid-cols-[auto_1fr] gap-5">
                <span className="font-display font-extrabold text-2xl text-secondary leading-none">{it.n}</span>
                <div>
                  <h3 className="font-display font-bold text-xl text-primary">{it.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{it.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden row-span-2 shadow-card">
              <img src={students} alt="IITM Janakpuri students" width={1024} height={1024} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl bg-secondary text-secondary-foreground p-6 flex flex-col justify-end aspect-square">
              <p className="font-display font-extrabold text-5xl">50+</p>
              <p className="text-[11px] tracking-[0.2em] font-bold mt-2">RESEARCH LABS</p>
            </div>
            <div className="rounded-2xl bg-surface-lowest p-6 flex flex-col justify-end aspect-square shadow-card">
              <p className="font-display font-extrabold text-5xl text-primary">98%</p>
              <p className="text-[11px] tracking-[0.2em] font-bold text-muted-foreground mt-2">PLACEMENT RATE</p>
            </div>
          </div>
        </div>
      </section>

      {/* Access CTA */}
      <section id="access" className="container py-16 md:py-24">
        <p className="text-center text-[11px] tracking-[0.25em] font-semibold text-muted-foreground">
          ──── INSTITUTIONAL GATEWAY ────
        </p>
        <h2 className="mt-4 text-center font-display font-extrabold text-4xl md:text-6xl tracking-tight text-primary text-balance max-w-3xl mx-auto">
          Access Your Academic World.
        </h2>
        <p className="mt-4 text-center text-muted-foreground max-w-md mx-auto">
          Ready to check your progress? Select your portal below to sign in securely using your institutional credentials.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
          <Link to="/login" className="flex-1">
            <Button variant="primary" size="xl" className="w-full">
              Student Login <GraduationCap />
            </Button>
          </Link>
          <Button variant="outline" size="xl" className="flex-1">
            Faculty Portal <Library />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-primary text-primary-foreground mt-12">
        <div className="container py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 text-secondary">
              <Shield className="h-4 w-4" />
              <span className="font-display italic font-extrabold tracking-wider">IITM SECURE GATEWAY</span>
            </div>
            <p className="text-xs opacity-80">© 2024 IITM Janakpuri. Editorial Information System.</p>
            <div className="flex gap-6 text-xs opacity-90">
              <a href="#">Privacy Policy</a>
              <a href="#">Support</a>
              <a href="#">Academic Integrity</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  kicker?: string;
  title: string;
  body: string;
  tone?: "lowest" | "low" | "navy";
  chips?: string[];
  footer?: React.ReactNode;
}

function FeatureCard({ icon, kicker, title, body, tone = "lowest", chips, footer }: FeatureCardProps) {
  const styles =
    tone === "navy"
      ? "bg-gradient-primary text-primary-foreground"
      : tone === "low"
      ? "bg-surface-low"
      : "bg-surface-lowest";
  return (
    <article className={`${styles} rounded-2xl p-7 shadow-card relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <span className={`grid place-items-center h-10 w-10 rounded-md ${tone === "navy" ? "bg-secondary text-secondary-foreground" : "bg-primary-fixed text-on-primary-fixed"}`}>
          {icon}
        </span>
        {kicker && (
          <span className={`text-[10px] tracking-[0.22em] font-bold ${tone === "navy" ? "text-secondary" : "text-muted-foreground"}`}>
            {kicker}
          </span>
        )}
      </div>
      <h3 className={`mt-5 font-display font-extrabold text-2xl ${tone === "navy" ? "" : "text-primary"}`}>
        {title}
      </h3>
      <p className={`mt-2 text-sm leading-relaxed ${tone === "navy" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
        {body}
      </p>
      {chips && (
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((c) => (
            <span key={c} className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-semibold">
              {c}
            </span>
          ))}
        </div>
      )}
      {footer}
    </article>
  );
}

export default Landing;

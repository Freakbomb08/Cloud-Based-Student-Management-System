import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, ShieldAlert, User } from "lucide-react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/lib/api";
import towerBg from "@/assets/tower-bg.jpg";

function getRoleHome(role: UserRole) {
  if (role === "faculty") {
    return "/teacher";
  }
  return "/dashboard";
}

const Login = () => {
  const navigate = useNavigate();
  const { appUser, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && appUser) {
      navigate(getRoleHome(appUser.role), { replace: true });
    }
  }, [appUser, loading, navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const user = await signIn(email.trim(), password);
      navigate(getRoleHome(user.role), { replace: true });
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign in. Please verify your credentials.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      <img
        src={towerBg}
        alt=""
        aria-hidden
        width={1280}
        height={1280}
        className="hidden lg:block absolute right-0 top-0 h-full w-1/2 object-cover opacity-60 pointer-events-none"
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="lg:hidden px-6 pt-8">
          <Brand variant="compact" />
        </div>

        <div className="hidden lg:flex flex-1 items-center">
          <div className="container">
            <div className="max-w-xl">
              <div className="text-center mb-10">
                <Brand className="justify-center" />
                <p className="mt-3 text-[11px] tracking-[0.25em] font-semibold text-muted-foreground">
                  INSTITUTIONAL REGISTRAR ACCESS
                </p>
              </div>

              <div className="bg-surface-lowest rounded-2xl p-10 shadow-ambient">
                <h1 className="font-display font-extrabold text-4xl tracking-tight text-primary">
                  Secure Portal Login
                </h1>
                <p className="mt-3 text-muted-foreground">
                  Please sign in with your institutional credentials to access student or faculty resources.
                </p>

                <form onSubmit={submit} className="mt-8 space-y-6">
                  <Field
                    id="d-id"
                    label="INSTITUTIONAL EMAIL"
                    icon={<User className="h-4 w-4" />}
                    type="email"
                    placeholder="student@iitmjanakpuri.com"
                    value={email}
                    onChange={(value) => setEmail(value)}
                  />
                  <Field
                    id="d-pwd"
                    label="SECURITY PASSWORD"
                    icon={<Lock className="h-4 w-4" />}
                    type={showPwd ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(value) => setPassword(value)}
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setShowPwd((s) => !s)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <div className="flex justify-end">
                    <a href="#" className="text-[11px] tracking-[0.2em] font-bold text-primary hover:underline">
                      FORGOT SECURITY KEY?
                    </a>
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Signing In..." : "Sign In to Authority"} <ArrowRight />
                  </Button>
                </form>
              </div>

              <div className="mt-6 flex items-start gap-3 px-2 text-sm text-muted-foreground">
                <ShieldAlert className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <p className="italic">
                  Note: Portal accounts are restricted to active Faculty and Students. Access is managed by the
                  Institutional Administration. New accounts are generated upon registration at the Registrar's Office.
                </p>
              </div>

              <div className="mt-8 flex justify-center gap-8 text-xs tracking-[0.2em] font-bold text-primary">
                <a href="#">IT HELPDESK</a>
                <a href="#">PUBLIC DIRECTORY</a>
              </div>

              <p className="mt-8 text-center text-[11px] tracking-[0.25em] text-muted-foreground/70">
                (c) 2024 THE ACADEMIC AUTHORITY. SECURE GATEWAY V4.2
              </p>
            </div>
          </div>
        </div>

        <div className="lg:hidden flex-1 flex flex-col px-6 pt-10 pb-6">
          <h1 className="font-display font-extrabold text-5xl tracking-tight text-primary">Portal Login</h1>
          <p className="mt-3 text-muted-foreground">Please enter your institutional credentials.</p>

          <form onSubmit={submit} className="mt-10 space-y-6">
            <Field
              id="m-id"
              label="EMAIL"
              icon={<User className="h-4 w-4" />}
              type="email"
              placeholder="student@iitmjanakpuri.com"
              value={email}
              onChange={(value) => setEmail(value)}
            />
            <Field
              id="m-pwd"
              label="PASSWORD"
              icon={<Lock className="h-4 w-4" />}
              type={showPwd ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(value) => setPassword(value)}
              labelRight={
                <a href="#" className="text-xs font-bold text-primary">
                  Forgot?
                </a>
              }
              rightSlot={
                <button type="button" onClick={() => setShowPwd((s) => !s)} className="text-muted-foreground">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <label className="flex items-center gap-3 text-sm text-foreground">
              <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
              Stay logged in for this session
            </label>

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing In..." : "Sign into Portal"} <ArrowRight />
            </Button>
          </form>

          <div className="mt-6 rounded-xl bg-surface-low p-5 border-l-4 border-secondary">
            <div className="flex items-center gap-2 mb-2">
              <span className="grid place-items-center h-7 w-7 rounded-full bg-secondary-foreground text-secondary">
                <ShieldAlert className="h-4 w-4" />
              </span>
              <p className="font-display font-bold text-primary">Restricted Access</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Public sign-ups are disabled. If you do not have an account or have lost access, please visit the{" "}
              <span className="font-bold text-primary">Academic Administration Office</span> for assistance.
            </p>
          </div>

          <div className="mt-auto pt-10 flex gap-6 text-[11px] tracking-[0.2em] font-bold text-primary">
            <a href="#">PRIVACY POLICY</a>
            <a href="#">IT SUPPORT</a>
            <a href="#">GUIDELINES</a>
          </div>

          <Link to="/" className="mt-6 text-xs text-muted-foreground hover:text-primary">
            Back to home
          </Link>
        </div>

        <footer className="lg:hidden bg-gradient-primary text-primary-foreground py-6 text-center">
          <p className="font-display italic font-extrabold tracking-wider text-secondary">IITM SECURE GATEWAY</p>
          <p className="text-xs mt-2 opacity-80">(c) 2024 IITM Janakpuri. Editorial Information System.</p>
          <div className="mt-2 flex justify-center gap-6 text-xs opacity-90">
            <a href="#">Academic Integrity</a>
            <a href="#">Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

interface FieldProps {
  id: string;
  label: string;
  icon: ReactNode;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rightSlot?: ReactNode;
  labelRight?: ReactNode;
}

function Field({
  id,
  label,
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
  rightSlot,
  labelRight,
}: FieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="text-[11px] tracking-[0.22em] font-bold text-muted-foreground">
          {label}
        </label>
        {labelRight}
      </div>
      <div className="group flex items-center gap-3 bg-surface-high rounded-md h-14 px-4 transition-colors focus-within:bg-surface-lowest focus-within:shadow-[inset_0_-2px_0_0_hsl(var(--primary))] ghost-border">
        <span className="text-muted-foreground">{icon}</span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground/70"
        />
        {rightSlot}
      </div>
    </div>
  );
}

export default Login;

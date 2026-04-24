import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, BookOpen, MessageSquare, UserCircle, Receipt, LogOut } from "lucide-react";
import { Brand } from "./Brand";
import { Button } from "./ui/button";
import { mockStudent } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

export function PortalSidebar() {
  const navigate = useNavigate();
  const { appUser, signOutUser } = useAuth();

  const displayName = appUser?.name || mockStudent.name;
  const displayId = appUser?.id || mockStudent.id;
  const avatar = appUser?.photoUrl || mockStudent.avatar;

  const onSignOut = async () => {
    await signOutUser();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col bg-surface-low p-6 gap-6">
      <Brand variant="stacked" />

      <div className="rounded-xl bg-surface-lowest p-3 flex items-center gap-3 shadow-card">
        <img src={avatar} alt={displayName} className="h-11 w-11 rounded-lg object-cover" />
        <div className="leading-tight">
          <p className="font-display font-bold text-primary text-sm">{displayName}</p>
          <p className="text-[11px] text-muted-foreground tracking-wide">ID: {displayId}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 h-12 rounded-lg font-semibold text-sm transition-all",
                isActive
                  ? "bg-secondary text-secondary-foreground shadow-card"
                  : "text-foreground hover:bg-surface-lowest"
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <Button variant="primary" size="lg" className="w-full">
          <Receipt className="h-4 w-4" /> Submit Fee
        </Button>
        <Button variant="ghost" size="sm" onClick={onSignOut} className="text-muted-foreground">
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </aside>
  );
}

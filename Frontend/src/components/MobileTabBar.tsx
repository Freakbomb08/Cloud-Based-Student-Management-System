import { NavLink } from "react-router-dom";
import { LayoutGrid, BookOpen, MessageSquare, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/dashboard", label: "DASHBOARD", icon: LayoutGrid },
  { to: "/courses", label: "COURSES", icon: BookOpen },
  { to: "/chat", label: "CHAT", icon: MessageSquare },
  { to: "/profile", label: "PROFILE", icon: UserCircle },
];

export function MobileTabBar() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-lowest shadow-[0_-4px_20px_hsl(210_12%_11%/0.06)] grid grid-cols-4 px-2 pt-2 pb-3">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 mx-1 rounded-xl py-2 transition-all",
              isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
            )
          }
        >
          <Icon className="h-5 w-5" />
          <span className="text-[10px] tracking-[0.15em] font-bold">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

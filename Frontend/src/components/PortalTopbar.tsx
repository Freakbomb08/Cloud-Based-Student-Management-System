import { Link, useLocation } from "react-router-dom";
import { Bell, Search, Settings } from "lucide-react";
import { Brand } from "@/components/Brand";
import { mockStudent } from "@/data/mock";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/courses", label: "Courses" },
  { to: "/chat", label: "Chat" },
  { to: "/profile", label: "Profile" },
];

export function PortalTopbar({ search = "Search academic records..." }: { search?: string }) {
  const { pathname } = useLocation();
  return (
    <header className="hidden lg:flex items-center justify-between gap-6 px-10 h-20 sticky top-0 z-30 bg-surface/80 backdrop-blur-md">
      <div className="lg:hidden"><Brand variant="compact" /></div>
      <nav className="flex items-center gap-8">
        {links.map((l) => {
          const active = pathname.startsWith(l.to);
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`relative text-sm font-semibold transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {l.label}
              {active && <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-secondary rounded-full" />}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-3 flex-1 max-w-md ml-auto">
        <div className="flex-1 flex items-center gap-2 bg-surface-lowest rounded-full h-11 px-4 ghost-border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input className="bg-transparent outline-none flex-1 text-sm" placeholder={search} />
        </div>
        <button className="relative grid place-items-center h-10 w-10 rounded-full hover:bg-surface-low">
          <Bell className="h-5 w-5 text-primary" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <button className="grid place-items-center h-10 w-10 rounded-full hover:bg-surface-low">
          <Settings className="h-5 w-5 text-primary" />
        </button>
        <img src={mockStudent.avatar} alt="Me" className="h-10 w-10 rounded-full object-cover" />
      </div>
    </header>
  );
}

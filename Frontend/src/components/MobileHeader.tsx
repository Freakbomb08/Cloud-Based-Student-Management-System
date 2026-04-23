import { Bell } from "lucide-react";
import { Brand } from "./Brand";
import { mockStudent } from "@/data/mock";

interface MobileHeaderProps {
  showBell?: boolean;
}

export function MobileHeader({ showBell = true }: MobileHeaderProps) {
  return (
    <header className="lg:hidden flex items-center justify-between px-5 pt-6 pb-4 bg-surface">
      <Brand variant="compact" />
      <div className="flex items-center gap-3">
        {showBell && (
          <button className="grid place-items-center h-10 w-10 rounded-full hover:bg-surface-low">
            <Bell className="h-5 w-5 text-primary" />
          </button>
        )}
        <img src={mockStudent.avatar} alt="Me" className="h-10 w-10 rounded-xl object-cover ring-2 ring-primary" />
      </div>
    </header>
  );
}

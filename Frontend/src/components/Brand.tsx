import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandProps {
  variant?: "full" | "compact" | "stacked";
  className?: string;
}

export function Brand({ variant = "full", className }: BrandProps) {
  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col leading-none", className)}>
        <span className="font-display font-extrabold text-2xl tracking-tight text-primary">IITM</span>
        <span className="font-body text-[10px] tracking-[0.22em] text-muted-foreground mt-1">JANAKPURI CAMPUS</span>
      </div>
    );
  }
  if (variant === "compact") {
    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        <span className="grid place-items-center h-7 w-7 rounded-md bg-gradient-primary text-primary-foreground">
          <GraduationCap className="h-4 w-4" />
        </span>
        <span className="font-display font-extrabold text-lg tracking-tight text-primary">IITM Janakpuri</span>
      </div>
    );
  }
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <span className="grid place-items-center h-10 w-10 rounded-md bg-gradient-primary text-primary-foreground shadow-card">
        <GraduationCap className="h-5 w-5" />
      </span>
      <div className="flex flex-col leading-none">
        <span className="font-display font-extrabold text-xl tracking-tight text-primary">IITM JANAKPURI</span>
        <span className="font-body text-[10px] tracking-[0.22em] text-muted-foreground mt-1">EDITORIAL INFORMATION SYSTEM</span>
      </div>
    </div>
  );
}

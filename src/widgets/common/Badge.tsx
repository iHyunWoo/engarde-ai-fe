import {ReactNode} from "react";
import {cn} from "@/shared/lib/utils";

type BadgeVariant = 'default' | 'secondary' | 'success' | 'destructive';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-slate-900 text-slate-50 hover:bg-slate-900/80',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-100/80',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    destructive: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant]
      )}
    >
      {children}
    </div>
  );
}
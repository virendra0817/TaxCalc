import { cn } from "@/lib/utils";

interface ResultCardProps {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

export function ResultCard({ label, value, sub, highlight, variant = "default", className }: ResultCardProps) {
  const variantStyles = {
    default: "bg-card border",
    success: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800",
    warning: "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
    danger: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
  };

  const valueStyles = {
    default: highlight ? "text-primary" : "text-foreground",
    success: "text-emerald-700 dark:text-emerald-400",
    warning: "text-amber-700 dark:text-amber-400",
    danger: "text-red-700 dark:text-red-400",
  };

  return (
    <div className={cn("rounded-xl p-4 space-y-1", variantStyles[variant], highlight && "ring-2 ring-primary/30", className)}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={cn("text-2xl font-bold font-space tracking-tight", valueStyles[variant])}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

interface ResultGridProps {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
}

export function ResultGrid({ children, cols = 3 }: ResultGridProps) {
  const colClass = { 2: "grid-cols-2", 3: "grid-cols-1 sm:grid-cols-3", 4: "grid-cols-2 lg:grid-cols-4" }[cols];
  return <div className={cn("grid gap-3", colClass)}>{children}</div>;
}

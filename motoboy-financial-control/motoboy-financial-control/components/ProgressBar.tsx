"use client";

interface ProgressBarProps {
  value: number;
  goal: number;
  label: string;
  colorClass?: string; // classe tailwind de background, ex: "bg-visor"
}

export function ProgressBar({ value, goal, label, colorClass = "bg-visor" }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, goal > 0 ? value / goal : 0));
  const hit = value >= goal;

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="truncate text-[11px] text-muted">{label}</span>
        <span className="shrink-0 font-mono tabular text-[11px] font-semibold">
          {Math.round(pct * 100)}%
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${
            hit ? "bg-paid" : colorClass
          }`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}

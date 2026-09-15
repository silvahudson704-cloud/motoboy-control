"use client";

interface CircularProgressProps {
  value: number; // valor atual
  goal: number; // meta
  label: string;
  size?: number;
  colorClass?: string; // classe tailwind de stroke, ex: "stroke-visor"
}

export function CircularProgress({
  value,
  goal,
  label,
  size = 76,
  colorClass = "stroke-visor",
}: CircularProgressProps) {
  const pct = Math.max(0, Math.min(1, goal > 0 ? value / goal : 0));
  const stroke = 7;
  const radius = size / 2 - stroke;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  const hit = value >= goal;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
            className="stroke-border"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
            className={`${hit ? "stroke-paid" : colorClass} transition-[stroke-dashoffset] duration-500 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-mono tabular font-semibold">
            {Math.round(pct * 100)}%
          </span>
        </div>
      </div>
      <span className="text-[11px] text-muted leading-none text-center">{label}</span>
    </div>
  );
}

"use client";

import { Check, X } from "lucide-react";
import { WeekSummary } from "@/lib/calculations";
import { formatCurrency, formatShortDate, todayKey } from "@/lib/dates";

interface WeeklyPerformanceProps {
  week: WeekSummary;
  metaDiaria: number;
  metaSemanal: number;
  dayLabels: string[];
}

export function WeeklyPerformance({ week, metaDiaria, metaSemanal, dayLabels }: WeeklyPerformanceProps) {
  const today = todayKey();

  return (
    <div className="rounded-2xl border border-border bg-surface p-3 shadow-card">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold">Semana (Ter–Dom)</p>
        <p
          className={`text-xs font-mono tabular ${
            week.metaSemanalBatida ? "text-paid" : "text-muted"
          }`}
        >
          {formatCurrency(week.liquidoTotal)} / {formatCurrency(metaSemanal)}
        </p>
      </div>

      <ul className="divide-y divide-border/60">
        {week.porDia.map((dia, i) => {
          const isToday = dia.dayKey === today;
          const isFuture = new Date(dia.dayKey) > new Date(today);
          const isFolga = !isFuture && !dia.worked;
          return (
            <li
              key={dia.dayKey}
              className={`flex items-center justify-between py-2 text-sm ${
                isToday ? "text-ink" : "text-muted"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={isToday ? "font-semibold text-visor" : ""}>
                  {dayLabels[i]}
                </span>
                <span className="text-[10px] text-muted">{formatShortDate(dia.dayKey)}</span>
              </span>
              <span className="flex items-center gap-2 font-mono tabular text-xs">
                {isFuture ? (
                  "—"
                ) : isFolga ? (
                  <span className="text-[11px] italic text-muted">folga</span>
                ) : (
                  <>
                    {formatCurrency(dia.liquido)}
                    {dia.metaBatida ? (
                      <Check size={14} className="text-paid" />
                    ) : (
                      <X size={14} className="text-cost/70" />
                    )}
                  </>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-2 text-[11px] text-muted">
        Meta diária: {formatCurrency(metaDiaria)} líquidos por dia trabalhado.
      </p>
    </div>
  );
}

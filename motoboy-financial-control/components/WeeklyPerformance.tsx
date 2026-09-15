"use client";

import { Check, X } from "lucide-react";
import { WeekSummary } from "@/lib/calculations";
import { WEEK_DAY_LABELS, META_DIARIA, META_SEMANAL } from "@/lib/constants";
import { formatCurrency, formatShortDate, todayKey } from "@/lib/dates";

export function WeeklyPerformance({ week }: { week: WeekSummary }) {
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
          {formatCurrency(week.liquidoTotal)} / {formatCurrency(META_SEMANAL)}
        </p>
      </div>

      <ul className="divide-y divide-border/60">
        {week.porDia.map((dia, i) => {
          const isToday = dia.dayKey === today;
          const isFuture = new Date(dia.dayKey) > new Date(today);
          return (
            <li
              key={dia.dayKey}
              className={`flex items-center justify-between py-2 text-sm ${
                isToday ? "text-ink" : "text-muted"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={isToday ? "font-semibold text-visor" : ""}>
                  {WEEK_DAY_LABELS[i]}
                </span>
                <span className="text-[10px] text-muted">{formatShortDate(dia.dayKey)}</span>
              </span>
              <span className="flex items-center gap-2 font-mono tabular text-xs">
                {isFuture ? "—" : formatCurrency(dia.liquido)}
                {!isFuture &&
                  (dia.metaBatida ? (
                    <Check size={14} className="text-paid" />
                  ) : (
                    <X size={14} className="text-cost/70" />
                  ))}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-2 text-[11px] text-muted">
        Meta diária: {formatCurrency(META_DIARIA)} líquidos por dia trabalhado.
      </p>
    </div>
  );
}

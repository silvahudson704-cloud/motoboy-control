"use client";

import { Clock, Check } from "lucide-react";
import { Ride } from "@/types";
import { formatCurrency, formatShortDate } from "@/lib/dates";

interface PendingRemindersProps {
  rides: Ride[]; // já filtradas: pendentes que não são de hoje
  onMarkPaid: (id: string) => void;
}

// Lembrete que continua aparecendo mesmo depois de fechar o dia — pra
// nenhuma corrida pendente de dias anteriores ficar esquecida.
export function PendingReminders({ rides, onMarkPaid }: PendingRemindersProps) {
  if (rides.length === 0) return null;

  const total = rides.reduce((sum, r) => sum + r.valor, 0);

  return (
    <div className="rounded-2xl border border-pending/40 bg-pending/10 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-bold text-pending">
          <Clock size={14} /> Pendentes de outros dias
        </p>
        <span className="font-mono tabular text-xs font-semibold text-pending">
          {formatCurrency(total)}
        </span>
      </div>
      <ul className="space-y-1.5">
        {rides.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between gap-2 rounded-xl bg-elevated px-2.5 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm">{r.local}</p>
              <p className="text-[10px] text-muted">{formatShortDate(r.dayKey)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="font-mono tabular text-sm">{formatCurrency(r.valor)}</span>
              <button
                onClick={() => onMarkPaid(r.id)}
                aria-label="Marcar como pago"
                className="grid h-7 w-7 place-items-center rounded-full bg-paid/15 text-paid active:scale-95 transition-transform"
              >
                <Check size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

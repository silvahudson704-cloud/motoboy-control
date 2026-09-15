"use client";

import { Wallet, Bike } from "lucide-react";
import { CircularProgress } from "./CircularProgress";
import { formatCurrency } from "@/lib/dates";
import { META_DIARIA, META_SEMANAL } from "@/lib/constants";

interface HeaderProps {
  liquidoHoje: number;
  liquidoSemana: number;
  reserva: number;
}

export function Header({ liquidoHoje, liquidoSemana, reserva }: HeaderProps) {
  return (
    <header className="safe-top sticky top-0 z-20 bg-base/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-visor text-visor-ink">
            <Bike size={18} strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <p className="text-[13px] font-semibold">Motoboy Financial</p>
            <p className="text-[11px] text-muted">Controle na régua</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-3 pt-1">
        <CircularProgress
          value={Math.max(0, liquidoHoje)}
          goal={META_DIARIA}
          label={`Hoje · ${formatCurrency(liquidoHoje)}`}
          colorClass="stroke-visor"
        />
        <CircularProgress
          value={Math.max(0, liquidoSemana)}
          goal={META_SEMANAL}
          label={`Semana · ${formatCurrency(liquidoSemana)}`}
          colorClass="stroke-pending"
        />
        <div className="flex min-w-[104px] flex-col items-center gap-1 rounded-2xl border border-border bg-surface px-3 py-2 shadow-card">
          <Wallet size={16} className="text-visor" />
          <span className="text-[10px] text-muted">Reserva</span>
          <span className="font-mono tabular text-sm font-semibold text-visor">
            {formatCurrency(reserva)}
          </span>
        </div>
      </div>
    </header>
  );
}

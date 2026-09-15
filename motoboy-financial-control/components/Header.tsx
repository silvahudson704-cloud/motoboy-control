"use client";

import { useState } from "react";
import { Bike, Pencil, Check } from "lucide-react";
import { CircularProgress } from "./CircularProgress";
import { formatCurrency } from "@/lib/dates";

interface HeaderProps {
  liquidoHoje: number;
  liquidoSemana: number;
  reserva: number;
  metaDiaria: number;
  metaSemanal: number;
  onChangeMetaDiaria: (valor: number) => void;
  onChangeMetaSemanal: (valor: number) => void;
  onChangeReserva: (valor: number) => void;
}

function parseInput(raw: string): number | null {
  const n = parseFloat(raw.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

// Card compacto que vira um mini-formulário ao tocar no lápis.
function EditableStat({
  label,
  value,
  onChange,
  accent = false,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  accent?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  function save() {
    const parsed = parseInput(draft);
    if (parsed !== null) onChange(parsed);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex min-w-[104px] flex-col items-center gap-1 rounded-2xl border border-visor bg-elevated px-2 py-2 shadow-card">
        <span className="text-[10px] text-muted">{label}</span>
        <div className="flex items-center gap-1">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            inputMode="decimal"
            className="w-16 rounded-md border border-border bg-base px-1 py-0.5 text-center font-mono text-sm text-ink outline-none"
          />
          <button
            onClick={save}
            aria-label="Salvar"
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-visor text-visor-ink"
          >
            <Check size={13} strokeWidth={3} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        setDraft(String(value));
        setEditing(true);
      }}
      className="flex min-w-[104px] flex-col items-center gap-1 rounded-2xl border border-border bg-surface px-3 py-2 shadow-card active:scale-95 transition-transform"
    >
      <span className="text-[10px] text-muted">{label}</span>
      <span
        className={`flex items-center gap-1 font-mono tabular text-sm font-semibold ${
          accent ? "text-visor" : "text-ink"
        }`}
      >
        {formatCurrency(value)}
        <Pencil size={11} className="text-muted" />
      </span>
    </button>
  );
}

export function Header({
  liquidoHoje,
  liquidoSemana,
  reserva,
  metaDiaria,
  metaSemanal,
  onChangeMetaDiaria,
  onChangeMetaSemanal,
  onChangeReserva,
}: HeaderProps) {
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

      <div className="flex items-center gap-3 px-4 pb-2 pt-1">
        <div className="flex flex-col items-center gap-1">
          <CircularProgress
            value={Math.max(0, liquidoHoje)}
            goal={metaDiaria}
            label={`Hoje · ${formatCurrency(liquidoHoje)}`}
            colorClass="stroke-visor"
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <CircularProgress
            value={Math.max(0, liquidoSemana)}
            goal={metaSemanal}
            label={`Semana · ${formatCurrency(liquidoSemana)}`}
            colorClass="stroke-pending"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
        <EditableStat label="Meta hoje" value={metaDiaria} onChange={onChangeMetaDiaria} />
        <EditableStat label="Meta semana" value={metaSemanal} onChange={onChangeMetaSemanal} />
        <EditableStat
          label="Reserva"
          value={reserva}
          onChange={onChangeReserva}
          accent
        />
      </div>
    </header>
  );
}

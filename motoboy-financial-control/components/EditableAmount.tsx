"use client";

import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import { formatCurrency } from "@/lib/dates";

interface EditableAmountProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  accent?: boolean;
  tone?: "default" | "pending" | "cost";
  className?: string;
}

function parseInput(raw: string): number | null {
  const n = parseFloat(raw.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

const toneText: Record<NonNullable<EditableAmountProps["tone"]>, string> = {
  default: "text-ink",
  pending: "text-pending",
  cost: "text-cost",
};

// Card compacto que vira um mini-formulário ao tocar no lápis.
// Usado para qualquer valor editável em tela: metas, reserva, gasolina...
export function EditableAmount({
  label,
  value,
  onChange,
  accent = false,
  tone = "default",
  className = "",
}: EditableAmountProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  function save() {
    const parsed = parseInput(draft);
    if (parsed !== null) onChange(parsed);
    setEditing(false);
  }

  if (editing) {
    return (
      <div
        className={`flex min-w-[104px] flex-col items-center gap-1 rounded-2xl border border-visor bg-elevated px-2 py-2 shadow-card ${className}`}
      >
        <span className="text-[10px] text-muted">{label}</span>
        <div className="flex items-center gap-1">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            onBlur={save}
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
      className={`flex min-w-[104px] flex-col items-center gap-1 rounded-2xl border border-border bg-surface px-3 py-2 shadow-card active:scale-95 transition-transform ${className}`}
    >
      <span className="text-[10px] text-muted">{label}</span>
      <span
        className={`flex items-center gap-1 font-mono tabular text-sm font-semibold ${
          accent ? "text-visor" : toneText[tone]
        }`}
      >
        {formatCurrency(value)}
        <Pencil size={11} className="text-muted" />
      </span>
    </button>
  );
}

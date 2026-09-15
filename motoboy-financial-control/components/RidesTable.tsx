"use client";

import { useState } from "react";
import { Check, Clock, Trash2, Pencil } from "lucide-react";
import { Ride } from "@/types";
import { formatCurrency } from "@/lib/dates";

interface RidesTableProps {
  rides: Ride[];
  onToggleStatus: (id: string) => void;
  onEdit: (id: string, updates: { local?: string; valor?: number }) => void;
  onDelete: (id: string) => void;
}

export function RidesTable({ rides, onToggleStatus, onEdit, onDelete }: RidesTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftLocal, setDraftLocal] = useState("");
  const [draftValor, setDraftValor] = useState("");

  function startEdit(ride: Ride) {
    setEditingId(ride.id);
    setDraftLocal(ride.local);
    setDraftValor(String(ride.valor));
  }

  function saveEdit(id: string) {
    const valor = parseFloat(draftValor.replace(",", "."));
    onEdit(id, {
      local: draftLocal.trim() || undefined,
      valor: Number.isFinite(valor) ? valor : undefined,
    });
    setEditingId(null);
  }

  if (rides.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">
        Nenhuma corrida ainda hoje. Manda a primeira pelo terminal aqui embaixo.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="grid grid-cols-[28px_1fr_74px_40px_36px] items-center gap-2 border-b border-border px-3 py-2 text-[11px] uppercase tracking-wide text-muted">
        <span>#</span>
        <span>Local</span>
        <span className="text-right">Valor</span>
        <span className="text-center">Status</span>
        <span></span>
      </div>
      <ul>
        {[...rides].reverse().map((ride, i) => (
          <li
            key={ride.id}
            className="grid grid-cols-[28px_1fr_74px_40px_36px] items-center gap-2 border-b border-border/60 px-3 py-2.5 last:border-b-0"
          >
            <span className="text-xs text-muted font-mono">{rides.length - i}</span>

            {editingId === ride.id ? (
              <input
                value={draftLocal}
                onChange={(e) => setDraftLocal(e.target.value)}
                className="min-w-0 rounded-md border border-border bg-elevated px-2 py-1 text-sm outline-none focus:border-visor"
              />
            ) : (
              <span className="truncate text-sm">{ride.local}</span>
            )}

            {editingId === ride.id ? (
              <input
                value={draftValor}
                onChange={(e) => setDraftValor(e.target.value)}
                inputMode="decimal"
                className="w-full rounded-md border border-border bg-elevated px-2 py-1 text-right text-sm font-mono outline-none focus:border-visor"
              />
            ) : (
              <span className="text-right text-sm font-mono tabular">
                {formatCurrency(ride.valor)}
              </span>
            )}

            <button
              onClick={() => onToggleStatus(ride.id)}
              aria-label="Alternar status"
              className={`mx-auto grid h-7 w-7 place-items-center rounded-full ${
                ride.status === "paid"
                  ? "bg-paid/15 text-paid"
                  : "bg-pending/15 text-pending"
              }`}
            >
              {ride.status === "paid" ? <Check size={15} /> : <Clock size={15} />}
            </button>

            <div className="flex items-center justify-end gap-2">
              {editingId === ride.id ? (
                <>
                  <button
                    onClick={() => onDelete(ride.id)}
                    aria-label="Excluir"
                    className="text-cost active:opacity-70"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => saveEdit(ride.id)}
                    className="text-[11px] font-semibold text-visor"
                  >
                    OK
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEdit(ride)}
                  aria-label="Editar"
                  className="text-muted active:text-ink"
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

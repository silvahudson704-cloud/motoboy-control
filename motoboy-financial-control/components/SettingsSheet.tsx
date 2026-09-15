"use client";

import { X, Sun, Moon } from "lucide-react";
import { FULL_DAY_LABELS } from "@/lib/constants";
import { Theme } from "@/lib/useTheme";

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
  theme: Theme;
  onChangeTheme: (t: Theme) => void;
  weekStartDay: number;
  workDaysCount: number;
  onChangeWeekStartDay: (day: number) => void;
  onChangeWorkDaysCount: (count: number) => void;
}

export function SettingsSheet({
  open,
  onClose,
  theme,
  onChangeTheme,
  weekStartDay,
  workDaysCount,
  onChangeWeekStartDay,
  onChangeWorkDaysCount,
}: SettingsSheetProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="safe-bottom w-full max-w-md rounded-t-3xl border-t border-border bg-surface p-4 pb-6 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-semibold">Configurações</p>
          <button onClick={onClose} aria-label="Fechar" className="text-muted active:text-ink">
            <X size={18} />
          </button>
        </div>

        <div className="mb-5">
          <p className="mb-2 text-xs text-muted">Tema do app</p>
          <div className="flex gap-2">
            <button
              onClick={() => onChangeTheme("dark")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold ${
                theme === "dark" ? "border-visor bg-visor text-visor-ink" : "border-border text-muted"
              }`}
            >
              <Moon size={14} /> Noturno
            </button>
            <button
              onClick={() => onChangeTheme("light")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold ${
                theme === "light" ? "border-visor bg-visor text-visor-ink" : "border-border text-muted"
              }`}
            >
              <Sun size={14} /> Diurno
            </button>
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-2 text-xs text-muted">Sua semana de trabalho começa em</p>
          <select
            value={weekStartDay}
            onChange={(e) => onChangeWeekStartDay(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-elevated px-3 py-2.5 text-sm text-ink outline-none focus:border-visor"
          >
            {FULL_DAY_LABELS.map((label, i) => (
              <option key={label} value={i}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 text-xs text-muted">Quantos dias por semana você trabalha</p>
          <div className="grid grid-cols-7 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button
                key={n}
                onClick={() => onChangeWorkDaysCount(n)}
                className={`rounded-xl border py-2.5 text-xs font-semibold ${
                  workDaysCount === n
                    ? "border-visor bg-visor text-visor-ink"
                    : "border-border text-muted"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted">
            Ex: folga só domingo → começa Segunda, 6 dias. Trabalha todo dia → 7 dias.
          </p>
        </div>
      </div>
    </div>
  );
}

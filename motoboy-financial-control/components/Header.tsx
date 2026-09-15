"use client";

import { Bike, Settings } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { EditableAmount } from "./EditableAmount";

interface HeaderProps {
  liquidoHoje: number;
  liquidoSemana: number;
  reserva: number;
  metaDiaria: number;
  metaSemanal: number;
  onChangeMetaDiaria: (valor: number) => void;
  onChangeMetaSemanal: (valor: number) => void;
  onChangeReserva: (valor: number) => void;
  onOpenSettings: () => void;
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
  onOpenSettings,
}: HeaderProps) {
  return (
    <header className="safe-top sticky top-0 z-20 bg-base/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-visor text-visor-ink">
            <Bike size={18} strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <p className="text-[13px] font-semibold">Motoboy Financial</p>
            <p className="text-[11px] text-muted">Controle na régua</p>
          </div>
        </div>
        <button
          onClick={onOpenSettings}
          aria-label="Configurações"
          className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted active:text-ink"
        >
          <Settings size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-3">
        <ProgressBar
          value={Math.max(0, liquidoHoje)}
          goal={metaDiaria}
          label="Meta hoje"
          colorClass="bg-visor"
        />
        <ProgressBar
          value={Math.max(0, liquidoSemana)}
          goal={metaSemanal}
          label="Meta semana"
          colorClass="bg-pending"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
        <EditableAmount label="Meta hoje" value={metaDiaria} onChange={onChangeMetaDiaria} />
        <EditableAmount label="Meta semana" value={metaSemanal} onChange={onChangeMetaSemanal} />
        <EditableAmount label="Reserva" value={reserva} onChange={onChangeReserva} accent />
      </div>
    </header>
  );
}

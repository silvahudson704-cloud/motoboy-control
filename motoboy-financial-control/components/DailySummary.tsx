"use client";

import { DaySummary } from "@/lib/calculations";
import { formatCurrency } from "@/lib/dates";

interface MetricCardProps {
  label: string;
  value: number;
  tone?: "default" | "paid" | "pending" | "cost" | "accent";
  hint?: string;
}

const toneClasses: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  default: "text-ink",
  paid: "text-paid",
  pending: "text-pending",
  cost: "text-cost",
  accent: "text-visor",
};

function MetricCard({ label, value, tone = "default", hint }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-3 py-3 shadow-card">
      <p className="text-[11px] text-muted">{label}</p>
      <p className={`mt-1 font-mono tabular text-lg font-semibold ${toneClasses[tone]}`}>
        {formatCurrency(value)}
      </p>
      {hint && <p className="mt-0.5 text-[10px] text-muted">{hint}</p>}
    </div>
  );
}

export function DailySummary({ summary }: { summary: DaySummary }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <MetricCard label="Bruto" value={summary.bruto} />
      <MetricCard
        label="Custos"
        value={summary.custos}
        tone="cost"
        hint={`${summary.totalCorridas} corridas + gasolina`}
      />
      <MetricCard
        label="Líquido"
        value={summary.liquido}
        tone={summary.metaBatida ? "paid" : "accent"}
      />
      <MetricCard label="Recebido" value={summary.recebido} tone="paid" />
      <MetricCard label="Pendente" value={summary.pendente} tone="pending" />
      <MetricCard label="Guardado hoje" value={summary.guardadoHoje} tone="accent" hint="10% das pagas" />
    </div>
  );
}

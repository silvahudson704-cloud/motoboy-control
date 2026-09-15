"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Fuel, Lock } from "lucide-react";
import { Header } from "@/components/Header";
import { QuickEntryTerminal } from "@/components/QuickEntryTerminal";
import { RidesTable } from "@/components/RidesTable";
import { DailySummary } from "@/components/DailySummary";
import { WeeklyPerformance } from "@/components/WeeklyPerformance";
import { Confetti } from "@/components/Confetti";
import { useAppState } from "@/lib/useAppState";
import { ridesForDay, summarizeDay, summarizeWeek, reservaAcumulada } from "@/lib/calculations";
import { getWeekDayKeys, todayKey, formatCurrency } from "@/lib/dates";
import { faltaParaMetaDiaria } from "@/lib/calculations";

type Tab = "hoje" | "semana";

export default function Home() {
  const {
    state,
    feedback,
    celebrate,
    dismissCelebration,
    submitMessage,
    toggleRideStatus,
    editRide,
    deleteRide,
    closeDay,
  } = useAppState();

  const [tab, setTab] = useState<Tab>("hoje");
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (!feedback) return;
    setShowFeedback(true);
    const t = setTimeout(() => setShowFeedback(false), 3200);
    return () => clearTimeout(t);
  }, [feedback]);

  const day = todayKey();
  const weekKeys = getWeekDayKeys();
  const daySummary = summarizeDay(state.rides, day, state.dailyRecords[day]);
  const weekSummary = summarizeWeek(state.rides, state.dailyRecords, weekKeys);
  const reserva = reservaAcumulada(state.reservaGuardada);
  const dayRides = ridesForDay(state.rides, day);
  const dayClosed = state.dailyRecords[day]?.closed ?? false;

  function handleSubmit(text: string) {
    const parsed = submitMessage(text);
    if (parsed.type === "system" && parsed.command === "semana") {
      setTab("semana");
    }
    if (parsed.type === "system" && parsed.command === "fechar_dia") {
      closeDay();
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-base">
      <Header
        liquidoHoje={daySummary.liquido}
        liquidoSemana={weekSummary.liquidoTotal}
        reserva={reserva}
      />

      <main className="flex-1 space-y-4 overflow-y-auto px-4 pb-4 pt-4">
        <div className="flex gap-2 rounded-full border border-border bg-surface p-1">
          {(["hoje", "semana"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-full py-1.5 text-xs font-semibold capitalize transition-colors ${
                tab === t ? "bg-visor text-visor-ink" : "text-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "hoje" ? (
          <>
            {dayClosed && (
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-elevated px-3 py-2 text-xs text-muted">
                <Lock size={14} /> Dia fechado — os lançamentos continuam sendo somados normalmente.
              </div>
            )}

            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Resumo do dia</h2>
                {!daySummary.metaBatida && (
                  <span className="text-[11px] text-muted">
                    Faltam {formatCurrency(faltaParaMetaDiaria(daySummary.liquido))} p/ meta
                  </span>
                )}
              </div>
              <DailySummary summary={daySummary} />
            </section>

            {daySummary.gasolina > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs text-muted">
                <Fuel size={14} className="text-pending" />
                Gasolina hoje: <span className="font-mono text-ink">{formatCurrency(daySummary.gasolina)}</span>
              </div>
            )}

            <section>
              <h2 className="mb-2 text-sm font-semibold">Corridas ativas</h2>
              <RidesTable
                rides={dayRides}
                onToggleStatus={toggleRideStatus}
                onEdit={(id, updates) => editRide(id, updates)}
                onDelete={deleteRide}
              />
            </section>
          </>
        ) : (
          <WeeklyPerformance week={weekSummary} />
        )}
      </main>

      {showFeedback && feedback && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[132px] z-30 flex justify-center px-4">
          <div
            className={`pointer-events-auto flex items-center gap-2 rounded-full border px-3 py-2 text-xs shadow-card ${
              feedback.ok
                ? "border-paid/40 bg-elevated text-ink"
                : "border-cost/40 bg-elevated text-ink"
            }`}
          >
            {feedback.ok ? (
              <CheckCircle2 size={14} className="text-paid shrink-0" />
            ) : (
              <XCircle size={14} className="text-cost shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        </div>
      )}

      <QuickEntryTerminal onSubmit={handleSubmit} />

      <Confetti active={celebrate} onDone={dismissCelebration} />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Lock, LockOpen } from "lucide-react";
import { Header } from "@/components/Header";
import { QuickEntryTerminal } from "@/components/QuickEntryTerminal";
import { RidesTable } from "@/components/RidesTable";
import { DailySummary } from "@/components/DailySummary";
import { WeeklyPerformance } from "@/components/WeeklyPerformance";
import { EditableAmount } from "@/components/EditableAmount";
import { PendingReminders } from "@/components/PendingReminders";
import { SettingsSheet } from "@/components/SettingsSheet";
import { Confetti } from "@/components/Confetti";
import { useAppState } from "@/lib/useAppState";
import { useTheme } from "@/lib/useTheme";
import {
  ridesForDay,
  summarizeDay,
  summarizeWeek,
  reservaAcumulada,
  faltaParaMeta,
} from "@/lib/calculations";
import { getWeekDayKeys, weekDayLabels, todayKey, formatCurrency } from "@/lib/dates";

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
    toggleDayClosed,
    setGasolinaTotal,
    setMetaDiaria,
    setMetaSemanal,
    setReservaTotal,
    setWeekStartDay,
    setWorkDaysCount,
  } = useAppState();

  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState<Tab>("hoje");
  const [showFeedback, setShowFeedback] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!feedback) return;
    setShowFeedback(true);
    const t = setTimeout(() => setShowFeedback(false), 3200);
    return () => clearTimeout(t);
  }, [feedback]);

  const day = todayKey();
  const weekKeys = getWeekDayKeys(new Date(), state.weekStartDay, state.workDaysCount);
  const dayLabels = weekDayLabels(state.weekStartDay, state.workDaysCount);
  const daySummary = summarizeDay(state.rides, day, state.dailyRecords[day], state.metaDiaria);
  const weekSummary = summarizeWeek(
    state.rides,
    state.dailyRecords,
    weekKeys,
    state.metaDiaria,
    state.metaSemanal
  );
  const reserva = reservaAcumulada(state.reservaBase, state.reservaGuardada);
  const dayRides = ridesForDay(state.rides, day);
  const dayClosed = state.dailyRecords[day]?.closed ?? false;
  const pendingFromOtherDays = state.rides.filter(
    (r) => r.status === "pending" && r.dayKey !== day
  );

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
        metaDiaria={state.metaDiaria}
        metaSemanal={state.metaSemanal}
        onChangeMetaDiaria={setMetaDiaria}
        onChangeMetaSemanal={setMetaSemanal}
        onChangeReserva={setReservaTotal}
        onOpenSettings={() => setSettingsOpen(true)}
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

            <PendingReminders rides={pendingFromOtherDays} onMarkPaid={toggleRideStatus} />

            {/* Corridas do Dia — seção principal, logo abaixo das metas */}
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Corridas do dia</h2>
                {!daySummary.metaBatida && (
                  <span className="text-[11px] text-muted">
                    Faltam {formatCurrency(faltaParaMeta(daySummary.liquido, state.metaDiaria))} p/ meta
                  </span>
                )}
              </div>
              <RidesTable
                rides={dayRides}
                onToggleStatus={toggleRideStatus}
                onEdit={(id, updates) => editRide(id, updates)}
                onDelete={deleteRide}
              />
            </section>

            <div className="flex items-center gap-2.5">
              <EditableAmount
                label="Gasolina hoje"
                value={daySummary.gasolina}
                onChange={setGasolinaTotal}
                tone="pending"
                className="flex-1 !min-w-0"
              />
              <button
                onClick={toggleDayClosed}
                className={`flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-2xl border px-3 py-2 shadow-card active:scale-95 transition-transform ${
                  dayClosed
                    ? "border-paid/40 bg-paid/10 text-paid"
                    : "border-visor bg-visor text-visor-ink"
                }`}
              >
                <span className="flex items-center gap-1.5 text-xs font-bold">
                  {dayClosed ? <LockOpen size={14} /> : <Lock size={14} />}
                  {dayClosed ? "Dia fechado" : "Fechar dia"}
                </span>
                {dayClosed && <span className="text-[10px] opacity-80">toque p/ reabrir</span>}
              </button>
            </div>

            {/* Resumo Financeiro — fica no fundo, abaixo das corridas */}
            <section>
              <h2 className="mb-2 text-sm font-semibold">Resumo financeiro</h2>
              <DailySummary summary={daySummary} />
            </section>
          </>
        ) : (
          <WeeklyPerformance
            week={weekSummary}
            metaDiaria={state.metaDiaria}
            metaSemanal={state.metaSemanal}
            dayLabels={dayLabels}
          />
        )}
      </main>

      {showFeedback && feedback && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[140px] z-30 flex justify-center px-4">
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

      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onChangeTheme={setTheme}
        weekStartDay={state.weekStartDay}
        workDaysCount={state.workDaysCount}
        onChangeWeekStartDay={setWeekStartDay}
        onChangeWorkDaysCount={setWorkDaysCount}
      />

      <Confetti active={celebrate} onDone={dismissCelebration} />
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Ride, RideStatus } from "@/types";
import { parseMessage } from "./parser";
import { loadState, saveState } from "./storage";
import { todayKey } from "./dates";
import { summarizeDay } from "./calculations";
import { PERCENTUAL_RESERVA } from "./constants";

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface FeedbackMessage {
  id: string;
  text: string;
  ok: boolean;
}

export function useAppState() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const hydrated = useRef(false);
  const wasMetaBatidaRef = useRef(false);

  // Hidrata a partir do localStorage apenas no cliente
  useEffect(() => {
    setState(loadState());
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    saveState(state);
  }, [state]);

  // Detecta quando a meta líquida diária é batida para disparar celebração
  useEffect(() => {
    const day = todayKey();
    const summary = summarizeDay(state.rides, day, state.dailyRecords[day], state.metaDiaria);
    if (summary.metaBatida && !wasMetaBatidaRef.current) {
      setCelebrate(true);
    }
    wasMetaBatidaRef.current = summary.metaBatida;
  }, [state.rides, state.dailyRecords, state.metaDiaria]);

  const pushFeedback = useCallback((text: string, ok: boolean) => {
    setFeedback({ id: uid(), text, ok });
  }, []);

  const addRides = useCallback(
    (rides: { local: string; valor: number; status: RideStatus }[]) => {
      const day = todayKey();
      const now = new Date().toISOString();
      setState((prev) => {
        const newRides: Ride[] = rides.map((r) => ({
          id: uid(),
          local: r.local,
          valor: r.valor,
          status: r.status,
          createdAt: now,
          dayKey: day,
          paidAt: r.status === "paid" ? now : undefined,
        }));
        const guardadoExtra = newRides
          .filter((r) => r.status === "paid")
          .reduce((sum, r) => sum + r.valor * PERCENTUAL_RESERVA, 0);
        return {
          ...prev,
          rides: [...prev.rides, ...newRides],
          reservaGuardada: prev.reservaGuardada + guardadoExtra,
        };
      });
    },
    []
  );

  const markPaid = useCallback((local?: string) => {
    setState((prev) => {
      const candidates = prev.rides
        .filter((r) => r.status === "pending")
        .filter((r) => !local || r.local.toLowerCase() === local.toLowerCase());
      if (candidates.length === 0) return prev;
      const target = candidates.reduce((latest, r) =>
        r.createdAt > latest.createdAt ? r : latest
      );
      const now = new Date().toISOString();
      const rides = prev.rides.map((r) =>
        r.id === target.id ? { ...r, status: "paid" as RideStatus, paidAt: now } : r
      );
      return {
        ...prev,
        rides,
        reservaGuardada: prev.reservaGuardada + target.valor * PERCENTUAL_RESERVA,
      };
    });
  }, []);

  const setGasolina = useCallback((valor: number) => {
    const day = todayKey();
    setState((prev) => {
      const existing = prev.dailyRecords[day];
      return {
        ...prev,
        dailyRecords: {
          ...prev.dailyRecords,
          [day]: {
            dayKey: day,
            gasolina: (existing?.gasolina ?? 0) + valor,
            closed: existing?.closed ?? false,
          },
        },
      };
    });
  }, []);

  const closeDay = useCallback(() => {
    const day = todayKey();
    setState((prev) => ({
      ...prev,
      dailyRecords: {
        ...prev.dailyRecords,
        [day]: {
          dayKey: day,
          gasolina: prev.dailyRecords[day]?.gasolina ?? 0,
          closed: true,
          closedAt: new Date().toISOString(),
        },
      },
    }));
  }, []);

  const toggleRideStatus = useCallback((rideId: string) => {
    setState((prev) => {
      const ride = prev.rides.find((r) => r.id === rideId);
      if (!ride) return prev;
      const goingToPaid = ride.status === "pending";
      const now = new Date().toISOString();
      const rides = prev.rides.map((r) =>
        r.id === rideId
          ? {
              ...r,
              status: (goingToPaid ? "paid" : "pending") as RideStatus,
              paidAt: goingToPaid ? now : undefined,
            }
          : r
      );
      const delta = ride.valor * PERCENTUAL_RESERVA * (goingToPaid ? 1 : -1);
      return { ...prev, rides, reservaGuardada: prev.reservaGuardada + delta };
    });
  }, []);

  const editRide = useCallback(
    (rideId: string, updates: Partial<Pick<Ride, "local" | "valor">>) => {
      setState((prev) => ({
        ...prev,
        rides: prev.rides.map((r) => (r.id === rideId ? { ...r, ...updates } : r)),
      }));
    },
    []
  );

  const deleteRide = useCallback((rideId: string) => {
    setState((prev) => {
      const ride = prev.rides.find((r) => r.id === rideId);
      if (!ride) return prev;
      const reduc = ride.status === "paid" ? ride.valor * PERCENTUAL_RESERVA : 0;
      return {
        ...prev,
        rides: prev.rides.filter((r) => r.id !== rideId),
        reservaGuardada: prev.reservaGuardada - reduc,
      };
    });
  }, []);

  const submitMessage = useCallback(
    (raw: string) => {
      const parsed = parseMessage(raw);
      const historyId = uid();
      const timestamp = new Date().toISOString();

      let interpretation = "";
      let ok = true;

      switch (parsed.type) {
        case "add_ride": {
          addRides(parsed.rides);
          const total = parsed.rides.reduce((s, r) => s + r.valor, 0);
          interpretation = `${parsed.rides.length} corrida(s) registrada(s) em ${
            parsed.rides[0].local
          } · total ${total.toFixed(2)}`;
          break;
        }
        case "mark_paid": {
          markPaid(parsed.local);
          interpretation = parsed.local
            ? `Corrida pendente de "${parsed.local}" marcada como paga`
            : "Corrida pendente mais recente marcada como paga";
          break;
        }
        case "gasolina": {
          setGasolina(parsed.valor);
          interpretation = `Gasolina de R$ ${parsed.valor.toFixed(2)} registrada`;
          break;
        }
        case "system": {
          interpretation = `Comando: ${parsed.command}`;
          break;
        }
        case "unknown": {
          ok = false;
          interpretation = "Não entendi essa mensagem. Tenta reformular.";
          break;
        }
      }

      pushFeedback(interpretation, ok);
      setState((prev) => ({
        ...prev,
        history: [
          ...prev.history.slice(-49),
          { id: historyId, timestamp, raw, interpretation, ok },
        ],
      }));

      return parsed;
    },
    [addRides, markPaid, setGasolina, pushFeedback]
  );

  const dismissCelebration = useCallback(() => setCelebrate(false), []);

  // Edição direta das metas — totalmente editáveis em tela
  const setMetaDiaria = useCallback((valor: number) => {
    setState((prev) => ({ ...prev, metaDiaria: valor }));
  }, []);

  const setMetaSemanal = useCallback((valor: number) => {
    setState((prev) => ({ ...prev, metaSemanal: valor }));
  }, []);

  // Edição direta do total da reserva. Como a reserva exibida é
  // base + guardado acumulado, editar o total ajusta a base para que
  // o novo valor "pegue" imediatamente, sem mexer no histórico de 10%.
  const setReservaTotal = useCallback((novoTotal: number) => {
    setState((prev) => ({ ...prev, reservaBase: novoTotal - prev.reservaGuardada }));
  }, []);

  return {
    state,
    feedback,
    celebrate,
    dismissCelebration,
    submitMessage,
    toggleRideStatus,
    editRide,
    deleteRide,
    closeDay,
    setMetaDiaria,
    setMetaSemanal,
    setReservaTotal,
  };
}

import { AppState } from "@/types";
import {
  STORAGE_KEY,
  DEFAULT_RESERVA_BASE,
  DEFAULT_META_DIARIA,
  DEFAULT_META_SEMANAL,
  DEFAULT_WEEK_START_DAY,
  DEFAULT_WORK_DAYS_COUNT,
} from "./constants";

export const emptyState: AppState = {
  rides: [],
  dailyRecords: {},
  reservaBase: DEFAULT_RESERVA_BASE,
  reservaGuardada: 0,
  metaDiaria: DEFAULT_META_DIARIA,
  metaSemanal: DEFAULT_META_SEMANAL,
  weekStartDay: DEFAULT_WEEK_START_DAY,
  workDaysCount: DEFAULT_WORK_DAYS_COUNT,
  history: [],
};

export function loadState(): AppState {
  if (typeof window === "undefined") return emptyState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as AppState;
    return {
      rides: parsed.rides ?? [],
      dailyRecords: parsed.dailyRecords ?? {},
      reservaBase: parsed.reservaBase ?? DEFAULT_RESERVA_BASE,
      reservaGuardada: parsed.reservaGuardada ?? 0,
      metaDiaria: parsed.metaDiaria ?? DEFAULT_META_DIARIA,
      metaSemanal: parsed.metaSemanal ?? DEFAULT_META_SEMANAL,
      weekStartDay: parsed.weekStartDay ?? DEFAULT_WEEK_START_DAY,
      workDaysCount: parsed.workDaysCount ?? DEFAULT_WORK_DAYS_COUNT,
      history: parsed.history ?? [],
    };
  } catch (err) {
    console.error("Falha ao ler estado salvo:", err);
    return emptyState;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Falha ao salvar estado:", err);
  }
}

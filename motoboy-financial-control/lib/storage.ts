import { AppState } from "@/types";
import { STORAGE_KEY } from "./constants";

export const emptyState: AppState = {
  rides: [],
  dailyRecords: {},
  reservaGuardada: 0,
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
      reservaGuardada: parsed.reservaGuardada ?? 0,
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

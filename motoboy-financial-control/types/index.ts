export type RideStatus = "paid" | "pending";

export interface Ride {
  id: string;
  local: string;
  valor: number;
  status: RideStatus;
  createdAt: string; // ISO timestamp
  dayKey: string; // YYYY-MM-DD (data local do registro)
  paidAt?: string; // ISO timestamp de quando virou "paga"
}

export interface DailyRecord {
  dayKey: string;
  gasolina: number;
  closed: boolean;
  closedAt?: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  raw: string;
  interpretation: string;
  ok: boolean;
}

export interface AppState {
  rides: Ride[];
  dailyRecords: Record<string, DailyRecord>;
  reservaBase: number; // valor base editável da reserva (padrão R$ 216,24)
  reservaGuardada: number; // soma acumulada de todos os 10% guardados (nunca reseta)
  metaDiaria: number; // editável em tela, padrão R$ 200
  metaSemanal: number; // editável em tela, padrão R$ 1.200
  history: HistoryEntry[];
}

export type SystemCommand = "completo" | "semana" | "quanto_falta" | "fechar_dia";

export type ParsedCommand =
  | { type: "add_ride"; rides: { local: string; valor: number; status: RideStatus }[] }
  | { type: "mark_paid"; local?: string }
  | { type: "gasolina"; valor: number }
  | { type: "system"; command: SystemCommand }
  | { type: "unknown"; raw: string };

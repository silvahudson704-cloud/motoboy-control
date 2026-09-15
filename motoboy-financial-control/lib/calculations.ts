import { Ride, DailyRecord } from "@/types";
import {
  RESERVA_INICIAL,
  CUSTO_POR_CORRIDA,
  TAXA_DIARIA_FIXA,
  PERCENTUAL_RESERVA,
  META_DIARIA,
  META_SEMANAL,
} from "./constants";

export interface DaySummary {
  bruto: number;
  custos: number;
  liquido: number;
  recebido: number;
  pendente: number;
  guardadoHoje: number;
  totalCorridas: number;
  gasolina: number;
  metaBatida: boolean;
}

export function ridesForDay(rides: Ride[], dayKey: string): Ride[] {
  return rides.filter((r) => r.dayKey === dayKey);
}

export function summarizeDay(
  rides: Ride[],
  dayKey: string,
  dailyRecord: DailyRecord | undefined
): DaySummary {
  const dayRides = ridesForDay(rides, dayKey);
  const gasolina = dailyRecord?.gasolina ?? 0;

  const bruto = dayRides.reduce((sum, r) => sum + r.valor, 0);
  const custos = dayRides.length * CUSTO_POR_CORRIDA + TAXA_DIARIA_FIXA + gasolina;
  const liquido = bruto - custos;
  const recebido = dayRides
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + r.valor, 0);
  const pendente = dayRides
    .filter((r) => r.status === "pending")
    .reduce((sum, r) => sum + r.valor, 0);
  const guardadoHoje = dayRides
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + r.valor * PERCENTUAL_RESERVA, 0);

  return {
    bruto,
    custos,
    liquido,
    recebido,
    pendente,
    guardadoHoje,
    totalCorridas: dayRides.length,
    gasolina,
    metaBatida: liquido >= META_DIARIA,
  };
}

export function reservaAcumulada(reservaGuardada: number): number {
  return RESERVA_INICIAL + reservaGuardada;
}

export interface WeekSummary {
  liquidoTotal: number;
  metaSemanalBatida: boolean;
  faltaParaMeta: number;
  porDia: { dayKey: string; liquido: number; metaBatida: boolean }[];
}

export function summarizeWeek(
  rides: Ride[],
  dailyRecords: Record<string, DailyRecord>,
  weekDayKeys: string[]
): WeekSummary {
  const porDia = weekDayKeys.map((dayKey) => {
    const s = summarizeDay(rides, dayKey, dailyRecords[dayKey]);
    return { dayKey, liquido: s.liquido, metaBatida: s.metaBatida };
  });
  const liquidoTotal = porDia.reduce((sum, d) => sum + d.liquido, 0);
  return {
    liquidoTotal,
    metaSemanalBatida: liquidoTotal >= META_SEMANAL,
    faltaParaMeta: Math.max(0, META_SEMANAL - liquidoTotal),
    porDia,
  };
}

export function faltaParaMetaDiaria(liquido: number): number {
  return Math.max(0, META_DIARIA - liquido);
}

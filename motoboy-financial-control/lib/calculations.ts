import { Ride, DailyRecord } from "@/types";
import { CUSTO_POR_CORRIDA, TAXA_DIARIA_FIXA, PERCENTUAL_RESERVA } from "./constants";

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
  dailyRecord: DailyRecord | undefined,
  metaDiaria: number
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
    metaBatida: liquido >= metaDiaria,
  };
}

export function reservaAcumulada(reservaBase: number, reservaGuardada: number): number {
  return reservaBase + reservaGuardada;
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
  weekDayKeys: string[],
  metaDiaria: number,
  metaSemanal: number
): WeekSummary {
  const porDia = weekDayKeys.map((dayKey) => {
    const s = summarizeDay(rides, dayKey, dailyRecords[dayKey], metaDiaria);
    return { dayKey, liquido: s.liquido, metaBatida: s.metaBatida };
  });
  const liquidoTotal = porDia.reduce((sum, d) => sum + d.liquido, 0);
  return {
    liquidoTotal,
    metaSemanalBatida: liquidoTotal >= metaSemanal,
    faltaParaMeta: Math.max(0, metaSemanal - liquidoTotal),
    porDia,
  };
}

export function faltaParaMeta(atual: number, meta: number): number {
  return Math.max(0, meta - atual);
}

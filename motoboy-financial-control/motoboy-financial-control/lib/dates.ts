import { FULL_DAY_LABELS } from "./constants";

// Todas as funções operam em horário local do dispositivo.

export function todayKey(date: Date = new Date()): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function keyToDate(dayKey: string): Date {
  const [y, m, d] = dayKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * A semana operacional é configurável (dia de início + quantidade de dias
 * trabalhados), já que cada motoboy folga em dias diferentes.
 * weekStartDay segue o padrão do JS: 0=Domingo...6=Sábado.
 */
export function getWeekStart(date: Date = new Date(), weekStartDay: number = 2): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = (day - weekStartDay + 7) % 7;
  const start = new Date(d);
  start.setDate(d.getDate() - diff);
  return start;
}

export function getWeekDayKeys(
  date: Date = new Date(),
  weekStartDay: number = 2,
  workDaysCount: number = 6
): string[] {
  const start = getWeekStart(date, weekStartDay);
  const keys: string[] = [];
  for (let i = 0; i < workDaysCount; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    keys.push(todayKey(d));
  }
  return keys;
}

export function weekDayLabels(weekStartDay: number, workDaysCount: number): string[] {
  return Array.from({ length: workDaysCount }, (_, i) => FULL_DAY_LABELS[(weekStartDay + i) % 7]);
}

export function isDayInCurrentWeek(
  dayKey: string,
  date: Date = new Date(),
  weekStartDay: number = 2,
  workDaysCount: number = 6
): boolean {
  return getWeekDayKeys(date, weekStartDay, workDaysCount).includes(dayKey);
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatShortDate(dayKey: string): string {
  const d = keyToDate(dayKey);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

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
 * A semana operacional do motoboy começa na Terça-feira e termina no Domingo.
 * Retorna a Terça-feira (início) correspondente à semana que contém `date`.
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Domingo ... 2 = Terça ... 6 = Sábado
  const diff = (day - 2 + 7) % 7; // dias desde a última terça
  const start = new Date(d);
  start.setDate(d.getDate() - diff);
  return start;
}

export function getWeekDayKeys(date: Date = new Date()): string[] {
  const start = getWeekStart(date);
  const keys: string[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    keys.push(todayKey(d));
  }
  return keys;
}

export function isDayInCurrentWeek(dayKey: string, date: Date = new Date()): boolean {
  return getWeekDayKeys(date).includes(dayKey);
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

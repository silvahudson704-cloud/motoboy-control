import { ParsedCommand, RideStatus } from "@/types";

const NUM_WORDS: Record<string, number> = {
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  "três": 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
};

function toNumber(raw: string): number {
  return parseFloat(raw.replace(",", "."));
}

function parseQty(raw: string): number | null {
  const lower = raw.trim().toLowerCase();
  if (/^\d+$/.test(lower)) return parseInt(lower, 10);
  return NUM_WORDS[lower] ?? null;
}

function normalizeStatus(raw: string): RideStatus {
  return /pend/i.test(raw) ? "pending" : "paid";
}

function titleCaseLocal(raw: string): string {
  return raw
    .trim()
    .split(/\s+/)
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}

const STATUS_WORD = "(pagas?|pagos?|pendentes?)";

// Template 1: "mais uma de 15 no Diniz paga" (valor unitário informado)
const RE_MAIS_DE = new RegExp(
  `^mais\\s+([a-zà-ú]+|\\d+)\\s+de\\s+r?\\$?\\s*(\\d+(?:[.,]\\d+)?)\\s*(?:no|na|em)?\\s*([a-zà-ú0-9\\s]*?)\\s*${STATUS_WORD}\\.?$`,
  "iu"
);

// Template 2: "mais duas no Diniz total 24 pagas" (valor total, divide pela quantidade)
const RE_MAIS_TOTAL = new RegExp(
  `^mais\\s+([a-zà-ú]+|\\d+)\\s+(?:no|na|em)\\s+([a-zà-ú0-9\\s]+?)\\s+total\\s+r?\\$?\\s*(\\d+(?:[.,]\\d+)?)\\s*${STATUS_WORD}\\.?$`,
  "iu"
);

// Template 3: "Sonho de Pés 16 pendente" (local + valor + status, sem "mais")
const RE_DIRETO = new RegExp(
  `^([a-zà-ú0-9\\s]+?)\\s+r?\\$?\\s*(\\d+(?:[.,]\\d+)?)\\s*${STATUS_WORD}\\.?$`,
  "iu"
);

const RE_GASOLINA = /gasolina\s*(?:de|r\$)?\s*(\d+(?:[.,]\d+)?)/i;

// "pagou" isolado ou "<local> pagou" — nunca deve ter valor numérico junto
const RE_PAGOU = /^(.*?)\s*pagou\.?$/i;

function matchSystemCommand(text: string): ParsedCommand | null {
  const t = text.trim().toLowerCase();
  if (t.includes("manda completo") || t === "completo") {
    return { type: "system", command: "completo" };
  }
  if (t === "semana" || t.includes("resumo da semana") || t.includes("desempenho da semana")) {
    return { type: "system", command: "semana" };
  }
  if (t.includes("quanto falta")) {
    return { type: "system", command: "quanto_falta" };
  }
  if (
    t.includes("fechei o dia") ||
    t.includes("fechar o dia") ||
    t.includes("fechei dia") ||
    t === "fechar dia"
  ) {
    return { type: "system", command: "fechar_dia" };
  }
  return null;
}

export function parseMessage(rawInput: string): ParsedCommand {
  const raw = rawInput.trim();
  if (!raw) return { type: "unknown", raw: rawInput };

  const sys = matchSystemCommand(raw);
  if (sys) return sys;

  const gas = raw.match(RE_GASOLINA);
  if (gas) {
    return { type: "gasolina", valor: toNumber(gas[1]) };
  }

  // "pagou" só conta como confirmação de pagamento se não houver dígitos na frase
  if (!/\d/.test(raw) && RE_PAGOU.test(raw)) {
    const m = raw.match(RE_PAGOU)!;
    const local = m[1].trim();
    return { type: "mark_paid", local: local ? titleCaseLocal(local) : undefined };
  }

  const m1 = raw.match(RE_MAIS_DE);
  if (m1) {
    const qty = parseQty(m1[1]) ?? 1;
    const valorUnit = toNumber(m1[2]);
    const local = titleCaseLocal(m1[3] || "Sem local");
    const status = normalizeStatus(m1[4]);
    return {
      type: "add_ride",
      rides: Array.from({ length: qty }, () => ({ local, valor: valorUnit, status })),
    };
  }

  const m2 = raw.match(RE_MAIS_TOTAL);
  if (m2) {
    const qty = parseQty(m2[1]) ?? 1;
    const local = titleCaseLocal(m2[2]);
    const total = toNumber(m2[3]);
    const status = normalizeStatus(m2[4]);
    const valorUnit = Math.round((total / qty) * 100) / 100;
    return {
      type: "add_ride",
      rides: Array.from({ length: qty }, () => ({ local, valor: valorUnit, status })),
    };
  }

  const m3 = raw.match(RE_DIRETO);
  if (m3) {
    const local = titleCaseLocal(m3[1]);
    const valor = toNumber(m3[2]);
    const status = normalizeStatus(m3[3]);
    return { type: "add_ride", rides: [{ local, valor, status }] };
  }

  return { type: "unknown", raw: rawInput };
}

// Valores padrão — todos editáveis em tela e guardados no estado do app.
export const DEFAULT_RESERVA_BASE = 216.24;
export const DEFAULT_META_DIARIA = 200;
export const DEFAULT_META_SEMANAL = 1200;

// Semana de trabalho editável: por padrão começa na Terça (índice 2,
// no mesmo padrão do JS: 0=Domingo...6=Sábado) e dura 6 dias (Ter-Dom).
export const DEFAULT_WEEK_START_DAY = 2;
export const DEFAULT_WORK_DAYS_COUNT = 6;
export const FULL_DAY_LABELS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
] as const;

export const CUSTO_POR_CORRIDA = 1.5;
export const TAXA_DIARIA_FIXA = 2.5;
export const PERCENTUAL_RESERVA = 0.1;

export const STORAGE_KEY = "motoboy-financial-control:v3";
export const THEME_STORAGE_KEY = "motoboy-financial-control:theme";

// Botões rápidos: NUNCA enviam a corrida sozinhos — só concatenam texto
// no campo de entrada. O envio só acontece no botão de foguete (🚀).
export type QuickActionKind = "value" | "status" | "cost";

export interface QuickAction {
  label: string;
  kind: QuickActionKind;
  insert: string; // texto inserido no campo, sem espaços nas pontas
}

export const QUICK_ACTIONS: QuickAction[] = [
  { label: "+10", kind: "value", insert: "10" },
  { label: "+11", kind: "value", insert: "11" },
  { label: "+12", kind: "value", insert: "12" },
  { label: "+13", kind: "value", insert: "13" },
  { label: "+14", kind: "value", insert: "14" },
  { label: "+15", kind: "value", insert: "15" },
  { label: "✅ Pago", kind: "status", insert: "pago" },
  { label: "⏳ Pendente", kind: "status", insert: "pendente" },
  { label: "⛽ Gasolina", kind: "cost", insert: "gasolina" },
];

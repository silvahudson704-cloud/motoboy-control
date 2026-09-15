export const RESERVA_INICIAL = 216.24;
export const META_DIARIA = 200;
export const META_SEMANAL = 1200;
export const CUSTO_POR_CORRIDA = 1.5;
export const TAXA_DIARIA_FIXA = 2.5;
export const PERCENTUAL_RESERVA = 0.1;

export const STORAGE_KEY = "motoboy-financial-control:v1";

// A semana de trabalho vai de Terça a Domingo.
export const WEEK_DAY_LABELS = [
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
] as const;

export const QUICK_ACTIONS = [
  { label: "+15 Pago", text: "mais uma de 15 paga" },
  { label: "+20 Pago", text: "mais uma de 20 paga" },
  { label: "Gasolina", text: "gasolina " },
  { label: "Pagou", text: "pagou" },
  { label: "Fechar Dia", text: "fechei o dia" },
] as const;

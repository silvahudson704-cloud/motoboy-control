# Motoboy Financial Control

PWA mobile-first, dark mode nativo, para motoboys registrarem corridas por texto informal durante o trabalho.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000` no celular (ou emulador). Para instalar como PWA, use "Adicionar à tela de início" no navegador.

## Decisões de design

- **Paleta:** fundo quase-preto azulado (`#0B0F14`), sem preto puro — reduz o "borrão" em telas OLED e ainda garante contraste alto ao sol. Cor de ação primária é um **amarelo visor** (`#FFC530`), remetendo a viseira de capacete / sinalização, e não o terracota ou verde-neon comuns em interfaces geradas por IA. Verde (`paid`), laranja (`pending`) e vermelho (`cost`) seguem a lógica de sinalização de trânsito para status.
- **Tipografia:** Manrope para textos e rótulos; JetBrains Mono para todos os valores monetários e métricas — leitura rápida de números com espaçamento tabular, como um painel de bordo.
- **Layout:** header fixo com dois anéis de progresso (meta diária/semanal) + card de reserva sempre visível; terminal de entrada fixo embaixo, no formato de chat, com atalhos rápidos roláveis acima do campo de texto — pensado para operação com o polegar, uma mão só.

## Estrutura

```
app/                 App Router (layout, page, estilos globais)
components/          Header, terminal, tabela de corridas, resumos, confete
lib/
  parser.ts          Motor de interpretação das mensagens informais
  calculations.ts    Fórmulas de bruto/custos/líquido/reserva
  useAppState.ts      Hook central: liga parser + cálculos + localStorage
  storage.ts         Persistência em localStorage (offline-first)
  dates.ts            Semana operacional Terça→Domingo
types/               Tipos compartilhados
```

## Motor de parsing — exemplos suportados

| Mensagem | Resultado |
|---|---|
| `mais uma de 15 no Diniz paga` | 1 corrida, Diniz, R$ 15,00, Paga |
| `mais duas no Diniz total 24 pagas` | 2 corridas de R$ 12,00, Diniz, Pagas |
| `Sonho de Pés 16 pendente` | 1 corrida, Sonho De Pés, R$ 16,00, Pendente |
| `pagou` | Marca a pendente mais recente (qualquer local) como paga |
| `Diniz pagou` | Marca a pendente mais recente do Diniz como paga |
| `gasolina 20` | Soma R$ 20,00 aos custos de gasolina do dia |
| `manda completo` / `semana` / `quanto falta?` / `fechei o dia` | Comandos do sistema |

Mensagens que não batem com nenhum padrão retornam `unknown` e aparecem como toast de erro — nada é criado silenciosamente.

## Regras de negócio implementadas

- Reserva inicial de R$ 216,24 nunca zera; cada corrida paga soma 10% do seu valor à reserva (`lib/calculations.ts`, `lib/useAppState.ts`).
- Custos = corridas × R$ 1,50 + R$ 2,50 fixo/dia + gasolina informada.
- Ao usar `pagou`, o valor entra na reserva mas **não** recalcula base operacional nem taxa fixa — só muda o status e credita os 10%.
- Confete + card de destaque disparam uma única vez ao cruzar a meta líquida diária de R$ 200 (`components/Confetti.tsx`, detectado em `useAppState`).

# PLANO DE MIGRAÇÃO — Design System "Velocity Light"

> **Projeto:** GIRO — Sistema de Gestão de Frota CBMGO  
> **Data:** 2026-06-19  
> **Estratégia:** Branch nova a partir da `main`, aplicar o design manualmente componente por componente  
> **Branch de referência:** `feat/velocity-light-design-system`

---

## Contexto

A branch `feat/velocity-light-design-system` implementou um **overhaul visual completo** da aplicação, substituindo o design genérico por uma linguagem visual própria chamada **"Velocity Light"** — um design tático, angular e inspirado em motorsport/engenharia militar.

A `main`, porém, evoluiu bastante em funcionalidades (23 commits à frente do merge-base), incluindo:

- **Combobox** (3 PRs)
- **Vehicle Checklist completo** (schema, backend, páginas, UI — 4 PRs)
- **Temporal API** para reset de motorista por turno
- **Movements Page** (admin)
- **Rich text** em manutenções (TipTap)
- **Validações de KM** na guarita
- **Vários bugfixes**

O CSS base (`index.css`) é **essencialmente idêntico** entre as branches — as diferenças são apenas de formatação e a importação das Google Fonts. O design novo vive **nos estilos inline dos componentes React** (não em classes CSS).

---

## Guia de Referência Rápida do Design System

### Identidade Visual

| Aspecto                  | Especificação                                                           |
| ------------------------ | ----------------------------------------------------------------------- |
| **Estética**             | Light, flat, tático-angular, inspirado em motorsport                    |
| **Background da página** | `#f7f7f7` + listras diagonais sutis `rgba(220,38,38,0.015)` a cada 80px |
| **Superfícies/Cards**    | `#ffffff`                                                               |
| **Cor da marca**         | `#dc2626` (vermelho) — botões, acentos, bordas ativas                   |
| **Cor de dados**         | `#2563eb` (azul) — KM, valores, links                                   |
| **Texto primário**       | `#1a1a1a`                                                               |
| **Texto muted**          | `#999999`                                                               |
| **Bordas**               | `rgba(0,0,0,0.06)`                                                      |
| **Cantos**               | **clip-path chanfrados** (NÃO border-radius)                            |
| **Sombras**              | Praticamente zero — só `hover:shadow-md` em interações                  |

### Tipografia

| Fonte                | Peso    | Uso                                                           |
| -------------------- | ------- | ------------------------------------------------------------- |
| **Bebas Neue**       | 400     | Headings, números grandes, brand "GIRO", prefixos de viaturas |
| **Barlow**           | 300-700 | Body text, inputs, descrições, UI geral                       |
| **Barlow Condensed** | 400-700 | Labels, badges, navegação, meta info, uppercase               |
| **Menlo** (mono)     | —       | Valores de KM, números de processo                            |

### Import de Fontes (adicionar no `index.css`)

```css
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;500;600;700&display=swap");
```

### Padrões de Tipografia

```
Título de página:     Bebas Neue, ~28px, #1a1a1a, tracking 0.04em, UPPERCASE
                      + barra vermelha abaixo: h-0.5 w-6 bg-#dc2626

Label de seção:       Barlow Condensed, 600, tracking 0.1em, UPPERCASE
                      + barra vermelha abaixo: h-px w-6 bg-#dc2626

Label de campo:       Barlow Condensed, 600, 10px, #999, tracking 0.15em, UPPERCASE

Valor de campo:       Barlow, 600, 15px, #1a1a1a

Body text:            Barlow, 400, 13-15px, #1a1a1a

Stat number:          Bebas Neue, text-3xl, #1a1a1a

Badge text:           Barlow Condensed, 600, 10px, tracking 0.1em, UPPERCASE

Nav item:             Barlow Condensed, 500/700, 12px, tracking 0.1em, UPPERCASE
```

### Clip-Path (Elemento Assinatura)

Todos os cantos usam este padrão — **NÃO usar border-radius** em componentes custom:

```css
clippath: polygon(
  0 0,
  calc(100% - Xpx) 0,
  100% Xpx,
  100% 100%,
  Xpx 100%,
  0 calc(100% - Xpx)
);
```

| Elemento                 | X (tamanho do corte) |
| ------------------------ | -------------------- |
| Badges                   | 4px                  |
| Botões pequenos          | 6px                  |
| Guarita button (sidebar) | 8px                  |
| Inputs                   | 8px                  |
| Stat cards               | 10px                 |
| Vehicle cards            | 10px                 |
| Botão primário           | 12px                 |
| Login form panel         | 16px                 |

### Padrão de Badge

```tsx
const velBadge = {
  display: "inline-flex" as const,
  alignItems: "center" as const,
  padding: "2px 10px",
  fontSize: "10px",
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  clipPath:
    "polygon(0 0, calc(100%-4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100%-4px))",
};
```

### Mapa de Cores de Badge

| Estado                        | Background              | Cor do texto |
| ----------------------------- | ----------------------- | ------------ |
| Ativa / Concluída / Resolvido | `rgba(22,163,74,0.08)`  | `#16a34a`    |
| Em Manutenção / Corretiva     | `rgba(249,115,22,0.08)` | `#ea580c`    |
| Operacional / Info            | `rgba(37,99,235,0.08)`  | `#2563eb`    |
| Backup / Neutral              | `rgba(0,0,0,0.04)`      | `#999`       |
| Em Andamento / Média          | `rgba(234,179,8,0.08)`  | `#ca8a04`    |
| Cancelada / Crítica           | `rgba(220,38,38,0.08)`  | `#dc2626`    |
| Baixa                         | `rgba(37,99,235,0.08)`  | `#2563eb`    |

### Padrão de Card

```tsx
const velPanel: CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(0,0,0,0.06)",
  clipPath:
    "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
};
```

### Padrão de Botão Primário

```tsx
const velBtnPrimary: CSSProperties = {
  background: "#dc2626",
  color: "#fff",
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  padding: "10px 24px",
  border: "none",
  cursor: "pointer",
  clipPath:
    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
};
// hover: background: "#b91c1c", translateY(-1px), box-shadow: 0 6px 24px rgba(220,38,38,0.3)
```

### Padrão de Botão "Voltar"

```tsx
const velBtnBack: CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#999",
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  cursor: "pointer",
};
// Com ícone ArrowLeft size={14}
```

---

## Pré-requisitos

1. Criar branch nova a partir da `main`:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/apply-velocity-light-design
   ```

2. Ter a branch `feat/velocity-light-design-system` disponível como referência para copiar estilos

---

## FASE 0 — Fundação: CSS, Fontes e Módulo de Estilos Centralizado

**Objetivo:** Preparar a base — importar as fontes e centralizar os objetos de estilo reutilizáveis.

### 0.1 — Atualizar `src/index.css`

**O que fazer:** Adicionar a importação das Google Fonts no topo do arquivo.

**Before:** O arquivo começa com `@import "tailwindcss";`

**After:** Adicionar ANTES de tudo:

```css
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;500;600;700&display=swap");
```

### 0.2 — Criar `src/styles/velocity.ts` (NOVO ARQUIVO)

**O que fazer:** Centralizar todos os objetos de estilo inline reutilizáveis para evitar copy-paste em cada componente. Na branch de design, os mesmos estilos são repetidos em ~15 arquivos. Vamos fazer melhor.

Conteúdo completo:

```tsx
import type { CSSProperties } from "react";

// ── Cores ──
export const colors = {
  brand: "#dc2626",
  brandHover: "#b91c1c",
  brandDanger: "#991b1b",
  data: "#2563eb",
  text: "#1a1a1a",
  muted: "#999",
  mutedLight: "#bbb",
  placeholder: "#c0c0c0",
  surface: "#fff",
  background: "#f7f7f7",
  border: "rgba(0,0,0,0.06)",
  borderLight: "rgba(0,0,0,0.04)",
  green: "#16a34a",
  orange: "#ea580c",
  amber: "#ca8a04",
  blue: "#2563eb",
  red: "#dc2626",
} as const;

// ── Clip-paths ──
export function clipCorners(size: number): string {
  return `polygon(0 0, calc(100% - ${size}px) 0, 100% ${size}px, 100% 100%, ${size}px 100%, 0 calc(100% - ${size}px))`;
}

// ── Fontes ──
export const fonts = {
  display: "'Bebas Neue', sans-serif",
  body: "'Barlow', sans-serif",
  ui: "'Barlow Condensed', sans-serif",
  mono: "Menlo, monospace",
} as const;

// ── Estilos reutilizáveis ──
export const velPanel: CSSProperties = {
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  clipPath: clipCorners(10),
};

export const velBtnPrimary: CSSProperties = {
  background: colors.brand,
  color: "#fff",
  fontFamily: fonts.ui,
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  padding: "10px 24px",
  border: "none",
  cursor: "pointer",
  clipPath: clipCorners(12),
};

export const velBtnOutline: CSSProperties = {
  background: "transparent",
  color: colors.muted,
  fontFamily: fonts.ui,
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  padding: "10px 24px",
  border: "1px solid rgba(0,0,0,0.1)",
  cursor: "pointer",
  clipPath: clipCorners(12),
};

export const velBtnBack: CSSProperties = {
  background: "transparent",
  border: "none",
  color: colors.muted,
  fontFamily: fonts.ui,
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  cursor: "pointer",
};

export const velBtnDanger: CSSProperties = {
  ...velBtnPrimary,
  background: colors.brandDanger,
};

export const velSectionLabel: CSSProperties = {
  fontSize: "10px",
  color: colors.muted,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  fontFamily: fonts.ui,
  fontWeight: 600,
};

export const velFieldLabel: CSSProperties = {
  fontSize: "10px",
  color: colors.muted,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  fontFamily: fonts.ui,
  fontWeight: 600,
  marginBottom: "4px",
};

export const velFieldValue: CSSProperties = {
  fontSize: "15px",
  color: colors.text,
  fontFamily: fonts.body,
  fontWeight: 600,
};

export const velPageTitle: CSSProperties = {
  fontFamily: fonts.display,
  fontSize: "28px",
  color: colors.text,
  letterSpacing: "0.04em",
  lineHeight: 1,
};

export const velBadge = (bg: string, fg: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "2px 10px",
  fontSize: "10px",
  fontFamily: fonts.ui,
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  background: bg,
  color: fg,
  clipPath: clipCorners(4),
});

export const badgePresets = {
  active: () => velBadge("rgba(22,163,74,0.08)", colors.green),
  completed: () => velBadge("rgba(22,163,74,0.08)", colors.green),
  resolved: () => velBadge("rgba(22,163,74,0.08)", colors.green),
  inProgress: () => velBadge("rgba(234,179,8,0.08)", colors.amber),
  pending: () => velBadge("rgba(234,179,8,0.08)", colors.amber),
  maintenance: () => velBadge("rgba(249,115,22,0.08)", colors.orange),
  corrective: () => velBadge("rgba(249,115,22,0.08)", colors.orange),
  high: () => velBadge("rgba(249,115,22,0.08)", colors.orange),
  info: () => velBadge("rgba(37,99,235,0.08)", colors.blue),
  operational: () => velBadge("rgba(37,99,235,0.08)", colors.blue),
  low: () => velBadge("rgba(37,99,235,0.08)", colors.blue),
  neutral: () => velBadge("rgba(0,0,0,0.04)", colors.muted),
  cancelled: () => velBadge("rgba(220,38,38,0.08)", colors.red),
  critical: () => velBadge("rgba(220,38,38,0.08)", colors.red),
  closed: () => velBadge("rgba(0,0,0,0.04)", colors.muted),
} as const;

export const velStatCard: CSSProperties = { ...velPanel, padding: "20px" };

export const velIconContainer: CSSProperties = {
  width: "40px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(220,38,38,0.04)",
  clipPath: clipCorners(6),
};

export const diagonalStripes: CSSProperties = {
  background:
    "repeating-linear-gradient(-45deg, transparent, transparent 80px, rgba(220,38,38,0.015) 80px, rgba(220,38,38,0.015) 82px)",
};

export const frostedGlass: CSSProperties = {
  background: "rgba(247,247,247,0.92)",
  backdropFilter: "blur(12px)",
  borderBottom: `1px solid ${colors.border}`,
};

export const velRedBar = (width = 24, height = 2): CSSProperties => ({
  width: `${width}px`,
  height: `${height}px`,
  background: colors.brand,
});

export const velDivider: CSSProperties = {
  borderTop: `1px solid ${colors.border}`,
};

export const velTableHeader: CSSProperties = {
  fontSize: "10px",
  color: colors.muted,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  fontFamily: fonts.ui,
  fontWeight: 600,
  background: "rgba(0,0,0,0.02)",
  padding: "12px 24px",
  borderBottom: `1px solid ${colors.border}`,
};

export const velTableCell: CSSProperties = {
  fontSize: "13px",
  color: colors.text,
  fontFamily: fonts.body,
  padding: "16px 24px",
  borderBottom: `1px solid ${colors.borderLight}`,
};
```

### 0.3 — Criar `src/components/common/Logo.tsx` (NOVO ARQUIVO)

**O que fazer:** Copiar da branch de design o componente Logo SVG.

```bash
git show feat/velocity-light-design-system:src/components/common/Logo.tsx > src/components/common/Logo.tsx
git show feat/velocity-light-design-system:public/logo.svg > public/logo.svg
```

---

## FASE 1 — Layout Shell (Header, Sidebar, Layout, GuaritaLayout)

**Objetivo:** Transformar a "casca" da aplicação. Após esta fase, toda navegação e estrutura visual já estará no novo design.

### 1.1 — `src/components/layout/Header.tsx`

**Before (main):** Usa classes Tailwind genéricas, ícone `Truck`, link "GIRO" sem branding.

**After:** Header frosted-glass com Logo SVG, "GIRO" em Bebas Neue, barra vermelha gradiente, label "ADMIN · CBMGO", botão sair com clip-path.

**Referência completa:** `git show feat/velocity-light-design-system:src/components/layout/Header.tsx`

**Instruções passo a passo:**

1. Importar `Logo` de `../common/Logo`
2. Importar `{ frostedGlass, clipCorners, fonts }` de `@/styles/velocity`
3. Remover ícone `Truck`
4. Substituir o `<header>` com:
   - `style={frostedGlass}` no `<header>`
   - Logo + "GIRO" em Bebas Neue + barra vermelha gradiente `linear-gradient(90deg, #dc2626, transparent)` + label "ADMIN · CBMGO" em Barlow Condensed 10px
   - Botão sair: `Barlow Condensed`, 600, uppercase, borda `rgba(0,0,0,0.06)`, `clipPath: clipCorners(6)`

### 1.2 — `src/components/layout/Sidebar.tsx`

**Before (main):** Lista de navegação com 7 items (inclui Checklists e Movimentações), classes Tailwind genéricas (`rounded-lg`, `bg-accent`).

**After:** Sidebar white com borda sutil, nav items em Barlow Condensed uppercase, estado ativo com borda vermelha esquerda, botão "Guarita" vermelho com clip-path no fundo.

**Instruções passo a passo:**

1. Importar `{ fonts, colors, clipCorners }` de `@/styles/velocity`
2. **MANTER** os items de navegação da main (Checklists, Movimentações) — a design branch não os tem
3. Substituir classes do `<aside>`:
   - `style={{ background: "#fff", borderRight: "1px solid rgba(0,0,0,0.06)" }}`
   - Largura: `w-60` (240px), fixed left, `top-[65px]`
4. Nav items:
   - `fontFamily: fonts.ui`, `fontWeight: isActive ? 700 : 500`
   - `color: isActive ? colors.brand : colors.muted`
   - `background: isActive ? "rgba(220,38,38,0.04)" : "transparent"`
   - `borderLeft: isActive ? "2px solid #dc2626" : "2px solid transparent"`
   - Ícone: `size={18} strokeWidth={isActive ? 2.5 : 1.5}`
   - `text-xs tracking-[0.1em] uppercase`
5. Adicionar botão "Guarita" fixo no fundo:
   - Red bg, white text, `clipPath: clipCorners(8)`
   - Link para `/guarita`

### 1.3 — `src/components/layout/Layout.tsx`

**Before (main):** Layout básico com classes Tailwind.

**After:** Background `#f7f7f7` + listras diagonais, font Barlow, force light theme.

**Instruções passo a passo:**

1. Importar `{ diagonalStripes, fonts, colors }` de `@/styles/velocity`
2. Wrapper: `className="light min-h-screen"` + `style={{ background: colors.background, fontFamily: fonts.body }}`
3. Adicionar div de listras diagonais: `className="fixed inset-0 pointer-events-none"` + `style={diagonalStripes}`
4. Conteúdo: `className="flex-1 p-6 ml-60 relative z-10"` + `max-w-7xl mx-auto`
5. Manter `useLayoutEffect` para forçar light theme

### 1.4 — `src/components/layout/GuaritaLayout.tsx`

**Before (main):** Layout sem sidebar, usa classes Tailwind, inclui navegação Guarita/Checklist.

**After:** Mesma estrutura de frosted-glass do Header, listras diagonais, Logo + "GIRO" + label "CBMGO · 8°BBM".

**Instruções passo a passo:**

1. Importar estilos de `@/styles/velocity`
2. **MANTER** a lógica de navegação Guarita/Checklist da main (nav tabs)
3. Aplicar `frostedGlass` no header
4. Logo + "GIRO" em Bebas Neue + barra vermelha
5. Botão sair com clip-path
6. Background com `diagonalStripes`
7. Font Barlow no container

---

## FASE 2 — Componentes de UI Base (Loading, SimpleSelect, DatePicker, Login)

**Objetivo:** Transformar os componentes utilitários compartilhados e a página de login.

### 2.1 — `src/components/common/Loading.tsx`

**Before:** Spinner genérico com classes Tailwind.

**After:** Spinner com cor `#dc2626`, texto em Barlow Condensed uppercase.

**Referência:** `git show feat/velocity-light-design-system:src/components/common/Loading.tsx`

### 2.2 — `src/components/common/SimpleSelect.tsx`

**Before:** Select com classes Tailwind genéricas.

**After:** Select com bordas `rgba(0,0,0,0.06)`, clip-path, fonte Barlow.

**Referência:** `git show feat/velocity-light-design-system:src/components/common/SimpleSelect.tsx`

### 2.3 — `src/components/common/DatePicker.tsx`

**Before:** DatePicker com classes genéricas.

**After:** DatePicker com bordas e tipografia Velocity Light.

**Referência:** `git show feat/velocity-light-design-system:src/components/common/DatePicker.tsx`

### 2.4 — `src/App.tsx` (Login)

**Before (main):** Login inline no App.tsx com Truck icon, classes Tailwind genéricas.

**After:** Extrair para componente separado `LoginVelocityLight`, com split layout, gradientes, animações.

**Instruções passo a passo:**

1. Copiar `src/pages/login/LoginVelocityLight.tsx` da branch de design
2. No `App.tsx`:
   - Remover a `function LoginPage()` inline inteira (schemas + component)
   - Importar `LoginVelocityLight` de `./pages/login/LoginVelocityLight`
   - No `<Unauthenticated>`, trocar `<LoginPage />` por `<LoginVelocityLight />`
3. Limpar imports não usados (Truck, zodResolver, Controller, useForm, z, Field, Input, etc.)
4. **MANTER** todas as rotas da main (incluindo checklist, movements, admin/checklists)

> **Nota:** Não trazer as outras 5 variantes de login. Apenas a `LoginVelocityLight`.

---

## FASE 3 — Badges e Indicadores de Status

**Objetivo:** Transformar todos os badges para o padrão Velocity Light (clip-path, Barlow Condensed, 10px, uppercase).

### 3.1 — `src/components/vehicles/VehicleActivityBadge.tsx`

**Before:** Badges `rounded-full` com Tailwind colors.

**After:** Badges com `velBadge()`, clip-path 4px.

**Mapa de status:**

- `disponivel` → `badgePresets.active()`
- `em_transito` → `badgePresets.info()`
- `em_manutencao` → `badgePresets.maintenance()`

**Referência:** `git show feat/velocity-light-design-system:src/components/vehicles/VehicleActivityBadge.tsx`

### 3.2 — `src/components/vehicles/VehicleServiceBadge.tsx`

**Before:** Badges `rounded-full` com border.

**After:** Badges com `velBadge()`, clip-path 4px.

**Mapa de status:**

- `operacional` → `badgePresets.operational()`
- `reserva` → `badgePresets.neutral()`

**Referência:** `git show feat/velocity-light-design-system:src/components/vehicles/VehicleServiceBadge.tsx`

### 3.3 — `src/components/maintenance/MaintenanceStatusBadge.tsx`

**Before:** Badges `rounded-full` com Tailwind.

**After:** Badges com `velBadge()`, clip-path 4px.

**Mapa de status:**

- `aguardando_ceman` → `badgePresets.pending()`
- `em_andamento` → `badgePresets.inProgress()`
- `concluida` → `badgePresets.completed()`
- `cancelada` → `badgePresets.cancelled()`

**Referência:** `git show feat/velocity-light-design-system:src/components/maintenance/MaintenanceStatusBadge.tsx`

### 3.4 — `src/components/maintenance/MaintenanceTypeBadge.tsx`

**Mapa de status:**

- `preventiva` → `badgePresets.info()`
- `corretiva` → `badgePresets.corrective()`

**Referência:** `git show feat/velocity-light-design-system:src/components/maintenance/MaintenanceTypeBadge.tsx`

### 3.5 — `src/components/issues/IssueSeverityBadge.tsx`

**Mapa de severidade:**

- `baixa` → `badgePresets.low()`
- `media` → `badgePresets.inProgress()`
- `alta` → `badgePresets.high()`
- `critica` → `badgePresets.critical()`

**Referência:** `git show feat/velocity-light-design-system:src/components/issues/IssueSeverityBadge.tsx`

### 3.6 — `src/components/issues/IssueStatusBadge.tsx`

**Mapa de status:**

- `aberto` → `badgePresets.high()`
- `em_andamento` → `badgePresets.inProgress()`
- `resolvido` → `badgePresets.resolved()`
- `fechado` → `badgePresets.closed()`

**Referência:** `git show feat/velocity-light-design-system:src/components/issues/IssueStatusBadge.tsx`

---

## FASE 4 — Cards e Componentes de Listagem

**Objetivo:** Transformar os cards de exibição de dados.

### 4.1 — `src/components/dashboard/StatCard.tsx`

**Before:** Card com `border-l-4` colorido, `rounded-xl`, ícone em container `rounded-xl`.

**After:** Card com clip-path 10px, ícone em container clip-path 6px, tipografia Bebas Neue para valor + Barlow Condensed para label.

**Instruções passo a passo:**

1. Substituir todo o container por `style={velStatCard}`
2. Label: `style={velSectionLabel}` (10px, #999, Barlow Condensed, uppercase)
3. Valor: Bebas Neue, text-3xl, #1a1a1a
4. Ícone container: `style={velIconContainer}` (40x40, rgba(220,38,38,0.04), clip-path 6px)
5. Remover `border-l-4` e `rounded-xl`
6. Manter `hover:shadow-md transition-shadow`

**Referência:** `git show feat/velocity-light-design-system:src/components/dashboard/StatCard.tsx`

### 4.2 — `src/components/vehicles/VehicleCard.tsx`

**Before:** Card com `rounded-xl border shadow-sm`.

**After:** Card com clip-path 10px, plate em Bebas Neue, KM em azul `#2563eb`, labels em Barlow Condensed.

**Instruções passo a passo:**

1. Container: `style={velPanel}` com padding 16-20px
2. Placa: `fontFamily: fonts.display`, `text-lg`
3. Modelo: `fontFamily: fonts.body`, `color: "#999"`, `fontSize: "13px"`
4. Labels: `style={velFieldLabel}`
5. Valores de KM: `color: colors.data`, `fontFamily: fonts.mono`
6. Separadores: `borderTop: "1px solid rgba(0,0,0,0.06)"`
7. `hover:shadow-md transition-shadow`

**Referência:** `git show feat/velocity-light-design-system:src/components/vehicles/VehicleCard.tsx`

### 4.3 — `src/components/vehicles/VehicleList.tsx`

Manter grid layout, ajustar estilos se necessário.

**Referência:** `git show feat/velocity-light-design-system:src/components/vehicles/VehicleList.tsx`

### 4.4 — `src/components/alerts/AlertCard.tsx`

**Before:** Card com `border-l-4` colorido por severidade, `rounded-xl`.

**After:** Borda esquerda 3px por severidade, background tintado (4% opacity), ícone circular, labels Barlow Condensed, valores KM em azul.

**Referência:** `git show feat/velocity-light-design-system:src/components/alerts/AlertCard.tsx`

### 4.5 — `src/components/alerts/AlertsSection.tsx`

Título da seção em Barlow Condensed uppercase + barra vermelha.

**Referência:** `git show feat/velocity-light-design-system:src/components/alerts/AlertsSection.tsx`

### 4.6 — `src/components/issues/IssueCard.tsx`

Card com borda esquerda 3px, labels em Barlow Condensed, date em Barlow Condensed uppercase.

**Referência:** `git show feat/velocity-light-design-system:src/components/issues/IssueCard.tsx`

### 4.7 — `src/components/issues/IssueList.tsx`

Ajustar grid se necessário.

### 4.8 — `src/components/maintenance/MaintenanceTable.tsx`

**Before:** Tabela com classes Tailwind genéricas.

**After:** Headers com `velTableHeader`, cells com `velTableCell`, container `velPanel` sem padding (overflow-hidden), hover `bg-black/[0.02]`.

**Referência:** `git show feat/velocity-light-design-system:src/components/maintenance/MaintenanceTable.tsx`

---

## FASE 5 — Páginas de Listagem e Dashboard

**Objetivo:** Transformar as páginas que listam dados.

### 5.1 — `src/pages/DashboardPage.tsx`

Título em Bebas Neue + barra vermelha, stats redesenhados, alertas com label em `velSectionLabel`.

**Referência:** `git show feat/velocity-light-design-system:src/pages/DashboardPage.tsx`

### 5.2 — `src/pages/VehiclesPage.tsx`

Título Bebas Neue + barra vermelha, botão "Nova Viatura" `velBtnPrimary`, filtros com Barlow.

**Referência:** `git show feat/velocity-light-design-system:src/pages/VehiclesPage.tsx`

### 5.3 — `src/pages/MaintenancesPage.tsx`

Título Bebas Neue, tabs/filtros com Barlow Condensed, tabela redesenhada.

**Referência:** `git show feat/velocity-light-design-system:src/pages/MaintenancesPage.tsx`

### 5.4 — `src/pages/IssuesPage.tsx`

Título Bebas Neue, filtros redesenhados, cards redesenhados.

**Referência:** `git show feat/velocity-light-design-system:src/pages/IssuesPage.tsx`

### 5.5 — `src/pages/GuaritaPage.tsx`

> ⚠️ **ATENÇÃO:** MAIOR e mais complexa página (778 linhas na main). A main tem features adicionais (validações de KM, veículos em manutenção, etc.) que a design branch NÃO tem.

**Instruções:**

1. Título: Bebas Neue + barra vermelha
2. Stats de resumo: `velStatCard` + Bebas Neue para números
3. Tabela de movimentos: `velTableHeader` + `velTableCell`
4. Botões: `velBtnPrimary`
5. Cards de veículos: `velPanel`
6. **MANTER toda a lógica/funcionalidade da main**

**Referência:** `git show feat/velocity-light-design-system:src/pages/GuaritaPage.tsx`

---

## FASE 6 — Páginas de Detalhe e Formulários

**Objetivo:** Transformar as páginas de visualização individual e formulários.

### 6.1 — `src/pages/VehicleDetailPage.tsx`

Panel com clip-path, campos com labels Barlow Condensed, valores em Barlow, KM em azul.

- Botão voltar: `velBtnBack` + ArrowLeft icon
- Título: Bebas Neue
- Seções: `velSectionLabel` + barra vermelha
- Campos: `velFieldLabel` + `velFieldValue`
- Containers: `velPanel`
- Ações: `velBtnPrimary` / `velBtnDanger`

**Referência:** `git show feat/velocity-light-design-system:src/pages/VehicleDetailPage.tsx`

### 6.2 — `src/pages/VehicleFormPage.tsx`

Container `velPanel`, labels `velFieldLabel`, inputs com bordas sutis, botões clip-path.

**Referência:** `git show feat/velocity-light-design-system:src/pages/VehicleFormPage.tsx`

### 6.3 — `src/pages/IssueDetailPage.tsx`

Mesma transformação do VehicleDetailPage.

**Referência:** `git show feat/velocity-light-design-system:src/pages/IssueDetailPage.tsx`

### 6.4 — `src/pages/IssueFormPage.tsx`

Mesmo padrão do VehicleFormPage.

**Referência:** `git show feat/velocity-light-design-system:src/pages/IssueFormPage.tsx`

### 6.5 — `src/pages/MaintenanceDetailPage.tsx`

> ⚠️ A main tem rich text (TipTap) que a design branch NÃO tem. **Manter TipTap.**

**Referência:** `git show feat/velocity-light-design-system:src/pages/MaintenanceDetailPage.tsx`

### 6.6 — `src/pages/MaintenanceFormPage.tsx`

> ⚠️ A main tem TipTap editor. **Manter TipTap.**

**Referência:** `git show feat/velocity-light-design-system:src/pages/MaintenanceFormPage.tsx`

### 6.7 — `src/components/issues/IssueForm.tsx`

Labels, inputs, e botões redesenhados.

**Referência:** `git show feat/velocity-light-design-system:src/components/issues/IssueForm.tsx`

### 6.8 — `src/components/vehicles/VehicleForm.tsx`

Labels, inputs, e botões redesenhados.

**Referência:** `git show feat/velocity-light-design-system:src/components/vehicles/VehicleForm.tsx`

### 6.9 — `src/components/maintenance/MaintenanceForm.tsx`

> ⚠️ **Manter TipTap** da main.

**Referência:** `git show feat/velocity-light-design-system:src/components/maintenance/MaintenanceForm.tsx`

---

## FASE 7 — Modals e Páginas Novas (Exclusivas da Main)

**Objetivo:** Aplicar design nos modals da Guarita e nas páginas que SÓ existem na main.

### 7.1 — `src/components/guarita/DepartureModal.tsx`

Labels `velFieldLabel`, inputs Barlow, botão submit `velBtnPrimary`. **MANTER** combobox da main.

**Referência:** `git show feat/velocity-light-design-system:src/components/guarita/DepartureModal.tsx`

### 7.2 — `src/components/guarita/ArrivalModal.tsx`

Mesmo padrão. **Manter da main:** Validação de KM.

**Referência:** `git show feat/velocity-light-design-system:src/components/guarita/ArrivalModal.tsx`

### 7.3 — `src/components/guarita/EditMovementModal.tsx`

Mesmo padrão.

**Referência:** `git show feat/velocity-light-design-system:src/components/guarita/EditMovementModal.tsx`

### 7.4 — `src/components/guarita/PersonnelQuickAddModal.tsx`

Mesmo padrão de modal.

**Referência:** `git show feat/velocity-light-design-system:src/components/guarita/PersonnelQuickAddModal.tsx`

### 7.5 — `src/pages/MovementsPage.tsx` ⚡ SÓ EXISTE NA MAIN — DESIGN DO ZERO

**Padrão a seguir (493 linhas):**

1. Título: `style={velPageTitle}` + barra vermelha
2. Tabela: `velTableHeader` + `velTableCell` + container `velPanel`
3. Filtros: Barlow Condensed labels, inputs com bordas sutis
4. Badges de status: `badgePresets.*`
5. Botões: `velBtnPrimary` para ações
6. Modals: títulos em Barlow, labels `velFieldLabel`

### 7.6 — `src/pages/ChecklistPage.tsx` ⚡ SÓ EXISTE NA MAIN — DESIGN DO ZERO

**Padrão a seguir (475 linhas):**

1. Título: Bebas Neue + barra vermelha
2. Cards de seleção: `velPanel` com clip-path
3. Labels: `velFieldLabel`
4. Botões: `velBtnPrimary`
5. Checklist items: Barlow body, separadores `rgba(0,0,0,0.06)`
6. Badges: `badgePresets.*`
7. Combobox: manter funcionalidade, ajustar estilos

### 7.7 — `src/pages/AdminChecklistsPage.tsx` ⚡ SÓ EXISTE NA MAIN — DESIGN DO ZERO

**Padrão a seguir (815 linhas — MAIOR página nova):**

1. Título: Bebas Neue + barra vermelha
2. Tabs: Barlow Condensed uppercase, ativa com borda vermelha inferior
3. Tabelas: `velTableHeader` + `velTableCell`
4. Modals (CRUD): labels `velFieldLabel`, inputs Barlow, botões `velBtnPrimary`
5. Cards de templates: `velPanel`
6. Badges: `badgePresets.*`
7. ChecklistTemplateEditor: manter TipTap, ajustar container

### 7.8 — `src/components/checklists/ChecklistTemplateEditor.tsx` ⚡ SÓ EXISTE NA MAIN

Aplicar design no editor de template. (141 linhas)

Container `velPanel`, labels `velFieldLabel`, bordas sutis.

### 7.9 — `src/components/common/RichTextRenderer.tsx` ⚡ SÓ EXISTE NA MAIN

Manter funcionalidade, ajustar tipografia para Barlow. (33 linhas — simples)

---

## FASE 8 — Polimento e QA

### 8.1 — Componentes UI shadcn

Verificar e ajustar se necessário:

- `src/components/ui/card.tsx` — `rounded-xl` pode conflitar com clip-path custom
- `src/components/ui/button.tsx` — cores e fontes
- `src/components/ui/input.tsx` — bordas, focus ring
- `src/components/ui/dialog.tsx` — estilo dos modals
- `src/components/ui/textarea.tsx` — bordas, fonte
- `src/components/ui/combobox.tsx` — manter funcionalidade
- `src/components/ui/input-group.tsx` — estilos

**Referência:** `git show feat/velocity-light-design-system:src/components/ui/<file>`

### 8.2 — Verificação Visual Completa

Testar TODAS as rotas:

| Rota                    | Página                | Check |
| ----------------------- | --------------------- | ----- |
| `/`                     | Redirect → `/guarita` | ⬜    |
| `/guarita`              | GuaritaPage           | ⬜    |
| `/checklist`            | ChecklistPage         | ⬜    |
| `/admin`                | DashboardPage         | ⬜    |
| `/vehicles`             | VehiclesPage          | ⬜    |
| `/vehicles/new`         | VehicleFormPage       | ⬜    |
| `/vehicles/:id`         | VehicleDetailPage     | ⬜    |
| `/vehicles/:id/edit`    | VehicleFormPage       | ⬜    |
| `/maintenance`          | MaintenancesPage      | ⬜    |
| `/maintenance/new`      | MaintenanceFormPage   | ⬜    |
| `/maintenance/:id`      | MaintenanceDetailPage | ⬜    |
| `/maintenance/:id/edit` | MaintenanceFormPage   | ⬜    |
| `/issues`               | IssuesPage            | ⬜    |
| `/issues/new`           | IssueFormPage         | ⬜    |
| `/issues/:id`           | IssueDetailPage       | ⬜    |
| `/issues/:id/edit`      | IssueFormPage         | ⬜    |
| `/movements`            | MovementsPage         | ⬜    |
| `/admin/checklists`     | AdminChecklistsPage   | ⬜    |
| `/settings`             | Placeholder           | ⬜    |
| Login                   | LoginVelocityLight    | ⬜    |

### 8.3 — Checklist de Consistência Visual

Para **cada página**, verificar:

- [ ] Fontes corretas (Bebas Neue headings, Barlow Condensed labels, Barlow body)
- [ ] Cores corretas (#dc2626 acentos, #2563eb dados, #999 muted)
- [ ] Clip-path nos tamanhos corretos (ver tabela)
- [ ] NENHUM `border-radius` em componentes custom
- [ ] Hover states (shadow-md em cards)
- [ ] Labels uppercase com tracking
- [ ] Separadores `rgba(0,0,0,0.06)`
- [ ] Nenhum estilo antigo remanescente

### 8.4 — Limpeza Final

1. Verificar que NÃO foram copiadas variantes de login extras
2. Verificar imports de `@/styles/velocity`
3. Remover classes Tailwind substituídas por inline styles

---

## Resumo de Escopo por Fase

| Fase  | Escopo                                          | Arquivos            | Complexidade |
| ----- | ----------------------------------------------- | ------------------- | ------------ |
| **0** | Fundação (CSS, fontes, módulo de estilos)       | 3 novos             | 🟢 Baixa     |
| **1** | Layout Shell (Header, Sidebar, Layout, Guarita) | 4 arquivos          | 🟡 Média     |
| **2** | UI Base (Loading, Select, DatePicker, Login)    | 4-5 arquivos        | 🟡 Média     |
| **3** | Badges (6 componentes)                          | 6 arquivos          | 🟢 Baixa     |
| **4** | Cards e Listagens (8 componentes)               | 8 arquivos          | 🟡 Média     |
| **5** | Páginas de Listagem (5 páginas + Guarita)       | 6 arquivos          | 🔴 Alta      |
| **6** | Páginas de Detalhe e Forms (9 componentes)      | 9 arquivos          | 🔴 Alta      |
| **7** | Modals + Páginas Novas da Main (9 itens)        | 9 arquivos          | 🔴 Alta      |
| **8** | Polimento e QA                                  | ~7 UI + verificação | 🟡 Média     |

**Total: ~50 arquivos a modificar/criar**

---

## Notas Importantes

> [!CAUTION]
> **NUNCA substituir código da main cegamente com código da branch de design.** A main tem features que a design branch NÃO tem. Sempre: ler a versão da main → entender a lógica → aplicar apenas os estilos da design branch.

> [!IMPORTANT]
> **As páginas ChecklistPage, AdminChecklistsPage e MovementsPage precisam de design do ZERO** — não existe referência na branch de design. Use os padrões documentados neste plano + as outras páginas já migradas como referência.

> [!TIP]
> **Use o módulo `src/styles/velocity.ts`** em vez de copy-paste de objetos de estilo. Isso evita o problema da design branch onde os mesmos 100+ linhas de constantes são repetidas em cada arquivo.

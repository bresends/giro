/**
 * Classes da direção "Placar" para primitivas compartilhadas (Dialog, Input, select).
 * Os modais abrem em portal fora do `GuaritaLayout`, por isso a fonte é repetida aqui.
 * As classes são combinadas com as das primitivas via `cn` (tailwind-merge).
 */
export const giroDialog =
  "font-giro text-giro-fg bg-white border-0 rounded-3xl p-5 sm:p-6 gap-5 shadow-[0_24px_64px_rgb(0_0_0/0.18)] max-w-[calc(100%-1.5rem)] sm:max-w-lg max-h-[calc(100dvh-1.5rem)] overflow-y-auto";

export const giroDialogTitle = "text-xl font-semibold tracking-[-0.3px] text-giro-fg";

export const giroDialogDescription = "text-sm text-giro-muted";

export const giroLabel = "text-[13px] font-medium text-giro-fg";

export const giroField =
  "h-11 rounded-xl border-giro-separator bg-white px-3.5 text-[15px] shadow-none md:text-[15px] placeholder:text-giro-muted focus-visible:border-giro-accent focus-visible:ring-giro-accent/20";

export const giroSelect =
  "h-11 rounded-xl border-giro-separator bg-white px-3 text-[15px] md:text-[15px] focus-visible:ring-giro-accent/30 focus-visible:ring-offset-0";

/** Aplicado ao `InputGroup` do Combobox. */
export const giroCombobox =
  "h-11 w-full rounded-xl border-giro-separator bg-white shadow-none text-[15px] has-[[data-slot=input-group-control]:focus-visible]:border-giro-accent has-[[data-slot=input-group-control]:focus-visible]:ring-giro-accent/20";

/** Caixas informativas dentro dos modais. */
export const giroInfoBox = "rounded-2xl bg-giro-surface-2 p-4";
export const giroErrorBox =
  "rounded-2xl bg-giro-accent-soft px-4 py-3 text-sm text-giro-accent-soft-foreground";

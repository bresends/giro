import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Hourglass,
  Siren,
  Timer,
} from "lucide-react";
import { Link } from "react-router-dom";
import { GiroButton } from "@/components/giro/giro-button";
import { computeShiftStats } from "./shiftStats";
import { shiftTitle } from "./shiftReport";
import { driverName, type Movement } from "./types";
import {
  destinationTypeLabel,
  formatDayMonth,
  formatDuration,
  formatKm,
  formatRg,
  formatShiftRange,
  formatTime,
  type ShiftWindow,
} from "@/lib/giro";
import { cn } from "@/lib/utils";

function typeChipClass(type?: string) {
  if (type === "ocorrencia") return "bg-giro-accent-soft text-giro-accent-soft-foreground";
  if (type === "qrf") return "bg-giro-warning-soft text-giro-warning-soft-foreground";
  return "bg-giro-neutral text-giro-neutral-foreground";
}

function Indicator({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: "accent" | "success" | "neutral";
}) {
  const color =
    tone === "accent" ? "text-giro-accent" : tone === "success" ? "text-giro-success" : "text-giro-fg";
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="flex items-center gap-1.5 text-xs text-giro-muted">
        <span className={cn("[&_svg]:size-3.5", tone === "neutral" ? "text-giro-muted" : color)}>{icon}</span>
        {label}
      </dt>
      <dd className={cn("text-[22px] font-bold tabular-nums", color)}>{value}</dd>
      <dd className="text-xs text-giro-muted">{sub}</dd>
    </div>
  );
}

function ReportTable({ movements }: { movements: Movement[] }) {
  const cols =
    "grid grid-cols-[64px_96px_84px_minmax(130px,1fr)_minmax(160px,1.4fr)_76px_86px_76px] items-center gap-3 px-3";
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <div role="table" aria-label="Saídas e chegadas do plantão" className="min-w-[860px]">
        <div role="row" className={cn(cols, "rounded-[10px] bg-giro-surface-2 py-2.5 text-xs font-semibold")}>
          <span role="columnheader" className="flex items-center gap-1 text-giro-accent">
            <ArrowUpRight className="size-[13px]" />
            Saída
          </span>
          <span role="columnheader" className="flex items-center gap-1 text-giro-success">
            <ArrowDownLeft className="size-[13px]" />
            Chegada
          </span>
          <span role="columnheader" className="text-giro-muted">Viatura</span>
          <span role="columnheader" className="text-giro-muted">Condutor</span>
          <span role="columnheader" className="text-giro-muted">Destino</span>
          <span role="columnheader" className="text-right text-giro-muted">KM saída</span>
          <span role="columnheader" className="text-right text-giro-muted">KM chegada</span>
          <span role="columnheader" className="text-right text-giro-muted">Distância</span>
        </div>
        {movements.map((m) => {
          const distance = m.arrivalKm !== undefined ? m.arrivalKm - m.departureKm : null;
          const type = destinationTypeLabel(m.destinationType);
          return (
            <div role="row" key={m._id} className={cn(cols, "py-3 shadow-[inset_0_-1px_0_var(--color-giro-separator)] last:shadow-none")}>
              <div role="cell" className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold tabular-nums">{formatTime(m.departureTime)}</span>
                <span className="text-xs text-giro-muted tabular-nums">{formatDayMonth(m.departureTime)}</span>
              </div>
              <div role="cell" className="flex flex-col gap-0.5">
                {m.arrivalTime !== undefined ? (
                  <>
                    <span className="text-sm font-semibold tabular-nums">{formatTime(m.arrivalTime)}</span>
                    <span className="text-xs text-giro-muted tabular-nums">{formatDayMonth(m.arrivalTime)}</span>
                  </>
                ) : (
                  <span className="inline-flex h-6 w-fit items-center rounded-full bg-giro-neutral px-2.5 text-xs font-semibold whitespace-nowrap text-giro-neutral-foreground">
                    Em trânsito
                  </span>
                )}
              </div>
              <div role="cell" className="text-sm font-semibold">{m.vehicle?.operationalPrefix ?? "—"}</div>
              <div role="cell" className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-sm font-medium">{driverName(m)}</span>
                <span className="text-xs text-giro-muted tabular-nums">{formatRg(m.personnel?.rg)}</span>
              </div>
              <div role="cell" className="flex min-w-0 flex-col items-start gap-[3px]">
                <span className="w-full text-sm break-words">{m.destination}</span>
                {type && (
                  <span className={cn("inline-flex h-5 items-center rounded-full px-2 text-[11px] font-semibold", typeChipClass(m.destinationType))}>
                    {type}
                  </span>
                )}
              </div>
              <div role="cell" className="text-right text-sm tabular-nums">{formatKm(m.departureKm)}</div>
              <div role="cell" className={cn("text-right text-sm tabular-nums", m.arrivalKm === undefined && "text-giro-muted")}>
                {formatKm(m.arrivalKm)}
              </div>
              <div role="cell" className={cn("text-right text-sm tabular-nums", distance === null && "text-giro-muted")}>
                {distance === null ? "—" : formatKm(distance, true)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface ShiftReportViewProps {
  shift: ShiftWindow;
  shifts: ShiftWindow[];
  selected: number;
  onSelectShift: (index: number) => void;
  /** Movimentações do plantão em ordem do documento; `undefined` enquanto carrega. */
  movements: Movement[] | undefined;
  generatedAt: number;
  copied: boolean;
  onCopy: () => void;
  /** Horário de referência para o título (padrão: agora). */
  now?: number;
}

/** Relatório do plantão (`design/hero.pen` → `Guarita · Relatório do plantão · 2 Página`). */
export function ShiftReportView({
  shift,
  shifts,
  selected,
  onSelectShift,
  movements,
  generatedAt,
  copied,
  onCopy,
  now,
}: ShiftReportViewProps) {
  const stats = movements ? computeShiftStats(movements) : null;

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-7 px-4 pt-6 pb-12 sm:px-6 lg:px-10 lg:pt-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3.5">
          <GiroButton asChild variant="secondary" size="sm" className="w-fit pr-3.5 pl-2.5 text-sm">
            <Link to="/guarita">
              <ArrowLeft />
              Voltar para a guarita
            </Link>
          </GiroButton>
          <div className="flex flex-col gap-1">
            <h1 className="text-[30px] font-semibold tracking-[-0.6px]">Relatório do plantão</h1>
            <p className="text-sm text-giro-muted">{shiftTitle(shift, now)}</p>
          </div>
        </div>
        <GiroButton
          variant="primary"
          size="lg"
          className="w-full text-sm md:w-auto"
          onClick={onCopy}
          disabled={!movements}
        >
          {copied ? <Check className="size-[18px]" /> : <Copy className="size-[18px]" />}
          {copied ? "Copiado" : "Copiar para o SEI"}
        </GiroButton>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-1 px-1">
            <span className="text-[13px] font-semibold text-giro-muted">Prévia do documento no SEI</span>
            <span className="text-xs text-giro-muted">Títulos e tabelas são mantidos ao colar</span>
          </div>

          <article className="flex flex-col gap-8 rounded-3xl bg-white p-5 sm:p-9">
            <section aria-labelledby="rel-resumo" className="flex flex-col gap-3">
              <h2 id="rel-resumo" className="text-base font-semibold">Resumo do plantão</h2>
              <dl className="grid grid-cols-2 gap-6 py-4 shadow-[inset_0_1px_0_var(--color-giro-separator),inset_0_-1px_0_var(--color-giro-separator)] sm:grid-cols-3 xl:grid-cols-5">
                <Indicator icon={<ArrowUpRight />} label="Saídas" value={stats ? String(stats.departures) : "—"} sub="no plantão" tone="accent" />
                <Indicator icon={<ArrowDownLeft />} label="Chegadas" value={stats ? String(stats.returned) : "—"} sub="viaturas retornaram" tone="success" />
                <Indicator icon={<Timer />} label="Em trânsito" value={stats ? String(stats.inTransit) : "—"} sub="ainda fora" tone="neutral" />
                <Indicator
                  icon={<Siren />}
                  label="Ocorrências"
                  value={stats ? String(stats.occurrences) : "—"}
                  sub={stats && stats.departures > 0 ? `${Math.round((stats.occurrences / stats.departures) * 100)}% das saídas` : "das saídas"}
                  tone="accent"
                />
                <Indicator
                  icon={<Hourglass />}
                  label="Tempo médio fora"
                  value={stats?.averageMs != null ? formatDuration(stats.averageMs) : "—"}
                  sub="por saída concluída"
                  tone="neutral"
                />
              </dl>
            </section>

            <section aria-labelledby="rel-movimentos" className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <h2 id="rel-movimentos" className="text-base font-semibold">Saídas e chegadas</h2>
                <span className="inline-flex h-[22px] items-center rounded-full bg-giro-default px-2 text-xs font-semibold tabular-nums">
                  {movements?.length ?? "…"}
                </span>
              </div>
              {movements === undefined ? (
                <p className="py-6 text-sm text-giro-muted">Carregando movimentações do plantão...</p>
              ) : movements.length === 0 ? (
                <p className="py-6 text-sm text-giro-muted">Nenhuma saída registrada neste plantão.</p>
              ) : (
                <ReportTable movements={movements} />
              )}
            </section>

            <p className="text-xs text-giro-muted">
              Gerado pelo GIRO em {new Date(generatedAt).toLocaleDateString("pt-BR")}, às{" "}
              {formatTime(generatedAt).replace(":", "h")}.
            </p>
          </article>
        </div>

        <aside className="flex w-full flex-col gap-5 lg:w-80 lg:shrink-0">
          <div className="flex flex-col gap-3.5 rounded-3xl bg-white p-5">
            <label htmlFor="plantao" className="text-[15px] font-semibold">
              Plantão
            </label>
            <div className="relative">
              <select
                id="plantao"
                value={selected}
                onChange={(e) => onSelectShift(Number(e.target.value))}
                className="h-11 w-full appearance-none rounded-xl bg-giro-surface-2 pr-10 pl-3.5 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-giro-accent/25"
              >
                {shifts.map((s, i) => (
                  <option key={s.startMs} value={i}>
                    {formatShiftRange(s)}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3.5 size-[18px] -translate-y-1/2 text-giro-muted" />
            </div>
            <p className="text-xs leading-[1.45] text-giro-muted">Escolha outro plantão para recopiar um relatório anterior.</p>
          </div>

          <div className="flex flex-col gap-3.5 rounded-3xl bg-white p-5">
            <h2 className="text-[15px] font-semibold">Como colar no SEI</h2>
            <ol className="flex flex-col gap-2.5 text-[13px]">
              {[
                "Clique em “Copiar para o SEI”.",
                "Abra o documento do plantão no SEI e clique em Editar.",
                "Cole com Ctrl+V. Títulos e tabelas vêm formatados.",
              ].map((step, i) => (
                <li key={step} className="flex gap-2.5">
                  <span className="w-4 shrink-0 font-semibold text-giro-muted">{i + 1}.</span>
                  <span className="leading-[1.45]">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}

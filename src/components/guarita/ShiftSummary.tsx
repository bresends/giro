import { IconRelatorio } from "@/components/giro/icons";
import { Link } from "react-router-dom";
import { GiroButton } from "@/components/giro/giro-button";
import { formatDuration, formatKm, SHIFT_START_HOUR, type ShiftWindow } from "@/lib/giro";
import { cn } from "@/lib/utils";
import { computeShiftStats } from "./shiftStats";
import type { Movement } from "./types";

function percent(part: number, total: number) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function Kpi({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-xs text-giro-muted">{label}</dt>
      <dd className="text-[26px] font-bold tracking-[-0.5px] tabular-nums">{value}</dd>
      <dd className="text-xs text-giro-muted">{sub}</dd>
    </div>
  );
}

const MAX_BARS = 12;

function HourlyChart({ movements, window, now }: { movements: Movement[]; window: ShiftWindow; now: number }) {
  const hoursElapsed = Math.min(24, Math.floor((Math.min(now, window.endMs) - window.startMs) / 3_600_000) + 1);
  const firstBar = Math.max(0, hoursElapsed - MAX_BARS);
  const buckets = Array.from({ length: hoursElapsed - firstBar }, (_, i) => {
    const offset = firstBar + i;
    const hour = (SHIFT_START_HOUR + offset) % 24;
    const from = window.startMs + offset * 3_600_000;
    const count = movements.filter(
      (m) => m.departureTime >= from && m.departureTime < from + 3_600_000,
    ).length;
    return { hour, count };
  });
  // Escala relativa: a hora mais movimentada ocupa os 72px, mesmo com poucas saídas
  const max = Math.max(1, ...buckets.map((b) => b.count));
  const peak = Math.max(...buckets.map((b) => b.count));
  const description = buckets
    .filter((b) => b.count > 0)
    .map((b) => `${b.hour}h: ${b.count}`)
    .join(", ");

  return (
    <figure className="flex w-full flex-col gap-2">
      <figcaption className="text-xs leading-[14.5px] text-giro-muted">Saídas por hora</figcaption>
      <div
        role="img"
        aria-label={description ? `Saídas por hora no plantão. ${description}.` : "Nenhuma saída no plantão."}
        className="flex h-[72px] items-end gap-1.5"
      >
        {buckets.map((b) => (
          <div
            key={b.hour}
            title={`${b.hour.toString().padStart(2, "0")}h · ${b.count} ${b.count === 1 ? "saída" : "saídas"}`}
            className={cn(
              "min-w-0 flex-1 rounded-md",
              b.count === 0 ? "bg-giro-default" : b.count === peak ? "bg-giro-accent" : "bg-giro-accent-tint",
            )}
            style={{ height: b.count === 0 ? 4 : Math.max(8, Math.round((b.count / max) * 72)) }}
          />
        ))}
      </div>
      <div aria-hidden="true" className="flex gap-1.5">
        {buckets.map((b) => (
          <span key={b.hour} className="min-w-0 flex-1 text-center text-[11px] leading-[13.5px] text-giro-muted tabular-nums">
            {b.hour.toString().padStart(2, "0")}h
          </span>
        ))}
      </div>
    </figure>
  );
}

export function ShiftSummary({
  movements,
  window,
  now,
  fleetSize,
  inGarage,
}: {
  movements: Movement[] | undefined;
  window: ShiftWindow;
  now: number;
  fleetSize: number | undefined;
  inGarage: number | undefined;
}) {
  const stats = movements ? computeShiftStats(movements) : null;

  return (
    <section aria-labelledby="resumo-titulo" className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between gap-2">
        <h2 id="resumo-titulo" className="text-[17px] font-semibold">
          Resumo do plantão
        </h2>
        <GiroButton asChild variant="secondary" size="sm">
          <Link to="/guarita/relatorio">
            <IconRelatorio />
            Relatório do plantão
          </Link>
        </GiroButton>
      </div>

      <div className="flex flex-col gap-6 rounded-3xl bg-white px-6 py-5 xl:flex-row xl:items-center xl:gap-10">
        <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-3 xl:grid-cols-5 xl:gap-10">
          <Kpi
            label="Saídas no plantão"
            value={stats ? String(stats.departures) : "—"}
            sub={stats ? `${stats.returned} ${stats.returned === 1 ? "retornou" : "retornaram"}` : "carregando"}
          />
          <Kpi
            label="Tempo médio fora"
            value={stats?.averageMs != null ? formatDuration(stats.averageMs) : "—"}
            sub="por saída"
          />
          <Kpi
            label="Ocorrências"
            value={stats ? String(stats.occurrences) : "—"}
            sub={stats ? `${percent(stats.occurrences, stats.departures)}% das saídas` : "carregando"}
          />
          <Kpi
            label="Viaturas no quartel"
            value={inGarage !== undefined ? String(inGarage) : "—"}
            sub={fleetSize !== undefined ? `de ${fleetSize} na frota` : "carregando"}
          />
          <Kpi
            label="Km rodados"
            value={stats ? formatKm(stats.kmDriven, true) : "—"}
            sub="no plantão"
          />
        </dl>
        {movements && (
          <div className="w-full xl:w-[300px] xl:shrink-0">
            <HourlyChart movements={movements} window={window} now={now} />
          </div>
        )}
      </div>
    </section>
  );
}

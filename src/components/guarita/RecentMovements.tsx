import {
  IconBusca,
  IconEditar,
  IconExcluir,
  IconFiltrar,
  IconHoje,
  IconSetaDireita,
} from "@/components/giro/icons";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { GiroButton } from "@/components/giro/giro-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DESTINATION_TYPE_LABELS,
  destinationTypeLabel,
  formatDayMonth,
  formatDuration,
  formatKm,
  formatRg,
  formatTime,
  transitState,
  type TransitState,
} from "@/lib/giro";
import { cn } from "@/lib/utils";
import { driverName, type Movement } from "./types";

const CHIP_STYLES: Record<TransitState, string> = {
  normal: "bg-giro-neutral text-giro-neutral-foreground",
  warning: "bg-giro-warning text-giro-warning-foreground",
  critical: "bg-giro-accent text-white",
};

function TransitChip({ state }: { state: TransitState }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold whitespace-nowrap",
        CHIP_STYLES[state],
      )}
    >
      Em trânsito
    </span>
  );
}

function RowActions({
  movement,
  onEdit,
  onDelete,
}: {
  movement: Movement;
  onEdit: (m: Movement) => void;
  onDelete: (m: Movement) => void;
}) {
  const prefix = movement.vehicle?.operationalPrefix ?? "";
  return (
    <div className="flex justify-end gap-1">
      <GiroButton
        variant="ghost"
        size="icon"
        className="bg-giro-surface-2 hover:bg-giro-default"
        onClick={() => onEdit(movement)}
        aria-label={`Editar saída ${prefix}`}
        title="Editar saída"
      >
        <IconEditar />
      </GiroButton>
      <GiroButton
        variant="ghost"
        size="icon"
        className="bg-giro-surface-2 text-giro-accent hover:bg-giro-accent-soft"
        onClick={() => onDelete(movement)}
        aria-label={`Excluir saída ${prefix}`}
        title="Excluir saída"
      >
        <IconExcluir />
      </GiroButton>
    </div>
  );
}

/** Colunas do design (1440px); entre lg e xl uma versão compacta para caber. */
const COLUMNS =
  "grid items-center gap-4 px-4 grid-cols-[72px_96px_minmax(140px,1fr)_minmax(0,1.4fr)_76px_80px_100px_72px_72px] xl:grid-cols-[120px_130px_210px_minmax(0,1fr)_100px_100px_120px_96px_76px]";

/** Últimas saídas (`listRecent`): mostra as 25 mais recentes de uma vez; "Hoje" filtra o dia. */
const VISIBLE = 25;

function startOfToday(now: number) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function RecentMovements({
  movements,
  now,
  onEdit,
  onDelete,
}: {
  movements: Movement[];
  now: number;
  onEdit: (m: Movement) => void;
  onDelete: (m: Movement) => void;
}) {
  const [search, setSearch] = useState("");
  const [destinationType, setDestinationType] = useState("todos");
  const [todayOnly, setTodayOnly] = useState(false);
  
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    const todayStart = startOfToday(now);
    return movements.filter((m) => {
      if (todayOnly && m.departureTime < todayStart) return false;
      if (destinationType !== "todos" && m.destinationType !== destinationType) return false;
      if (!term) return true;
      const haystack = [
        m.vehicle?.operationalPrefix,
        m.vehicle?.plate,
        m.personnel?.rank,
        m.personnel?.name,
        m.personnel?.rg?.toString(),
        m.destination,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("pt-BR");
      return haystack.includes(term);
    });
  }, [movements, search, destinationType, todayOnly, now]);

  const shown = filtered.slice(0, VISIBLE);
  const hasFilters = search.trim() !== "" || destinationType !== "todos" || todayOnly;

  return (
    <section aria-labelledby="ultimas-saidas-titulo" className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <h2 id="ultimas-saidas-titulo" className="text-[17px] font-semibold">
            Últimas saídas
          </h2>
          <span className="inline-flex h-[22px] items-center rounded-full bg-giro-default px-2 text-xs font-semibold tabular-nums">
            {movements.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl bg-white px-3.5 focus-within:ring-[3px] focus-within:ring-giro-accent/25 lg:w-[300px] lg:flex-none">
            <IconBusca className="size-4 shrink-0 text-giro-muted" />
            <span className="sr-only">Buscar nas últimas saídas</span>
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Buscar por viatura, motorista ou RG"
              className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-giro-muted"
            />
          </label>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <GiroButton
                variant={destinationType === "todos" ? "secondary" : "primary"}
                className="px-3.5"
                aria-label="Filtrar por tipo de destino"
              >
                <IconFiltrar />
                {destinationType === "todos" ? "Filtrar" : destinationTypeLabel(destinationType)}
              </GiroButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48 rounded-xl font-giro">
              <DropdownMenuLabel>Tipo de destino</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={destinationType}
                onValueChange={(v) => {
                  setDestinationType(v);
                }}
              >
                <DropdownMenuRadioItem value="todos">Todos</DropdownMenuRadioItem>
                {Object.entries(DESTINATION_TYPE_LABELS).map(([value, label]) => (
                  <DropdownMenuRadioItem key={value} value={value}>
                    {label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <GiroButton
            variant={todayOnly ? "primary" : "secondary"}
            className="px-3.5"
            aria-pressed={todayOnly}
            onClick={() => {
              setTodayOnly((v) => !v);
            }}
          >
            <IconHoje />
            Hoje
          </GiroButton>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[20px] bg-white px-5 py-10 text-center">
          <p className="text-[15px] font-semibold">
            {hasFilters ? "Nenhuma saída encontrada" : "Nenhuma movimentação registrada"}
          </p>
          <p className="mt-1 text-[13px] text-giro-muted">
            {hasFilters ? "Ajuste a busca ou os filtros." : "As saídas registradas aparecem aqui."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop: tabela */}
          <div role="table" aria-label="Últimas saídas" className="hidden rounded-[20px] bg-giro-surface-2 p-1 lg:block">
            <div role="rowgroup">
              <div role="row" className={cn(COLUMNS, "h-9 text-xs font-medium text-giro-muted")}>
                <span role="columnheader">Saída</span>
                <span role="columnheader">Viatura</span>
                <span role="columnheader">Motorista</span>
                <span role="columnheader">Destino</span>
                <span role="columnheader" className="text-right">KM saída</span>
                <span role="columnheader" className="text-right">KM chegada</span>
                <span role="columnheader" className="text-right">Tempo fora</span>
                <span role="columnheader" className="text-right">Distância</span>
                <span role="columnheader" className="sr-only">Ações</span>
              </div>
            </div>
            <div role="rowgroup" className="overflow-hidden rounded-2xl bg-white">
              {shown.map((m) => {
                const inTransit = m.status === "em_transito";
                const distance = m.arrivalKm !== undefined ? m.arrivalKm - m.departureKm : null;
                return (
                  <div
                    role="row"
                    key={m._id}
                    className={cn(COLUMNS, "py-3 shadow-[inset_0_-1px_0_var(--color-giro-separator)] last:shadow-none")}
                  >
                    <div role="cell" className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium tabular-nums">{formatTime(m.departureTime)}</span>
                      <span className="text-xs text-giro-muted tabular-nums">{formatDayMonth(m.departureTime)}</span>
                    </div>
                    <div role="cell" className="truncate text-sm font-semibold">
                      {m.vehicle?.operationalPrefix ?? "—"}
                    </div>
                    <div role="cell" className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-sm font-medium">{driverName(m)}</span>
                      <span className="text-xs text-giro-muted tabular-nums">{formatRg(m.personnel?.rg)}</span>
                    </div>
                    <div role="cell" className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-sm" title={m.destination}>{m.destination}</span>
                      <span className="text-xs text-giro-muted">{destinationTypeLabel(m.destinationType)}</span>
                    </div>
                    <div role="cell" className="text-right text-sm tabular-nums">{formatKm(m.departureKm)}</div>
                    <div role="cell" className={cn("text-right text-sm tabular-nums", m.arrivalKm === undefined && "text-giro-muted")}>
                      {formatKm(m.arrivalKm)}
                    </div>
                    <div role="cell" className="flex justify-end text-sm tabular-nums">
                      {inTransit ? (
                        <TransitChip state={transitState(now - m.departureTime)} />
                      ) : m.arrivalTime !== undefined ? (
                        formatDuration(m.arrivalTime - m.departureTime)
                      ) : (
                        <span className="text-giro-muted">—</span>
                      )}
                    </div>
                    <div role="cell" className={cn("text-right text-sm tabular-nums", distance === null ? "text-giro-muted" : "font-medium")}>
                      {distance === null ? "—" : formatKm(distance, true)}
                    </div>
                    <div role="cell">
                      <RowActions movement={m} onEdit={onEdit} onDelete={onDelete} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile e tablet: cartões */}
          <ul className="flex flex-col gap-2 lg:hidden">
            {shown.map((m) => {
              const inTransit = m.status === "em_transito";
              const distance = m.arrivalKm !== undefined ? m.arrivalKm - m.departureKm : null;
              return (
                <li key={m._id} className="flex flex-col gap-3 rounded-2xl bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-[15px] font-semibold">{m.vehicle?.operationalPrefix ?? "—"}</span>
                      <span className="truncate text-[13px]">{driverName(m)}</span>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-0.5">
                      <span className="text-sm font-medium tabular-nums">{formatTime(m.departureTime)}</span>
                      <span className="text-xs text-giro-muted tabular-nums">{formatDayMonth(m.departureTime)}</span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm">{m.destination}</p>
                    <p className="text-xs text-giro-muted">{destinationTypeLabel(m.destinationType)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-giro-separator pt-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-giro-muted tabular-nums">
                      <span>
                        KM {formatKm(m.departureKm)} → {formatKm(m.arrivalKm)}
                      </span>
                      {inTransit ? (
                        <TransitChip state={transitState(now - m.departureTime)} />
                      ) : (
                        <span className="text-giro-fg">
                          {m.arrivalTime !== undefined ? formatDuration(m.arrivalTime - m.departureTime) : "—"}
                          {distance !== null && ` · ${formatKm(distance, true)}`}
                        </span>
                      )}
                    </div>
                    <RowActions movement={m} onEdit={onEdit} onDelete={onDelete} />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-[13px] text-giro-muted" aria-live="polite">
          Mostrando {shown.length} de {filtered.length} {filtered.length === 1 ? "saída" : "saídas"}
          {hasFilters ? " encontradas" : " mais recentes"}
        </p>
        <GiroButton asChild variant="link" size="sm" className="gap-1.5">
          <Link to="/movements">
            Ver todas as movimentações
            <IconSetaDireita />
          </Link>
        </GiroButton>
      </div>
    </section>
  );
}

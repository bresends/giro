import { House } from "@gravity-ui/icons";
import { IconRegistrarChegada } from "@/components/giro/icons";
import { GiroButton } from "@/components/giro/giro-button";
import { VehicleIllustration } from "@/components/giro/VehicleIllustration";
import {
  destinationTypeLabel,
  formatDayMonth,
  formatDuration,
  formatTime,
  transitState,
  type TransitState,
} from "@/lib/giro";
import { cn } from "@/lib/utils";
import { driverName, type Movement } from "./types";

const TILE_STYLES: Record<
  TransitState,
  { tile: string; plate: string; prefix: string; sub: string; button: "onState" | "primary" }
> = {
  critical: {
    tile: "bg-giro-accent text-white",
    plate: "bg-white/15 ring-white/25",
    prefix: "text-white",
    sub: "text-white/80",
    button: "onState",
  },
  warning: {
    tile: "bg-giro-warning text-giro-warning-foreground",
    plate: "bg-white ring-giro-separator",
    prefix: "text-giro-warning-foreground",
    sub: "text-giro-warning-foreground",
    button: "primary",
  },
  normal: {
    tile: "bg-giro-neutral text-giro-neutral-foreground",
    plate: "bg-white ring-giro-separator",
    prefix: "text-giro-neutral-foreground",
    sub: "text-giro-neutral-muted",
    button: "onState",
  },
};

function stateNote(state: TransitState, departureTime: number) {
  if (state === "critical") return `Provável esquecimento · saiu ${formatDayMonth(departureTime)}`;
  if (state === "warning") return `Acima de 2h · saiu ${formatTime(departureTime)}`;
  return `saiu ${formatTime(departureTime)}`;
}

export function InTransitBoard({
  movements,
  now,
  onArrival,
}: {
  movements: Movement[];
  now: number;
  onArrival: (movement: Movement) => void;
}) {
  const sorted = [...movements].sort((a, b) => a.departureTime - b.departureTime);

  return (
    <section aria-labelledby="em-transito-titulo" className="flex flex-col gap-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <h2 id="em-transito-titulo" className="text-[17px] font-semibold">
            Em trânsito agora
          </h2>
          <span className="inline-flex h-[22px] items-center rounded-full bg-giro-default px-2 text-xs font-semibold tabular-nums">
            {movements.length}
          </span>
        </div>
        {movements.length > 1 && (
          <p className="text-[13px] text-giro-muted">Ordenado pelo maior tempo fora</p>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="flex items-center gap-4 rounded-[20px] bg-white px-5 py-6">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-giro-success-soft text-giro-success-soft-foreground">
            <House className="size-5" />
          </span>
          <div>
            <p className="text-[15px] font-semibold">Todas as viaturas estão no quartel</p>
            <p className="text-[13px] text-giro-muted">Nenhuma viatura em trânsito no momento.</p>
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sorted.map((movement) => {
            const elapsed = now - movement.departureTime;
            const state = transitState(elapsed);
            const s = TILE_STYLES[state];
            const typeLine = [
              movement.vehicle?.typeDescription || movement.vehicle?.type,
              destinationTypeLabel(movement.destinationType),
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <li
                key={movement._id}
                className={cn(
                  "flex h-[252px] flex-col gap-3.5 rounded-[20px] p-4 transition-colors duration-200 ease-out motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-2 motion-safe:duration-200",
                  s.tile,
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-lg px-2 py-1 text-[13px] font-bold tracking-[0.5px] whitespace-nowrap ring-1 ring-inset",
                      s.plate,
                      s.prefix,
                    )}
                  >
                    {movement.vehicle?.operationalPrefix ?? "—"}
                  </span>
                  <span className={cn("min-w-0 truncate text-right text-xs", s.sub)} title={typeLine}>
                    {typeLine}
                  </span>
                </div>

                <div className="flex items-end justify-between gap-2">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[34px] font-bold tracking-[-0.8px] tabular-nums">
                      {formatDuration(elapsed)}
                    </span>
                    <span className={cn("w-[172px] text-xs", s.sub)}>
                      {stateNote(state, movement.departureTime)}
                    </span>
                  </div>
                  <VehicleIllustration type={movement.vehicle?.type} />
                </div>

                <div className="flex min-w-0 flex-col gap-[3px]">
                  <span className="truncate text-[13px] font-semibold">{driverName(movement)}</span>
                  <span className={cn("truncate text-xs", s.sub)}>{movement.destination}</span>
                </div>

                {/* Espaçador como no design: os gaps de 14px continuam valendo dos dois lados */}
                <div aria-hidden="true" className="min-h-0 flex-1" />

                <GiroButton
                  variant={s.button}
                  size="sm"
                  className="h-[38px] w-full shrink-0 gap-1.5"
                  onClick={() => onArrival(movement)}
                >
                  <IconRegistrarChegada />
                  Registrar chegada
                  <span className="sr-only"> de {movement.vehicle?.operationalPrefix}</span>
                </GiroButton>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

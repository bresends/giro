import { IconCadastrarMilitar, IconRegistrarSaida } from "@/components/giro/icons";
import { GiroButton } from "@/components/giro/giro-button";
import { formatLongDate, SHIFT_START_HOUR } from "@/lib/giro";

function shiftMeta(now: number) {
  const startedYesterday = new Date(now).getHours() < SHIFT_START_HOUR;
  return startedYesterday
    ? "Plantão iniciado ontem às 07:00, encerra hoje às 07:00"
    : "Plantão iniciado às 07:00, encerra amanhã às 07:00";
}

/** Cabeçalho da guarita (`design/hero.pen` → Content → Page Header). */
export function GuaritaHeader({
  now,
  onAddPersonnel,
  onDeparture,
}: {
  now: number;
  onAddPersonnel: () => void;
  onDeparture: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[30px] font-semibold tracking-[-0.6px]">Guarita</h1>
        <p className="text-sm text-giro-muted">
          {formatLongDate(now)} · {shiftMeta(now)}
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        <GiroButton variant="secondary" className="flex-1 md:flex-none" onClick={onAddPersonnel}>
          <IconCadastrarMilitar />
          Cadastrar militar
        </GiroButton>
        <GiroButton variant="primary" size="lg" className="flex-1 md:flex-none" onClick={onDeparture}>
          <IconRegistrarSaida />
          Registrar saída
        </GiroButton>
      </div>
    </div>
  );
}

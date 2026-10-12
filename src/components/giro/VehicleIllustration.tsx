import { cn } from "@/lib/utils";

/**
 * Ilustrações isométricas flat das viaturas, exportadas de `design/hero.pen`
 * (componentes `Viatura * · CBMGO · L` e frame `VTR · XL · Variações`).
 * O mapa usa o nome do tipo de viatura (`vehicleTypes.name`).
 */
const ILLUSTRATION_BY_TYPE: Record<string, string> = {
  UR: "ur", // Unidade de Resgate
  ABT: "abt", // Auto Bomba Tanque
  ABTS: "abt", // Auto Bomba Tanque e Salvamento
  ASA: "s10", // Auto Salvamento Aquático: S10 cabine dupla
  AV: "av", // Auto Vistoria: sedã de passeio
};

/** Tipos sem desenho próprio usam a viatura leve. */
const FALLBACK = "vtr";

function illustrationFor(type?: string | null) {
  const key = (type ?? "").trim().toUpperCase();
  return ILLUSTRATION_BY_TYPE[key] ?? FALLBACK;
}

/**
 * Como no design: o quadro reserva espaço no layout, mas a ilustração "L" (144×108)
 * é desenhada maior e transborda o quadro, deslocada para cima e para a esquerda.
 * - `card`: quadro 96×72, ilustração em (−29, −11): cards da guarita e do checklist
 * - `hero`: quadro 120×90, ilustração em (−12, −9): tela de checklist enviado
 */
const PLACEMENT = {
  card: { box: "h-[72px] w-24", img: "-top-[11px] -left-[29px]" },
  hero: { box: "h-[90px] w-[120px]", img: "-top-[9px] -left-3" },
} as const;

export function VehicleIllustration({
  type,
  placement = "card",
  className,
}: {
  type?: string | null;
  placement?: keyof typeof PLACEMENT;
  className?: string;
}) {
  const p = PLACEMENT[placement];
  return (
    <span aria-hidden="true" className={cn("relative block shrink-0", p.box, className)}>
      <img
        src={`/viaturas/${illustrationFor(type)}.png`}
        alt=""
        draggable={false}
        className={cn("pointer-events-none absolute h-[108px] w-36 max-w-none select-none", p.img)}
      />
    </span>
  );
}

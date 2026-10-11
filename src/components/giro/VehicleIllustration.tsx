import { cn } from "@/lib/utils";

/**
 * Ilustrações isométricas flat das viaturas, exportadas de `test.pen`
 * (componentes `Viatura * · CBMGO` e frame `VTR · XL · Variações`).
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

export function VehicleIllustration({
  type,
  className,
}: {
  type?: string | null;
  className?: string;
}) {
  return (
    <img
      src={`/viaturas/${illustrationFor(type)}.png`}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={cn("pointer-events-none select-none object-contain", className)}
    />
  );
}

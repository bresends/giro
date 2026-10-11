import { cn } from "@/lib/utils";

/**
 * Símbolo 2C·7 ("G com base"): o G é a rota pela cidade e o ponto é a base,
 * aceso em amarelo Vivo. Geometria copiada de `design/logo.pen`.
 */
export function GiroSymbol({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M71.85 23.95a34 34 0 1 0 6.98 44.07"
        fill="none"
        stroke="#ffffff"
        strokeWidth={20}
        strokeLinecap="round"
      />
      <path
        d="M74.58 44.68a9 9 0 1 0 18 0 9 9 0 1 0-18 0"
        fill="var(--color-giro-warning)"
      />
    </svg>
  );
}

/** Bloco vermelho com o símbolo, usado como ícone do aplicativo. */
export function GiroMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-giro-brand",
        className,
      )}
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size / 4),
      }}
    >
      <GiroSymbol className="size-[69%]" />
    </span>
  );
}

/** Assinatura: bloco + "GIRO" em Inter 800. */
export function GiroBrand({
  size = "md",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const sm = size === "sm";
  return (
    <span className={cn("inline-flex items-center", sm ? "gap-2.5" : "gap-3", className)}>
      <GiroMark size={sm ? 28 : 32} />
      <span
        className={cn(
          "font-giro font-extrabold tracking-[-0.5px] text-giro-fg",
          sm ? "text-lg" : "text-xl",
        )}
      >
        GIRO
      </span>
    </span>
  );
}

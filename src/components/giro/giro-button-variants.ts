import { cva } from "class-variance-authority";

/**
 * Botão da direção "Placar": pílula, sem sombra, hierarquia só por cor e peso.
 * Usado na guarita e no checklist; o admin continua com `ui/button` (Velocity).
 */
export const giroButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-giro font-medium transition-colors duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-giro-accent/35 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-giro-accent font-semibold text-white hover:bg-giro-accent-hover",
        secondary:
          "bg-giro-default text-giro-fg hover:bg-giro-default-hover",
        ghost: "text-giro-fg hover:bg-giro-default",
        /** Sobre fundos de estado (cinza neutro ou vermelho): fundo branco, texto vermelho. */
        onState:
          "bg-white font-semibold text-giro-accent hover:bg-giro-accent-soft",
        link: "font-semibold text-giro-accent-soft-foreground hover:bg-giro-accent-soft",
        danger:
          "bg-giro-accent font-semibold text-white hover:bg-giro-accent-hover",
      },
      size: {
        sm: "h-9 px-3.5 text-[13px]",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-[15px]",
        xl: "h-13 px-6 text-base [&_svg:not([class*='size-'])]:size-[18px]",
        icon: "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
);

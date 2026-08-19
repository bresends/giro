import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "corner-cut relative isolate inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-condensed text-xs font-bold uppercase transition-colors outline-none [--corner-cut:7px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/40",
        outline:
          "bg-primary text-primary before:absolute before:inset-px before:-z-10 before:bg-card before:[clip-path:inherit] hover:before:bg-accent active:before:bg-accent/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/80",
        ghost:
          "text-primary hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 has-[>svg]:px-4",
        xs: "h-6 gap-1 px-2 text-[8px] [--corner-cut:4px] has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 text-[9px] [--corner-cut:5px] has-[>svg]:px-2.5",
        lg: "h-12 px-6 text-sm [--corner-cut:9px] has-[>svg]:px-4",
        xl: "h-14 px-7 text-sm [--corner-cut:10px] has-[>svg]:px-5",
        icon: "size-9",
        "icon-xs":
          "size-6 [--corner-cut:4px] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 [--corner-cut:5px]",
        "icon-lg": "size-12 [--corner-cut:9px]",
        "icon-xl":
          "size-14 [--corner-cut:10px] [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

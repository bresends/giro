import { Badge } from "@/components/ui/badge";

interface IssueSeverityBadgeProps {
  severity: "low" | "medium" | "high" | "critical";
}

export function IssueSeverityBadge({ severity }: IssueSeverityBadgeProps) {
  const variants = {
    low: { label: "Baixa", className: "bg-giro-neutral text-giro-neutral-foreground" },
    medium: { label: "Média", className: "bg-giro-warning-soft text-giro-warning-soft-foreground" },
    high: { label: "Alta", className: "bg-giro-warning text-giro-warning-foreground" },
    critical: { label: "Crítica", className: "bg-giro-accent-soft text-giro-accent-soft-foreground" },
  };

  const variant = variants[severity];

  return (
    <Badge variant="secondary" className={variant.className}>
      {variant.label}
    </Badge>
  );
}

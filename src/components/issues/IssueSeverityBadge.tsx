import { Badge } from "@/components/ui/badge";

interface IssueSeverityBadgeProps {
  severity: "low" | "medium" | "high" | "critical";
}

export function IssueSeverityBadge({ severity }: IssueSeverityBadgeProps) {
  const variants = {
    low: { label: "Baixa", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    medium: { label: "Média", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
    high: { label: "Alta", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
    critical: { label: "Crítica", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  };

  const variant = variants[severity];

  return (
    <Badge variant="secondary" className={variant.className}>
      {variant.label}
    </Badge>
  );
}

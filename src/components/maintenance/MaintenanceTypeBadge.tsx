import { Badge } from "@/components/ui/badge";

interface MaintenanceTypeBadgeProps {
  type: "preventive" | "corrective";
}

export function MaintenanceTypeBadge({ type }: MaintenanceTypeBadgeProps) {
  const typeConfig = {
    preventive: {
      label: "Preventiva",
      className: "bg-giro-neutral text-giro-neutral-foreground",
    },
    corrective: {
      label: "Corretiva",
      className: "bg-giro-warning text-giro-warning-foreground",
    },
  };

  const config = typeConfig[type];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

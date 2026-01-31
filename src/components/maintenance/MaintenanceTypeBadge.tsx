import { Badge } from "@/components/ui/badge";

interface MaintenanceTypeBadgeProps {
  type: "preventive" | "corrective";
}

export function MaintenanceTypeBadge({ type }: MaintenanceTypeBadgeProps) {
  const typeConfig = {
    preventive: {
      label: "Preventiva",
      className: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    },
    corrective: {
      label: "Corretiva",
      className: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
    },
  };

  const config = typeConfig[type];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

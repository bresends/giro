import { Badge } from "@/components/ui/badge";

interface VehicleServiceBadgeProps {
  serviceType: "operational" | "backup";
}

export function VehicleServiceBadge({ serviceType }: VehicleServiceBadgeProps) {
  const config = {
    operational: {
      label: "Operacional",
      className: "bg-giro-neutral text-giro-neutral-foreground",
    },
    backup: {
      label: "Backup",
      className: "bg-giro-neutral text-giro-neutral-foreground",
    },
  };

  const { label, className } = config[serviceType];

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}

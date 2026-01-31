import { Badge } from "@/components/ui/badge";

interface VehicleServiceBadgeProps {
  serviceType: "operational" | "backup";
}

export function VehicleServiceBadge({ serviceType }: VehicleServiceBadgeProps) {
  const config = {
    operational: {
      label: "Operacional",
      className: "bg-blue-500/10 text-blue-600 border-blue-200",
    },
    backup: {
      label: "Backup",
      className: "bg-gray-500/10 text-gray-600 border-gray-200",
    },
  };

  const { label, className } = config[serviceType];

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}

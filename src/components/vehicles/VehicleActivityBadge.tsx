import { Badge } from "@/components/ui/badge";

interface VehicleActivityBadgeProps {
  inMaintenance: boolean;
}

export function VehicleActivityBadge({ inMaintenance }: VehicleActivityBadgeProps) {
  if (inMaintenance) {
    return (
      <Badge variant="destructive" className="bg-giro-warning text-giro-warning-foreground">
        Em Manutenção
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="bg-giro-success-soft text-giro-success-soft-foreground">
      Ativa
    </Badge>
  );
}

import { Badge } from "@/components/ui/badge";

interface VehicleActivityBadgeProps {
  inMaintenance: boolean;
}

export function VehicleActivityBadge({ inMaintenance }: VehicleActivityBadgeProps) {
  if (inMaintenance) {
    return (
      <Badge variant="destructive" className="bg-orange-500/10 text-orange-600 border-orange-200">
        Em Manutenção
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-200">
      Ativa
    </Badge>
  );
}

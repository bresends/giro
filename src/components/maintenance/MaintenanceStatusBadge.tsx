import { Badge } from "@/components/ui/badge";

interface MaintenanceStatusBadgeProps {
  status: "awaiting_ceman" | "in_progress" | "completed" | "cancelled";
}

export function MaintenanceStatusBadge({ status }: MaintenanceStatusBadgeProps) {
  const statusConfig = {
    awaiting_ceman: {
      label: "Aguardando CEMAN",
      variant: "secondary" as const,
    },
    in_progress: {
      label: "Em Andamento",
      variant: "default" as const,
    },
    completed: {
      label: "Concluída",
      variant: "outline" as const,
    },
    cancelled: {
      label: "Cancelada",
      variant: "destructive" as const,
    },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

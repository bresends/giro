import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Id } from "../../../convex/_generated/dataModel";
import { AlertTriangle, Clock, Wrench } from "lucide-react";

interface AlertCardProps {
  alert: {
    vehicleId: Id<"vehicles">;
    vehiclePrefix: string;
    vehiclePlate: string;
    type: "maintenance_overdue" | "maintenance_soon" | "in_maintenance_too_long";
    severity: "critical" | "high" | "medium" | "low";
    message: string;
    details: string;
    currentKm?: number;
    nextMaintenanceKm?: number;
    daysInMaintenance?: number;
  };
}

export function AlertCard({ alert }: AlertCardProps) {
  const navigate = useNavigate();

  const severityConfig = {
    critical: {
      color: "border-red-500 bg-red-50 dark:bg-red-950/20",
      badge: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200",
      icon: AlertTriangle,
      iconColor: "text-red-500",
      label: "Crítico",
    },
    high: {
      color: "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
      badge: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200",
      icon: AlertTriangle,
      iconColor: "text-orange-500",
      label: "Alto",
    },
    medium: {
      color: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
      badge: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200",
      icon: Clock,
      iconColor: "text-yellow-500",
      label: "Médio",
    },
    low: {
      color: "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
      badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200",
      icon: Clock,
      iconColor: "text-blue-500",
      label: "Baixo",
    },
  };

  const typeConfig = {
    maintenance_overdue: {
      icon: Wrench,
      iconBg: "bg-red-100 dark:bg-red-900/20",
    },
    maintenance_soon: {
      icon: Clock,
      iconBg: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    in_maintenance_too_long: {
      icon: Wrench,
      iconBg: "bg-orange-100 dark:bg-orange-900/20",
    },
  };

  const config = severityConfig[alert.severity];
  const typeInfo = typeConfig[alert.type];
  const Icon = config.icon;
  const TypeIcon = typeInfo.icon;

  return (
    <Card
      className={`border-l-4 ${config.color} cursor-pointer hover:shadow-md transition`}
      onClick={() => navigate(`/vehicles/${alert.vehicleId}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${typeInfo.iconBg}`}>
              <TypeIcon className={`w-4 h-4 ${config.iconColor}`} />
            </div>
            <div>
              <h4 className="font-semibold text-sm">{alert.vehiclePrefix}</h4>
              <p className="text-xs text-muted-foreground">{alert.vehiclePlate}</p>
            </div>
          </div>
          <Badge variant="outline" className={config.badge}>
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        </div>

        <div className="mt-3">
          <p className="text-sm font-medium">{alert.message}</p>
          <p className="text-xs text-muted-foreground mt-1">{alert.details}</p>
        </div>

        {alert.currentKm !== undefined && alert.nextMaintenanceKm !== undefined && (
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>KM atual:</span>
              <span className="font-mono">
                {new Intl.NumberFormat("pt-BR").format(alert.currentKm)} km
              </span>
            </div>
            <div className="flex justify-between">
              <span>Próxima revisão:</span>
              <span className="font-mono">
                {new Intl.NumberFormat("pt-BR").format(alert.nextMaintenanceKm)} km
              </span>
            </div>
          </div>
        )}

        {alert.daysInMaintenance !== undefined && (
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Dias em manutenção:</span>
              <span className="font-semibold">{alert.daysInMaintenance} dias</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

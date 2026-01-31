import { AlertCard } from "./AlertCard";
import { Id } from "../../../convex/_generated/dataModel";
import { CheckCircle } from "lucide-react";

interface AlertsSectionProps {
  alerts: Array<{
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
  }>;
}

export function AlertsSection({ alerts }: AlertsSectionProps) {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-12 bg-green-50 dark:bg-green-950/10 rounded-lg border border-green-200 dark:border-green-800">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">
          Nenhum alerta ativo
        </h3>
        <p className="text-green-700 dark:text-green-300">
          Todas as viaturas estão em dia com as manutenções
        </p>
      </div>
    );
  }

  // Group alerts by severity
  const critical = alerts.filter((a) => a.severity === "critical");
  const high = alerts.filter((a) => a.severity === "high");
  const medium = alerts.filter((a) => a.severity === "medium");
  const low = alerts.filter((a) => a.severity === "low");

  return (
    <div className="space-y-6">
      {critical.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">
            Críticos ({critical.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {critical.map((alert, idx) => (
              <AlertCard key={idx} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {high.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-3">
            Alta Prioridade ({high.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {high.map((alert, idx) => (
              <AlertCard key={idx} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {medium.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-3">
            Média Prioridade ({medium.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medium.map((alert, idx) => (
              <AlertCard key={idx} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {low.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">
            Baixa Prioridade ({low.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {low.map((alert, idx) => (
              <AlertCard key={idx} alert={alert} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

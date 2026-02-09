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

const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 700,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  marginBottom: 12,
};

export function AlertsSection({ alerts }: AlertsSectionProps) {
  if (alerts.length === 0) {
    return (
      <div
        className="text-center py-12"
        style={{
          background: "rgba(22,163,74,0.04)",
          borderLeft: "3px solid #16a34a",
        }}
      >
        <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "#16a34a" }} />
        <h3
          className="text-sm mb-1"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#16a34a",
          }}
        >
          Nenhum alerta ativo
        </h3>
        <p className="text-xs text-[#999]" style={{ fontFamily: "'Barlow', sans-serif" }}>
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
          <h3 style={{ ...sectionLabel, color: "#dc2626" }}>
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
          <h3 style={{ ...sectionLabel, color: "#ea580c" }}>
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
          <h3 style={{ ...sectionLabel, color: "#ca8a04" }}>
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
          <h3 style={{ ...sectionLabel, color: "#2563eb" }}>
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

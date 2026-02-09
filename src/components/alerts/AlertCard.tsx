import { useNavigate } from "react-router-dom";
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

const velBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "2px 10px",
  fontSize: 10,
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  clipPath:
    "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
};

export function AlertCard({ alert }: AlertCardProps) {
  const navigate = useNavigate();

  const severityConfig = {
    critical: {
      borderColor: "#dc2626",
      bg: "rgba(220,38,38,0.04)",
      badgeBg: "rgba(220,38,38,0.08)",
      color: "#dc2626",
      icon: AlertTriangle,
      label: "Crítico",
    },
    high: {
      borderColor: "#ea580c",
      bg: "rgba(249,115,22,0.04)",
      badgeBg: "rgba(249,115,22,0.08)",
      color: "#ea580c",
      icon: AlertTriangle,
      label: "Alto",
    },
    medium: {
      borderColor: "#ca8a04",
      bg: "rgba(234,179,8,0.04)",
      badgeBg: "rgba(234,179,8,0.08)",
      color: "#ca8a04",
      icon: Clock,
      label: "Médio",
    },
    low: {
      borderColor: "#2563eb",
      bg: "rgba(37,99,235,0.04)",
      badgeBg: "rgba(37,99,235,0.08)",
      color: "#2563eb",
      icon: Clock,
      label: "Baixo",
    },
  };

  const typeConfig = {
    maintenance_overdue: { icon: Wrench },
    maintenance_soon: { icon: Clock },
    in_maintenance_too_long: { icon: Wrench },
  };

  const config = severityConfig[alert.severity];
  const typeInfo = typeConfig[alert.type];
  const Icon = config.icon;
  const TypeIcon = typeInfo.icon;

  return (
    <div
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => navigate(`/vehicles/${alert.vehicleId}`)}
      style={{
        background: config.bg,
        borderLeft: `3px solid ${config.borderColor}`,
        border: "1px solid rgba(0,0,0,0.06)",
        borderLeftWidth: 3,
        borderLeftColor: config.borderColor,
        padding: 16,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              background: config.badgeBg,
              borderRadius: "50%",
            }}
          >
            <TypeIcon size={14} style={{ color: config.color }} />
          </div>
          <div>
            <h4
              className="font-semibold text-sm text-[#1a1a1a]"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              {alert.vehiclePrefix}
            </h4>
            <p className="text-[10px] text-[#999]">{alert.vehiclePlate}</p>
          </div>
        </div>
        <span style={{ ...velBadge, background: config.badgeBg, color: config.color }}>
          <Icon size={10} />
          {config.label}
        </span>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium text-[#1a1a1a]" style={{ fontFamily: "'Barlow', sans-serif" }}>
          {alert.message}
        </p>
        <p className="text-xs text-[#999] mt-1">{alert.details}</p>
      </div>

      {alert.currentKm !== undefined && alert.nextMaintenanceKm !== undefined && (
        <div
          className="mt-3 pt-3 text-xs text-[#999]"
          style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div className="flex justify-between">
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 10 }}>
              KM atual
            </span>
            <span className="font-mono" style={{ color: "#2563eb" }}>
              {new Intl.NumberFormat("pt-BR").format(alert.currentKm)} km
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 10 }}>
              Próxima revisão
            </span>
            <span className="font-mono" style={{ color: "#2563eb" }}>
              {new Intl.NumberFormat("pt-BR").format(alert.nextMaintenanceKm)} km
            </span>
          </div>
        </div>
      )}

      {alert.daysInMaintenance !== undefined && (
        <div
          className="mt-3 pt-3 text-xs text-[#999]"
          style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div className="flex justify-between">
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 10 }}>
              Dias em manutenção
            </span>
            <span className="font-semibold" style={{ color: config.color }}>
              {alert.daysInMaintenance} dias
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

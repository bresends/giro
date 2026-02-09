import { Link } from "react-router-dom";
import { VehicleActivityBadge } from "./VehicleActivityBadge";
import { VehicleServiceBadge } from "./VehicleServiceBadge";
import { Id } from "../../../convex/_generated/dataModel";
import { MapPin } from "lucide-react";

interface VehicleCardProps {
  vehicle: {
    _id: Id<"vehicles">;
    plate: string;
    brand: string;
    model: string;
    year: number;
    operationalPrefix: string;
    currentKm: number;
    ownershipType: "propria" | "locada";
    serviceType: "operational" | "backup";
    inMaintenance: boolean;
    maintenanceLocation?: string;
    type?: {
      name: string;
      description: string;
    };
  };
}

const velLabel: React.CSSProperties = {
  fontSize: 10,
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: "#999",
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link to={`/vehicles/${vehicle._id}`}>
      <div
        className="h-full transition-shadow hover:shadow-md"
        style={{
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.06)",
          padding: 16,
          clipPath:
            "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
          cursor: "pointer",
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3
              className="text-lg text-[#1a1a1a]"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
            >
              {vehicle.operationalPrefix}
            </h3>
            <p className="text-xs text-[#999]" style={{ fontFamily: "'Barlow', sans-serif" }}>
              {vehicle.type?.name} - {vehicle.plate}
            </p>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <VehicleActivityBadge inMaintenance={vehicle.inMaintenance} />
            <VehicleServiceBadge serviceType={vehicle.serviceType} />
          </div>
        </div>

        <div className="space-y-2 text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
          <div className="flex justify-between">
            <span style={velLabel}>Modelo</span>
            <span className="font-medium text-[#1a1a1a] text-xs">
              {vehicle.brand} {vehicle.model}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={velLabel}>Ano</span>
            <span className="font-medium text-[#1a1a1a] text-xs">{vehicle.year}</span>
          </div>
          <div className="flex justify-between">
            <span style={velLabel}>Propriedade</span>
            <span className="font-medium text-[#1a1a1a] text-xs">
              {vehicle.ownershipType === "propria" ? "Própria" : "Locada"}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={velLabel}>KM</span>
            <span className="font-medium text-xs" style={{ color: "#2563eb" }}>
              {new Intl.NumberFormat("pt-BR").format(vehicle.currentKm)} km
            </span>
          </div>
          {vehicle.inMaintenance && vehicle.maintenanceLocation && (
            <div
              className="pt-2 mt-2"
              style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
            >
              <p className="text-xs text-[#999] flex items-center gap-1">
                <MapPin size={12} />
                {vehicle.maintenanceLocation}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

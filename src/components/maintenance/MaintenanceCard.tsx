import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { MaintenanceStatusBadge } from "./MaintenanceStatusBadge";
import { MaintenanceTypeBadge } from "./MaintenanceTypeBadge";
import { Id } from "../../../convex/_generated/dataModel";
import { Calendar, FileText, MapPin } from "lucide-react";

interface MaintenanceCardProps {
  maintenance: {
    _id: Id<"maintenanceRecords">;
    type: "preventive" | "corrective";
    status: "awaiting_ceman" | "in_progress" | "completed" | "cancelled";
    seiProcessNumber?: string;
    sentDate?: number;
    returnDate?: number;
    location?: string;
    kmAtMaintenance: number;
    description: string;
    vehicle: {
      _id: Id<"vehicles">;
      operationalPrefix: string;
      plate: string;
      brand: string;
      model: string;
      type?: {
        name: string;
        description: string;
      };
    };
  };
}

export function MaintenanceCard({ maintenance }: MaintenanceCardProps) {
  return (
    <Link to={`/maintenance/${maintenance._id}`}>
      <Card className="hover:shadow-md transition cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold">
                {maintenance.vehicle.operationalPrefix}
              </h3>
              <p className="text-sm text-muted-foreground">
                {maintenance.vehicle.brand} {maintenance.vehicle.model}
              </p>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <MaintenanceStatusBadge status={maintenance.status} />
              <MaintenanceTypeBadge type={maintenance.type} />
            </div>
          </div>

          <p className="text-sm mb-3 line-clamp-2">{maintenance.description}</p>

          <div className="space-y-2 text-sm">
            {maintenance.sentDate && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  Envio:{" "}
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "short",
                  }).format(new Date(maintenance.sentDate))}
                </span>
              </div>
            )}

            {maintenance.returnDate && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  Retorno:{" "}
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "short",
                  }).format(new Date(maintenance.returnDate))}
                </span>
              </div>
            )}

            {maintenance.seiProcessNumber && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span className="font-mono text-xs">
                  SEI: {maintenance.seiProcessNumber}
                </span>
              </div>
            )}

            {maintenance.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{maintenance.location}</span>
              </div>
            )}

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                KM: {new Intl.NumberFormat("pt-BR").format(maintenance.kmAtMaintenance)} km
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

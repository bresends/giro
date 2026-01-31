import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link to={`/vehicles/${vehicle._id}`}>
      <Card className="hover:shadow-md transition cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold">
                {vehicle.operationalPrefix}
              </h3>
              <p className="text-sm text-muted-foreground">
                {vehicle.type?.name} - {vehicle.plate}
              </p>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <VehicleActivityBadge inMaintenance={vehicle.inMaintenance} />
              <VehicleServiceBadge serviceType={vehicle.serviceType} />
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Modelo:</span>
              <span className="font-medium">
                {vehicle.brand} {vehicle.model}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ano:</span>
              <span className="font-medium">
                {vehicle.year}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Propriedade:</span>
              <span className="font-medium">
                {vehicle.ownershipType === "propria" ? "Própria" : "Locada"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">KM:</span>
              <span className="font-medium">
                {new Intl.NumberFormat("pt-BR").format(vehicle.currentKm)} km
              </span>
            </div>
            {vehicle.inMaintenance && vehicle.maintenanceLocation && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {vehicle.maintenanceLocation}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

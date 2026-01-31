import { VehicleCard } from "./VehicleCard";
import { Id } from "../../../convex/_generated/dataModel";
import { Truck } from "lucide-react";

interface VehicleListProps {
  vehicles: Array<{
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
  }>;
}

export function VehicleList({ vehicles }: VehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <Truck className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">
          Nenhuma viatura encontrada
        </h3>
        <p className="text-muted-foreground">
          Adicione viaturas para começar a gerenciar sua frota
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle._id} vehicle={vehicle} />
      ))}
    </div>
  );
}

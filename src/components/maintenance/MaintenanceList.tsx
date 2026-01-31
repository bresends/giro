import { MaintenanceCard } from "./MaintenanceCard";
import { Id } from "../../../convex/_generated/dataModel";
import { Wrench } from "lucide-react";

interface MaintenanceListProps {
  maintenances: Array<{
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
  }>;
}

export function MaintenanceList({ maintenances }: MaintenanceListProps) {
  if (maintenances.length === 0) {
    return (
      <div className="text-center py-12">
        <Wrench className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">
          Nenhuma manutenção encontrada
        </h3>
        <p className="text-muted-foreground">
          Registre manutenções para acompanhar o histórico da frota
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {maintenances.map((maintenance) => (
        <MaintenanceCard key={maintenance._id} maintenance={maintenance} />
      ))}
    </div>
  );
}

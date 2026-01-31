import { useState } from "react";
import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { SimpleSelect } from "../components/common/SimpleSelect";
import { VehicleList } from "../components/vehicles/VehicleList";
import { Loading } from "../components/common/Loading";
import { Plus, Truck, CheckCircle, Wrench, Briefcase } from "lucide-react";

export function VehiclesPage() {
  const navigate = useNavigate();
  const [maintenanceFilter, setMaintenanceFilter] = useState<
    "all" | "active" | "maintenance"
  >("all");
  const [serviceFilter, setServiceFilter] = useState<
    "all" | "operational" | "backup"
  >("all");

  const vehicles = useQuery(
    api.vehicles.list,
    maintenanceFilter === "all" && serviceFilter === "all"
      ? {}
      : maintenanceFilter === "active"
      ? { inMaintenance: false, ...(serviceFilter !== "all" ? { serviceType: serviceFilter } : {}) }
      : maintenanceFilter === "maintenance"
      ? { inMaintenance: true, ...(serviceFilter !== "all" ? { serviceType: serviceFilter } : {}) }
      : serviceFilter !== "all"
      ? { serviceType: serviceFilter }
      : {}
  );

  const stats = useQuery(api.vehicles.getStats);

  if (vehicles === undefined || stats === undefined) {
    return <Loading text="Carregando viaturas..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Viaturas
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todas as viaturas da frota
          </p>
        </div>
        <Button onClick={() => navigate("/vehicles/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Viatura
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">
                {stats.total}
              </p>
            </div>
            <Truck className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-l-4 border-l-green-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ativas</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                {stats.active}
              </p>
              <p className="text-xs text-muted-foreground">{stats.activePercentage}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-l-4 border-l-orange-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Manutenção</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-500">
                {stats.inMaintenance}
              </p>
              <p className="text-xs text-muted-foreground">{stats.inMaintenancePercentage}%</p>
            </div>
            <Wrench className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-l-4 border-l-blue-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Operacionais</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                {stats.operational}
              </p>
              <p className="text-xs text-muted-foreground">{stats.backup} backup</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card rounded-lg shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              Status:
            </span>
            <div className="flex-1">
              <SimpleSelect
                value={maintenanceFilter}
                onChange={(e) =>
                  setMaintenanceFilter(
                    e.target.value as typeof maintenanceFilter
                  )
                }
                options={[
                  { value: "all", label: "Todas" },
                  { value: "active", label: "Ativas" },
                  { value: "maintenance", label: "Em Manutenção" },
                ]}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              Serviço:
            </span>
            <div className="flex-1">
              <SimpleSelect
                value={serviceFilter}
                onChange={(e) =>
                  setServiceFilter(
                    e.target.value as typeof serviceFilter
                  )
                }
                options={[
                  { value: "all", label: "Todos" },
                  { value: "operational", label: "Operacional" },
                  { value: "backup", label: "Backup" },
                ]}
              />
            </div>
          </div>
        </div>
        {(maintenanceFilter !== "all" || serviceFilter !== "all") && (
          <div className="mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setMaintenanceFilter("all");
                setServiceFilter("all");
              }}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Lista de Viaturas */}
      <VehicleList vehicles={vehicles} />
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { SimpleSelect } from "../components/common/SimpleSelect";
import { MaintenanceTable } from "../components/maintenance/MaintenanceTable";
import { Loading } from "../components/common/Loading";
import { Plus, Wrench, Calendar, CheckCircle } from "lucide-react";

export function MaintenancesPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<
    "all" | "awaiting_ceman" | "in_progress" | "completed" | "cancelled"
  >("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "preventive" | "corrective"
  >("all");

  const allMaintenances = useQuery(api.maintenanceRecords.list, {});

  if (allMaintenances === undefined) {
    return <Loading text="Carregando manutenções..." />;
  }

  // Apply filters
  const filteredMaintenances = allMaintenances.filter((m) => {
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    if (typeFilter !== "all" && m.type !== typeFilter) return false;
    return true;
  });

  // Calculate statistics
  const stats = {
    total: allMaintenances.length,
    awaitingCeman: allMaintenances.filter((m) => m.status === "awaiting_ceman").length,
    inProgress: allMaintenances.filter((m) => m.status === "in_progress").length,
    completed: allMaintenances.filter((m) => m.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manutenções</h1>
          <p className="text-muted-foreground">
            Gerencie o histórico de manutenções da frota
          </p>
        </div>
        <Button onClick={() => navigate("/maintenance/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Manutenção
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total
                </p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <Wrench className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Aguardando CEMAN
                </p>
                <p className="text-2xl font-bold mt-1">{stats.awaitingCeman}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Em Andamento
                </p>
                <p className="text-2xl font-bold mt-1">{stats.inProgress}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <Wrench className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Concluídas
                </p>
                <p className="text-2xl font-bold mt-1">{stats.completed}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SimpleSelect
              label="Status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as typeof statusFilter
                )
              }
              options={[
                { value: "all", label: "Todos" },
                { value: "awaiting_ceman", label: "Aguardando CEMAN" },
                { value: "in_progress", label: "Em Andamento" },
                { value: "completed", label: "Concluídas" },
                { value: "cancelled", label: "Canceladas" },
              ]}
            />

            <SimpleSelect
              label="Tipo"
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as typeof typeFilter)
              }
              options={[
                { value: "all", label: "Todos" },
                { value: "preventive", label: "Preventiva" },
                { value: "corrective", label: "Corretiva" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Manutenções */}
      <Card>
        <CardHeader>
          <CardTitle>
            {statusFilter === "all"
              ? "Todas as Manutenções"
              : statusFilter === "awaiting_ceman"
              ? "Aguardando CEMAN"
              : statusFilter === "in_progress"
              ? "Manutenções em Andamento"
              : statusFilter === "completed"
              ? "Manutenções Concluídas"
              : "Manutenções Canceladas"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MaintenanceTable maintenances={filteredMaintenances} />
        </CardContent>
      </Card>
    </div>
  );
}

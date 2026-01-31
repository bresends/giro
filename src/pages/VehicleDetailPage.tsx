import { useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  ArrowLeft,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  Wrench,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Loading } from "../components/common/Loading";
import { VehicleActivityBadge } from "../components/vehicles/VehicleActivityBadge";
import { VehicleServiceBadge } from "../components/vehicles/VehicleServiceBadge";
import { IssueCard } from "../components/issues/IssueCard";

export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const vehicle = useQuery(
    api.vehicles.get,
    id ? { id: id as Id<"vehicles"> } : "skip",
  );

  const issues = useQuery(
    api.vehicleIssues.list,
    id ? { vehicleId: id as Id<"vehicles">, status: "open" } : "skip",
  );

  const deleteVehicle = useMutation(api.vehicles.remove);

  const handleDelete = async () => {
    if (!id) return;

    const confirmed = window.confirm(
      "Tem certeza que deseja deletar esta viatura? Esta ação não pode ser desfeita.",
    );

    if (confirmed) {
      try {
        await deleteVehicle({ id: id as Id<"vehicles"> });
        navigate("/vehicles");
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Erro ao deletar viatura",
        );
      }
    }
  };

  if (!id) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">ID da viatura não fornecido</p>
      </div>
    );
  }

  if (vehicle === undefined) {
    return <Loading text="Carregando detalhes da viatura..." />;
  }

  if (vehicle === null) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Viatura não encontrada</h3>
        <Button onClick={() => navigate("/vehicles")}>Voltar para lista</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/vehicles")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold mt-2">
            {vehicle.operationalPrefix}
          </h1>
          <p className="text-muted-foreground">{vehicle.type?.description}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/vehicles/${id}/edit`)}>
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Deletar
          </Button>
        </div>
      </div>

      {/* Informações Principais */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Informações da Viatura</CardTitle>
            <div className="flex gap-2">
              <VehicleActivityBadge inMaintenance={vehicle.inMaintenance} />
              <VehicleServiceBadge serviceType={vehicle.serviceType} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Placa</p>
              <p className="text-lg font-semibold">{vehicle.plate}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Prefixo Operacional
              </p>
              <p className="text-lg font-semibold">
                {vehicle.operationalPrefix}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Tipo</p>
              <p className="text-lg font-semibold">
                {vehicle.type?.name} - {vehicle.type?.description}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Marca</p>
              <p className="text-lg font-semibold">{vehicle.brand}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Modelo</p>
              <p className="text-lg font-semibold">{vehicle.model}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Ano</p>
              <p className="text-lg font-semibold">{vehicle.year}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Propriedade</p>
              <p className="text-lg font-semibold">
                {vehicle.ownershipType === "propria" ? "Própria" : "Locada"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Chassi</p>
              <p className="text-lg font-semibold">{vehicle.chassisNumber}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Renavam</p>
              <p className="text-lg font-semibold">{vehicle.renavam}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Uso atual</p>
              <p className="text-lg font-semibold">
                {vehicle.serviceType === "operational"
                  ? "Serviço Operacional"
                  : "Backup"}
              </p>
            </div>

            {vehicle.inMaintenance && vehicle.maintenanceLocation && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Local da Manutenção
                </p>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {vehicle.maintenanceLocation}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dados Operacionais */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Operacionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Quilometragem Atual
              </p>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR").format(vehicle.currentKm)} km
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Última atualização:{" "}
              {new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              }).format(new Date(vehicle.updatedAt))}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Manutenção Preventiva */}
      <Card>
        <CardHeader>
          <CardTitle>Manutenção Preventiva</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {vehicle.nextMaintenanceKm ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Próxima Manutenção Programada
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      vehicle.kmUntilMaintenance! < 0
                        ? "bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800"
                        : vehicle.kmUntilMaintenance! <= 1000
                        ? "bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800"
                        : "bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg">🔧</span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Próxima Revisão
                      </p>
                      <p className="text-lg font-semibold">
                        {new Intl.NumberFormat("pt-BR").format(
                          vehicle.nextMaintenanceKm
                        )}{" "}
                        km
                      </p>
                      {vehicle.kmUntilMaintenance !== null && (
                        <p className="text-xs text-muted-foreground">
                          {vehicle.kmUntilMaintenance < 0
                            ? `${Math.abs(vehicle.kmUntilMaintenance).toLocaleString("pt-BR")} km atrasado`
                            : `Faltam ${vehicle.kmUntilMaintenance.toLocaleString("pt-BR")} km`}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg">📍</span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        KM Atual
                      </p>
                      <p className="text-lg font-semibold">
                        {new Intl.NumberFormat("pt-BR").format(vehicle.currentKm)} km
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>Nenhuma manutenção programada</p>
                <p className="text-sm mt-1">
                  Defina a próxima revisão nas configurações da viatura
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Manutenções */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Manutenções</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Wrench className="w-12 h-12 mx-auto mb-2" />
            <p>Histórico de manutenções será exibido aqui</p>
            <p className="text-sm">(Disponível na próxima fase)</p>
          </div>
        </CardContent>
      </Card>

      {/* Problemas Abertos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Problemas Abertos</CardTitle>
            <Button
              size="sm"
              onClick={() => navigate(`/issues/new?vehicleId=${id}`)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Problema
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {issues === undefined ? (
            <Loading text="Carregando problemas..." />
          ) : issues.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
              <p>Nenhum problema aberto para esta viatura</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issues.map((issue) => (
                <IssueCard key={issue._id} issue={issue} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

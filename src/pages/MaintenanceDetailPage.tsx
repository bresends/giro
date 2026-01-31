import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MaintenanceStatusBadge } from "../components/maintenance/MaintenanceStatusBadge";
import { MaintenanceTypeBadge } from "../components/maintenance/MaintenanceTypeBadge";
import { Loading } from "../components/common/Loading";
import { ArrowLeft, Pencil, Trash2, Calendar, FileText, Gauge, MapPin } from "lucide-react";

export function MaintenanceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const maintenance = useQuery(
    api.maintenanceRecords.get,
    id ? { id: id as Id<"maintenanceRecords"> } : "skip"
  );

  const deleteMaintenance = useMutation(api.maintenanceRecords.remove);

  const handleDelete = async () => {
    if (!id) return;

    const confirmed = window.confirm(
      "Tem certeza que deseja deletar este registro de manutenção? Esta ação não pode ser desfeita."
    );

    if (confirmed) {
      try {
        await deleteMaintenance({ id: id as Id<"maintenanceRecords"> });
        navigate("/maintenance");
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Erro ao deletar manutenção"
        );
      }
    }
  };

  if (!id) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">ID da manutenção não fornecido</p>
      </div>
    );
  }

  if (maintenance === undefined) {
    return <Loading text="Carregando detalhes da manutenção..." />;
  }

  if (maintenance === null) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Manutenção não encontrada</h3>
        <Button onClick={() => navigate("/maintenance")}>
          Voltar para lista
        </Button>
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
            onClick={() => navigate("/maintenance")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold mt-2">
            Manutenção - {maintenance.vehicle.operationalPrefix}
          </h1>
          <p className="text-muted-foreground">
            {maintenance.vehicle.brand} {maintenance.vehicle.model} -{" "}
            {maintenance.vehicle.plate}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/maintenance/${id}/edit`)}>
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
            <CardTitle>Informações da Manutenção</CardTitle>
            <div className="flex gap-2">
              <MaintenanceStatusBadge status={maintenance.status} />
              <MaintenanceTypeBadge type={maintenance.type} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Descrição</p>
              <p className="text-lg">{maintenance.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  KM na Manutenção
                </p>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <Gauge className="w-5 h-5" />
                  {new Intl.NumberFormat("pt-BR").format(
                    maintenance.kmAtMaintenance
                  )}{" "}
                  km
                </p>
              </div>

              {maintenance.sentDate && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Data de Envio
                  </p>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "long",
                    }).format(new Date(maintenance.sentDate))}
                  </p>
                </div>
              )}

              {maintenance.returnDate && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Data de Retorno
                  </p>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "long",
                    }).format(new Date(maintenance.returnDate))}
                  </p>
                </div>
              )}

              {maintenance.location && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Oficina</p>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {maintenance.location}
                  </p>
                </div>
              )}

              {maintenance.seiProcessNumber && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Processo SEI
                  </p>
                  <p className="text-lg font-semibold font-mono flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {maintenance.seiProcessNumber}
                  </p>
                </div>
              )}
            </div>

            {maintenance.notes && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-1">
                  Observações
                </p>
                <p className="text-base">{maintenance.notes}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Criado em:{" "}
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(new Date(maintenance.createdAt))}
              </p>
              <p className="text-xs text-muted-foreground">
                Última atualização:{" "}
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(new Date(maintenance.updatedAt))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações da Viatura */}
      <Card>
        <CardHeader>
          <CardTitle>Viatura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">
                {maintenance.vehicle.operationalPrefix}
              </p>
              <p className="text-muted-foreground">
                {maintenance.vehicle.brand} {maintenance.vehicle.model}
              </p>
              <p className="text-sm text-muted-foreground">
                {maintenance.vehicle.plate}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(`/vehicles/${maintenance.vehicle._id}`)}
            >
              Ver Detalhes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

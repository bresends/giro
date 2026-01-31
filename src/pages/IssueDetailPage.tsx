import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Loading } from "../components/common/Loading";
import { IssueStatusBadge } from "../components/issues/IssueStatusBadge";
import { IssueSeverityBadge } from "../components/issues/IssueSeverityBadge";

export function IssueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const issue = useQuery(
    api.vehicleIssues.get,
    id ? { id: id as Id<"vehicleIssues"> } : "skip"
  );

  const deleteIssue = useMutation(api.vehicleIssues.remove);

  const handleDelete = async () => {
    if (!id) return;

    const confirmed = window.confirm(
      "Tem certeza que deseja deletar este problema? Esta ação não pode ser desfeita."
    );

    if (confirmed) {
      try {
        await deleteIssue({ id: id as Id<"vehicleIssues"> });
        navigate("/issues");
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Erro ao deletar problema"
        );
      }
    }
  };

  if (!id) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">ID do problema não fornecido</p>
      </div>
    );
  }

  if (issue === undefined) {
    return <Loading text="Carregando detalhes do problema..." />;
  }

  if (issue === null) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Problema não encontrado</h3>
        <Button onClick={() => navigate("/issues")}>Voltar para lista</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/issues")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold mt-2">{issue.title}</h1>
          {issue.vehicle && (
            <p className="text-muted-foreground">
              {issue.vehicle.operationalPrefix} - {issue.vehicle.plate}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/issues/${id}/edit`)}>
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Deletar
          </Button>
        </div>
      </div>

      {/* Informações do Problema */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Informações do Problema</CardTitle>
            <div className="flex gap-2">
              <IssueStatusBadge status={issue.status} />
              <IssueSeverityBadge severity={issue.severity} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Descrição</p>
              <p className="text-base whitespace-pre-wrap">{issue.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Data de Reporte
                </p>
                <p className="text-lg font-semibold">
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(issue.reportedDate))}
                </p>
              </div>

              {issue.resolvedDate && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Data de Resolução
                  </p>
                  <p className="text-lg font-semibold">
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(issue.resolvedDate))}
                  </p>
                </div>
              )}

              {issue.vehicle && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Viatura</p>
                  <Button
                    variant="link"
                    className="p-0 h-auto font-semibold text-lg"
                    onClick={() => navigate(`/vehicles/${issue.vehicle?._id}`)}
                  >
                    {issue.vehicle.operationalPrefix} -{" "}
                    {issue.vehicle.plate}
                  </Button>
                </div>
              )}

              {issue.maintenanceRecord && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Manutenção Vinculada
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto font-semibold text-lg"
                    onClick={() =>
                      navigate(`/maintenance/${issue.maintenanceRecordId}`)
                    }
                  >
                    Ver Manutenção
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

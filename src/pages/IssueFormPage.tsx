import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { IssueForm } from "../components/issues/IssueForm";
import { Loading } from "../components/common/Loading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function IssueFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const vehicles = useQuery(api.vehicles.list, {});
  const issue = useQuery(
    api.vehicleIssues.get,
    id ? { id: id as Id<"vehicleIssues"> } : "skip"
  );

  const createIssue = useMutation(api.vehicleIssues.create);
  const updateIssue = useMutation(api.vehicleIssues.update);

  const handleSubmit = async (data: any) => {
    try {
      if (isEdit && id) {
        await updateIssue({
          id: id as Id<"vehicleIssues">,
          ...data,
        });
        navigate(`/issues/${id}`);
      } else {
        const newId = await createIssue({
          vehicleId: data.vehicleId,
          title: data.title,
          description: data.description,
          severity: data.severity,
        });
        navigate(`/issues/${newId}`);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    if (isEdit && id) {
      navigate(`/issues/${id}`);
    } else {
      navigate("/issues");
    }
  };

  if (vehicles === undefined || (isEdit && issue === undefined)) {
    return <Loading text={isEdit ? "Carregando problema..." : "Carregando..."} />;
  }

  if (isEdit && issue === null) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Problema não encontrado</h3>
        <Button onClick={() => navigate("/issues")}>Voltar para lista</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold mt-2">
          {isEdit ? "Editar Problema" : "Novo Problema"}
        </h1>
        <p className="text-muted-foreground">
          {isEdit
            ? "Atualize as informações do problema"
            : "Preencha os dados para registrar um novo problema"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEdit ? "Dados do Problema" : "Cadastro de Problema"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <IssueForm
            initialData={
              isEdit && issue
                ? {
                    vehicleId: issue.vehicleId,
                    title: issue.title,
                    description: issue.description,
                    severity: issue.severity,
                    status: issue.status,
                  }
                : undefined
            }
            vehicles={
              vehicles?.map((v) => ({
                _id: v._id,
                operationalPrefix: v.operationalPrefix,
                plate: v.plate,
              })) || []
            }
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEdit={isEdit}
          />
        </CardContent>
      </Card>
    </div>
  );
}

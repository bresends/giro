import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MaintenanceForm } from "../components/maintenance/MaintenanceForm";
import { Loading } from "../components/common/Loading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function MaintenanceFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const vehicles = useQuery(api.vehicles.list, {});
  const maintenance = useQuery(
    api.maintenanceRecords.get,
    id ? { id: id as Id<"maintenanceRecords"> } : "skip"
  );

  const createMaintenance = useMutation(api.maintenanceRecords.create);
  const updateMaintenance = useMutation(api.maintenanceRecords.update);

  const handleSubmit = async (data: any) => {
    try {
      if (isEdit && id) {
        await updateMaintenance({
          id: id as Id<"maintenanceRecords">,
          ...data,
        });
        navigate(`/maintenance/${id}`);
      } else {
        const newId = await createMaintenance(data);
        navigate(`/maintenance/${newId}`);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    if (isEdit && id) {
      navigate(`/maintenance/${id}`);
    } else {
      navigate("/maintenance");
    }
  };

  if (vehicles === undefined || (isEdit && maintenance === undefined)) {
    return (
      <Loading text={isEdit ? "Carregando manutenção..." : "Carregando..."} />
    );
  }

  if (isEdit && maintenance === null) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Manutenção não encontrada</h3>
        <Button onClick={() => navigate("/maintenance")}>
          Voltar para lista
        </Button>
      </div>
    );
  }

  // Prepare vehicle list for the form
  const vehicleList =
    vehicles?.map((v) => ({
      _id: v._id,
      operationalPrefix: v.operationalPrefix,
      plate: v.plate,
      currentKm: v.currentKm,
    })) || [];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold mt-2">
          {isEdit ? "Editar Manutenção" : "Nova Manutenção"}
        </h1>
        <p className="text-muted-foreground">
          {isEdit
            ? "Atualize as informações da manutenção"
            : "Registre uma nova manutenção para a frota"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEdit ? "Dados da Manutenção" : "Registro de Manutenção"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MaintenanceForm
            initialData={
              isEdit && maintenance
                ? {
                    vehicleId: maintenance.vehicle._id,
                    type: maintenance.type,
                    status: maintenance.status,
                    seiProcessNumber: maintenance.seiProcessNumber,
                    sentDate: maintenance.sentDate
                      ? new Date(maintenance.sentDate)
                      : undefined,
                    returnDate: maintenance.returnDate
                      ? new Date(maintenance.returnDate)
                      : undefined,
                    location: maintenance.location,
                    kmAtMaintenance: maintenance.kmAtMaintenance,
                    description: maintenance.description,
                    notes: maintenance.notes,
                  }
                : undefined
            }
            vehicles={vehicleList}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEdit={isEdit}
          />
        </CardContent>
      </Card>
    </div>
  );
}

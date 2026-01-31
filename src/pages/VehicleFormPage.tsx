import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { VehicleForm } from "../components/vehicles/VehicleForm";
import { Loading } from "../components/common/Loading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function VehicleFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const vehicleTypes = useQuery(api.vehicleTypes.list);
  const vehicle = useQuery(
    api.vehicles.get,
    id ? { id: id as Id<"vehicles"> } : "skip"
  );

  const createVehicle = useMutation(api.vehicles.create);
  const updateVehicle = useMutation(api.vehicles.update);

  const handleSubmit = async (data: any) => {
    try {
      if (isEdit && id) {
        await updateVehicle({
          id: id as Id<"vehicles">,
          ...data,
        });
        navigate(`/vehicles/${id}`);
      } else {
        const newId = await createVehicle(data);
        navigate(`/vehicles/${newId}`);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    if (isEdit && id) {
      navigate(`/vehicles/${id}`);
    } else {
      navigate("/vehicles");
    }
  };

  if (vehicleTypes === undefined || (isEdit && vehicle === undefined)) {
    return <Loading text={isEdit ? "Carregando viatura..." : "Carregando..."} />;
  }

  if (isEdit && vehicle === null) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">
          Viatura não encontrada
        </h3>
        <Button onClick={() => navigate("/vehicles")}>
          Voltar para lista
        </Button>
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
          {isEdit ? "Editar Viatura" : "Nova Viatura"}
        </h1>
        <p className="text-muted-foreground">
          {isEdit
            ? "Atualize as informações da viatura"
            : "Preencha os dados para cadastrar uma nova viatura"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEdit ? "Dados da Viatura" : "Cadastro de Viatura"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleForm
            initialData={
              isEdit && vehicle
                ? {
                    plate: vehicle.plate,
                    brand: vehicle.brand,
                    model: vehicle.model,
                    year: vehicle.year,
                    chassisNumber: vehicle.chassisNumber,
                    renavam: vehicle.renavam,
                    operationalPrefix: vehicle.operationalPrefix,
                    typeId: vehicle.typeId,
                    nextMaintenanceKm: vehicle.nextMaintenanceKm,
                    color: vehicle.color,
                    ownershipType: vehicle.ownershipType,
                    serviceType: vehicle.serviceType,
                  }
                : undefined
            }
            vehicleTypes={vehicleTypes || []}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEdit={isEdit}
          />
        </CardContent>
      </Card>
    </div>
  );
}

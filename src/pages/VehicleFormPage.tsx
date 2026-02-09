import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { VehicleForm } from "../components/vehicles/VehicleForm";
import { Loading } from "../components/common/Loading";
import { ArrowLeft } from "lucide-react";

const velPanel: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(0,0,0,0.06)",
  padding: "24px",
  clipPath:
    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
};

const velBtnPrimary: React.CSSProperties = {
  background: "#dc2626",
  color: "#fff",
  padding: "8px 20px",
  border: "none",
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  fontSize: 13,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  clipPath:
    "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const velBtnBack: React.CSSProperties = {
  background: "transparent",
  color: "#999",
  border: "none",
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  fontSize: 11,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: 0,
};

const velSectionLabel: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  fontSize: 10,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#999",
};

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
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <h3
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            fontSize: 16,
            color: "#1a1a1a",
            marginBottom: 12,
          }}
        >
          Viatura nao encontrada
        </h3>
        <button style={velBtnPrimary} onClick={() => navigate("/vehicles")}>
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 720 }}>
      {/* Header */}
      <div>
        <button style={velBtnBack} onClick={handleCancel}>
          <ArrowLeft size={14} />
          Voltar
        </button>
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 28,
            color: "#1a1a1a",
            letterSpacing: "0.04em",
            margin: "8px 0 0 0",
          }}
        >
          {isEdit ? "Editar Viatura" : "Nova Viatura"}
        </h1>
        <p style={{ color: "#999", fontFamily: "'Barlow', sans-serif", fontSize: 14, marginTop: 4 }}>
          {isEdit
            ? "Atualize as informacoes da viatura"
            : "Preencha os dados para cadastrar uma nova viatura"}
        </p>
      </div>

      {/* Form Panel */}
      <div style={velPanel}>
        <div style={{ marginBottom: 16 }}>
          <span style={velSectionLabel}>
            {isEdit ? "Dados da Viatura" : "Cadastro de Viatura"}
          </span>
          <div style={{ width: 24, height: 2, background: "#dc2626", marginTop: 6 }} />
        </div>
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
      </div>
    </div>
  );
}

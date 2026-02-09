import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { MaintenanceForm } from "../components/maintenance/MaintenanceForm";
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
      <Loading text={isEdit ? "Carregando manutencao..." : "Carregando..."} />
    );
  }

  if (isEdit && maintenance === null) {
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
          Manutencao nao encontrada
        </h3>
        <button style={velBtnPrimary} onClick={() => navigate("/maintenance")}>
          Voltar para lista
        </button>
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
          {isEdit ? "Editar Manutencao" : "Nova Manutencao"}
        </h1>
        <p style={{ color: "#999", fontFamily: "'Barlow', sans-serif", fontSize: 14, marginTop: 4 }}>
          {isEdit
            ? "Atualize as informacoes da manutencao"
            : "Registre uma nova manutencao para a frota"}
        </p>
      </div>

      {/* Form Panel */}
      <div style={velPanel}>
        <div style={{ marginBottom: 16 }}>
          <span style={velSectionLabel}>
            {isEdit ? "Dados da Manutencao" : "Registro de Manutencao"}
          </span>
          <div style={{ width: 24, height: 2, background: "#dc2626", marginTop: 6 }} />
        </div>
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
      </div>
    </div>
  );
}

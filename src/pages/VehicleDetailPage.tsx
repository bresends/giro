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
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Loading } from "../components/common/Loading";
import { VehicleActivityBadge } from "../components/vehicles/VehicleActivityBadge";
import { VehicleServiceBadge } from "../components/vehicles/VehicleServiceBadge";
import { IssueCard } from "../components/issues/IssueCard";

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

const velBtnDanger: React.CSSProperties = {
  ...velBtnPrimary,
  background: "#991b1b",
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
  margin: 0,
};

const velFieldLabel: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  fontSize: 10,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#999",
  margin: "0 0 4px 0",
};

const velFieldValue: React.CSSProperties = {
  fontFamily: "'Barlow', sans-serif",
  fontSize: 15,
  fontWeight: 600,
  color: "#1a1a1a",
  margin: 0,
};

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
      "Tem certeza que deseja deletar esta viatura? Esta acao nao pode ser desfeita.",
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
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <p style={{ color: "#dc2626", fontFamily: "'Barlow', sans-serif" }}>ID da viatura nao fornecido</p>
      </div>
    );
  }

  if (vehicle === undefined) {
    return <Loading text="Carregando detalhes da viatura..." />;
  }

  if (vehicle === null) {
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

  // Preventive Maintenance color logic
  const getMaintenanceStyle = (): React.CSSProperties => {
    if (!vehicle.nextMaintenanceKm || vehicle.kmUntilMaintenance === null) {
      return { borderLeft: "3px solid #999", background: "rgba(0,0,0,0.02)" };
    }
    if (vehicle.kmUntilMaintenance < 0) {
      return { borderLeft: "3px solid #dc2626", background: "rgba(220,38,38,0.04)" };
    }
    if (vehicle.kmUntilMaintenance <= 1000) {
      return { borderLeft: "3px solid #ea580c", background: "rgba(234,88,12,0.04)" };
    }
    return { borderLeft: "3px solid #16a34a", background: "rgba(22,163,74,0.04)" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <button style={velBtnBack} onClick={() => navigate("/vehicles")}>
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
            {vehicle.operationalPrefix}
          </h1>
          <p style={{ color: "#999", fontFamily: "'Barlow', sans-serif", fontSize: 14, marginTop: 2 }}>
            {vehicle.type?.description}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={velBtnPrimary} onClick={() => navigate(`/vehicles/${id}/edit`)}>
            <Pencil size={14} />
            Editar
          </button>
          <button style={velBtnDanger} onClick={handleDelete}>
            <Trash2 size={14} />
            Deletar
          </button>
        </div>
      </div>

      {/* Vehicle Info */}
      <div style={velPanel}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <span style={velSectionLabel}>Informacoes da Viatura</span>
            <div style={{ width: 24, height: 2, background: "#dc2626", marginTop: 6 }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <VehicleActivityBadge inMaintenance={vehicle.inMaintenance} />
            <VehicleServiceBadge serviceType={vehicle.serviceType} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
          <div>
            <p style={velFieldLabel}>Placa</p>
            <p style={velFieldValue}>{vehicle.plate}</p>
          </div>
          <div>
            <p style={velFieldLabel}>Prefixo Operacional</p>
            <p style={velFieldValue}>{vehicle.operationalPrefix}</p>
          </div>
          <div>
            <p style={velFieldLabel}>Tipo</p>
            <p style={velFieldValue}>{vehicle.type?.name} - {vehicle.type?.description}</p>
          </div>
          <div>
            <p style={velFieldLabel}>Marca</p>
            <p style={velFieldValue}>{vehicle.brand}</p>
          </div>
          <div>
            <p style={velFieldLabel}>Modelo</p>
            <p style={velFieldValue}>{vehicle.model}</p>
          </div>
          <div>
            <p style={velFieldLabel}>Ano</p>
            <p style={velFieldValue}>{vehicle.year}</p>
          </div>
          <div>
            <p style={velFieldLabel}>Propriedade</p>
            <p style={velFieldValue}>
              {vehicle.ownershipType === "propria" ? "Propria" : "Locada"}
            </p>
          </div>
          <div>
            <p style={velFieldLabel}>Chassi</p>
            <p style={velFieldValue}>{vehicle.chassisNumber}</p>
          </div>
          <div>
            <p style={velFieldLabel}>Renavam</p>
            <p style={velFieldValue}>{vehicle.renavam}</p>
          </div>
          <div>
            <p style={velFieldLabel}>Uso atual</p>
            <p style={velFieldValue}>
              {vehicle.serviceType === "operational"
                ? "Servico Operacional"
                : "Backup"}
            </p>
          </div>
          {vehicle.inMaintenance && vehicle.maintenanceLocation && (
            <div>
              <p style={velFieldLabel}>Local da Manutencao</p>
              <p style={{ ...velFieldValue, display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={16} color="#dc2626" />
                {vehicle.maintenanceLocation}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Operational Data */}
      <div style={velPanel}>
        <div style={{ marginBottom: 16 }}>
          <span style={velSectionLabel}>Dados Operacionais</span>
          <div style={{ width: 24, height: 2, background: "#dc2626", marginTop: 6 }} />
        </div>
        <div>
          <p style={velFieldLabel}>Quilometragem Atual</p>
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 32,
              color: "#2563eb",
              margin: "4px 0 0 0",
              lineHeight: 1,
            }}
          >
            {new Intl.NumberFormat("pt-BR").format(vehicle.currentKm)} km
          </p>
        </div>
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", marginTop: 16, paddingTop: 12 }}>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "#999" }}>
            Ultima atualizacao:{" "}
            {new Intl.DateTimeFormat("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date(vehicle.updatedAt))}
          </p>
        </div>
      </div>

      {/* Preventive Maintenance */}
      <div style={velPanel}>
        <div style={{ marginBottom: 16 }}>
          <span style={velSectionLabel}>Manutencao Preventiva</span>
          <div style={{ width: 24, height: 2, background: "#dc2626", marginTop: 6 }} />
        </div>
        {vehicle.nextMaintenanceKm ? (
          <div>
            <p
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#1a1a1a",
                margin: "0 0 12px 0",
              }}
            >
              Proxima Manutencao Programada
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Next maintenance card */}
              <div
                style={{
                  padding: 16,
                  clipPath:
                    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  ...getMaintenanceStyle(),
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "rgba(220,38,38,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    clipPath:
                      "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
                  }}
                >
                  <Wrench size={16} color="#dc2626" />
                </div>
                <div>
                  <p style={velFieldLabel}>Proxima Revisao</p>
                  <p
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 22,
                      color: "#1a1a1a",
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {new Intl.NumberFormat("pt-BR").format(vehicle.nextMaintenanceKm)} km
                  </p>
                  {vehicle.kmUntilMaintenance !== null && (
                    <p
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 11,
                        color: vehicle.kmUntilMaintenance < 0 ? "#dc2626" : "#999",
                        fontWeight: vehicle.kmUntilMaintenance < 0 ? 700 : 400,
                        marginTop: 2,
                      }}
                    >
                      {vehicle.kmUntilMaintenance < 0
                        ? `${Math.abs(vehicle.kmUntilMaintenance).toLocaleString("pt-BR")} km atrasado`
                        : `Faltam ${vehicle.kmUntilMaintenance.toLocaleString("pt-BR")} km`}
                    </p>
                  )}
                </div>
              </div>

              {/* Current KM card */}
              <div
                style={{
                  padding: 16,
                  background: "rgba(0,0,0,0.02)",
                  clipPath:
                    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  borderLeft: "3px solid #2563eb",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "rgba(37,99,235,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    clipPath:
                      "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
                  }}
                >
                  <MapPin size={16} color="#2563eb" />
                </div>
                <div>
                  <p style={velFieldLabel}>KM Atual</p>
                  <p
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 22,
                      color: "#2563eb",
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {new Intl.NumberFormat("pt-BR").format(vehicle.currentKm)} km
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "16px 0", color: "#999" }}>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14 }}>
              Nenhuma manutencao programada
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, marginTop: 4 }}>
              Defina a proxima revisao nas configuracoes da viatura
            </p>
          </div>
        )}
      </div>

      {/* Maintenance History */}
      <div style={velPanel}>
        <div style={{ marginBottom: 16 }}>
          <span style={velSectionLabel}>Historico de Manutencoes</span>
          <div style={{ width: 24, height: 2, background: "#dc2626", marginTop: 6 }} />
        </div>
        <div style={{ textAlign: "center", padding: "32px 0", color: "#999" }}>
          <Wrench size={40} color="#ccc" style={{ marginBottom: 8 }} />
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14 }}>
            Historico de manutencoes sera exibido aqui
          </p>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, marginTop: 4 }}>
            (Disponivel na proxima fase)
          </p>
        </div>
      </div>

      {/* Open Issues */}
      <div style={velPanel}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <span style={velSectionLabel}>Problemas Abertos</span>
            <div style={{ width: 24, height: 2, background: "#dc2626", marginTop: 6 }} />
          </div>
          <button
            style={{ ...velBtnPrimary, padding: "6px 14px", fontSize: 11 }}
            onClick={() => navigate(`/issues/new?vehicleId=${id}`)}
          >
            <Plus size={14} />
            Novo Problema
          </button>
        </div>
        {issues === undefined ? (
          <Loading text="Carregando problemas..." />
        ) : issues.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#999" }}>
            <AlertTriangle size={40} color="#ccc" style={{ marginBottom: 8 }} />
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14 }}>
              Nenhum problema aberto para esta viatura
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {issues.map((issue) => (
              <IssueCard key={issue._id} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

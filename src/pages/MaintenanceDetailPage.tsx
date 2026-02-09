import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { MaintenanceStatusBadge } from "../components/maintenance/MaintenanceStatusBadge";
import { MaintenanceTypeBadge } from "../components/maintenance/MaintenanceTypeBadge";
import { Loading } from "../components/common/Loading";
import { ArrowLeft, Pencil, Trash2, Calendar, FileText, Gauge, MapPin } from "lucide-react";

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

const velBtnOutline: React.CSSProperties = {
  background: "transparent",
  color: "#999",
  padding: "8px 20px",
  border: "1px solid rgba(0,0,0,0.1)",
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
  display: "flex",
  alignItems: "center",
  gap: 6,
};

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
      "Tem certeza que deseja deletar este registro de manutencao? Esta acao nao pode ser desfeita."
    );

    if (confirmed) {
      try {
        await deleteMaintenance({ id: id as Id<"maintenanceRecords"> });
        navigate("/maintenance");
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Erro ao deletar manutencao"
        );
      }
    }
  };

  if (!id) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <p style={{ color: "#dc2626", fontFamily: "'Barlow', sans-serif" }}>
          ID da manutencao nao fornecido
        </p>
      </div>
    );
  }

  if (maintenance === undefined) {
    return <Loading text="Carregando detalhes da manutencao..." />;
  }

  if (maintenance === null) {
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <button style={velBtnBack} onClick={() => navigate("/maintenance")}>
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
            Manutencao - {maintenance.vehicle.operationalPrefix}
          </h1>
          <p style={{ color: "#999", fontFamily: "'Barlow', sans-serif", fontSize: 14, marginTop: 2 }}>
            {maintenance.vehicle.brand} {maintenance.vehicle.model} -{" "}
            {maintenance.vehicle.plate}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={velBtnPrimary} onClick={() => navigate(`/maintenance/${id}/edit`)}>
            <Pencil size={14} />
            Editar
          </button>
          <button style={velBtnDanger} onClick={handleDelete}>
            <Trash2 size={14} />
            Deletar
          </button>
        </div>
      </div>

      {/* Maintenance Info */}
      <div style={velPanel}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <span style={velSectionLabel}>Informacoes da Manutencao</span>
            <div style={{ width: 24, height: 2, background: "#dc2626", marginTop: 6 }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <MaintenanceStatusBadge status={maintenance.status} />
            <MaintenanceTypeBadge type={maintenance.type} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Description */}
          <div>
            <p style={velFieldLabel}>Descricao</p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: "#1a1a1a", margin: 0 }}>
              {maintenance.description}
            </p>
          </div>

          {/* Info Grid */}
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
              <div>
                <p style={velFieldLabel}>KM na Manutencao</p>
                <p style={velFieldValue}>
                  <Gauge size={16} color="#2563eb" />
                  {new Intl.NumberFormat("pt-BR").format(maintenance.kmAtMaintenance)} km
                </p>
              </div>

              {maintenance.sentDate && (
                <div>
                  <p style={velFieldLabel}>Data de Envio</p>
                  <p style={velFieldValue}>
                    <Calendar size={16} color="#2563eb" />
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "long",
                    }).format(new Date(maintenance.sentDate))}
                  </p>
                </div>
              )}

              {maintenance.returnDate && (
                <div>
                  <p style={velFieldLabel}>Data de Retorno</p>
                  <p style={velFieldValue}>
                    <Calendar size={16} color="#16a34a" />
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "long",
                    }).format(new Date(maintenance.returnDate))}
                  </p>
                </div>
              )}

              {maintenance.location && (
                <div>
                  <p style={velFieldLabel}>Oficina</p>
                  <p style={velFieldValue}>
                    <MapPin size={16} color="#dc2626" />
                    {maintenance.location}
                  </p>
                </div>
              )}

              {maintenance.seiProcessNumber && (
                <div>
                  <p style={velFieldLabel}>Processo SEI</p>
                  <p style={{ ...velFieldValue, fontFamily: "'Barlow', sans-serif" }}>
                    <FileText size={16} color="#2563eb" />
                    <span style={{ fontFamily: "monospace" }}>{maintenance.seiProcessNumber}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {maintenance.notes && (
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 16 }}>
              <p style={velFieldLabel}>Observacoes</p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "#1a1a1a", margin: 0 }}>
                {maintenance.notes}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 12 }}>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "#999", margin: 0 }}>
              Criado em:{" "}
              {new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              }).format(new Date(maintenance.createdAt))}
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "#999", margin: "4px 0 0 0" }}>
              Ultima atualizacao:{" "}
              {new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              }).format(new Date(maintenance.updatedAt))}
            </p>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div style={velPanel}>
        <div style={{ marginBottom: 16 }}>
          <span style={velSectionLabel}>Viatura</span>
          <div style={{ width: 24, height: 2, background: "#dc2626", marginTop: 6 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: "#1a1a1a",
                margin: 0,
              }}
            >
              {maintenance.vehicle.operationalPrefix}
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "#999", margin: "2px 0 0 0" }}>
              {maintenance.vehicle.brand} {maintenance.vehicle.model}
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#999", margin: "2px 0 0 0" }}>
              {maintenance.vehicle.plate}
            </p>
          </div>
          <button
            style={velBtnOutline}
            onClick={() => navigate(`/vehicles/${maintenance.vehicle._id}`)}
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}

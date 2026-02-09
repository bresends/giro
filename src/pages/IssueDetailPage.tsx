import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Loading } from "../components/common/Loading";
import { IssueStatusBadge } from "../components/issues/IssueStatusBadge";
import { IssueSeverityBadge } from "../components/issues/IssueSeverityBadge";

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

const velLink: React.CSSProperties = {
  fontFamily: "'Barlow', sans-serif",
  fontSize: 15,
  fontWeight: 600,
  color: "#2563eb",
  margin: 0,
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: 0,
  textDecoration: "none",
};

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
      "Tem certeza que deseja deletar este problema? Esta acao nao pode ser desfeita."
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
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <p style={{ color: "#dc2626", fontFamily: "'Barlow', sans-serif" }}>
          ID do problema nao fornecido
        </p>
      </div>
    );
  }

  if (issue === undefined) {
    return <Loading text="Carregando detalhes do problema..." />;
  }

  if (issue === null) {
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
          Problema nao encontrado
        </h3>
        <button style={velBtnPrimary} onClick={() => navigate("/issues")}>
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
          <button style={velBtnBack} onClick={() => navigate("/issues")}>
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
            {issue.title}
          </h1>
          {issue.vehicle && (
            <p style={{ color: "#999", fontFamily: "'Barlow', sans-serif", fontSize: 14, marginTop: 2 }}>
              {issue.vehicle.operationalPrefix} - {issue.vehicle.plate}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={velBtnPrimary} onClick={() => navigate(`/issues/${id}/edit`)}>
            <Pencil size={14} />
            Editar
          </button>
          <button style={velBtnDanger} onClick={handleDelete}>
            <Trash2 size={14} />
            Deletar
          </button>
        </div>
      </div>

      {/* Issue Info */}
      <div style={velPanel}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <span style={velSectionLabel}>Informacoes do Problema</span>
            <div style={{ width: 24, height: 2, background: "#dc2626", marginTop: 6 }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <IssueStatusBadge status={issue.status} />
            <IssueSeverityBadge severity={issue.severity} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Description */}
          <div>
            <p style={velFieldLabel}>Descricao</p>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 15,
                color: "#1a1a1a",
                margin: 0,
                whiteSpace: "pre-wrap",
              }}
            >
              {issue.description}
            </p>
          </div>

          {/* Info Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
            <div>
              <p style={velFieldLabel}>Data de Reporte</p>
              <p style={velFieldValue}>
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(new Date(issue.reportedDate))}
              </p>
            </div>

            {issue.resolvedDate && (
              <div>
                <p style={velFieldLabel}>Data de Resolucao</p>
                <p style={{ ...velFieldValue, color: "#16a34a" }}>
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(issue.resolvedDate))}
                </p>
              </div>
            )}

            {issue.vehicle && (
              <div>
                <p style={velFieldLabel}>Viatura</p>
                <button
                  style={velLink}
                  onClick={() => navigate(`/vehicles/${issue.vehicle?._id}`)}
                >
                  {issue.vehicle.operationalPrefix} -{" "}
                  {issue.vehicle.plate}
                </button>
              </div>
            )}

            {issue.maintenanceRecord && (
              <div>
                <p style={velFieldLabel}>Manutencao Vinculada</p>
                <button
                  style={velLink}
                  onClick={() =>
                    navigate(`/maintenance/${issue.maintenanceRecordId}`)
                  }
                >
                  Ver Manutencao
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

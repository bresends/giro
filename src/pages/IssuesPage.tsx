import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Loading } from "../components/common/Loading";
import { IssueList } from "../components/issues/IssueList";
import { useState } from "react";
import { SimpleSelect } from "../components/common/SimpleSelect";

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

const velSectionLabel: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  fontSize: 10,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#999",
};

export function IssuesPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("");

  const issues = useQuery(api.vehicleIssues.list, {
    status: statusFilter
      ? (statusFilter as "open" | "in_progress" | "resolved" | "closed")
      : undefined,
    severity: severityFilter
      ? (severityFilter as "low" | "medium" | "high" | "critical")
      : undefined,
  });

  if (issues === undefined) {
    return <Loading text="Carregando problemas..." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 28,
              color: "#1a1a1a",
              letterSpacing: "0.04em",
              margin: 0,
            }}
          >
            Problemas
          </h1>
          <p style={{ color: "#999", fontFamily: "'Barlow', sans-serif", fontSize: 14, marginTop: 4 }}>
            Gerencie os problemas e defeitos da frota
          </p>
        </div>
        <button onClick={() => navigate("/issues/new")} style={velBtnPrimary}>
          <Plus size={16} />
          Novo Problema
        </button>
      </div>

      {/* Filters */}
      <div style={velPanel}>
        <div style={{ marginBottom: 12 }}>
          <span style={velSectionLabel}>Filtros</span>
          <div style={{ width: 24, height: 2, background: "#dc2626", marginTop: 6 }} />
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ width: 240 }}>
            <SimpleSelect
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "", label: "Todos" },
                { value: "open", label: "Aberto" },
                { value: "in_progress", label: "Em Andamento" },
                { value: "resolved", label: "Resolvido" },
                { value: "closed", label: "Fechado" },
              ]}
            />
          </div>

          <div style={{ width: 240 }}>
            <SimpleSelect
              label="Gravidade"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              options={[
                { value: "", label: "Todas" },
                { value: "low", label: "Baixa" },
                { value: "medium", label: "Media" },
                { value: "high", label: "Alta" },
                { value: "critical", label: "Critica" },
              ]}
            />
          </div>

          {(statusFilter || severityFilter) && (
            <button
              style={velBtnOutline}
              onClick={() => {
                setStatusFilter("");
                setSeverityFilter("");
              }}
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Issue List */}
      <IssueList issues={issues} />
    </div>
  );
}

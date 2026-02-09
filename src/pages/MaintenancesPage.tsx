import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SimpleSelect } from "../components/common/SimpleSelect";
import { MaintenanceTable } from "../components/maintenance/MaintenanceTable";
import { Loading } from "../components/common/Loading";
import { Plus, Wrench, Calendar, CheckCircle } from "lucide-react";

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

const velSectionLabel: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  fontSize: 10,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#999",
};

export function MaintenancesPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<
    "all" | "awaiting_ceman" | "in_progress" | "completed" | "cancelled"
  >("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "preventive" | "corrective"
  >("all");

  const allMaintenances = useQuery(api.maintenanceRecords.list, {});

  if (allMaintenances === undefined) {
    return <Loading text="Carregando manutencoes..." />;
  }

  // Apply filters
  const filteredMaintenances = allMaintenances.filter((m) => {
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    if (typeFilter !== "all" && m.type !== typeFilter) return false;
    return true;
  });

  // Calculate statistics
  const stats = {
    total: allMaintenances.length,
    awaitingCeman: allMaintenances.filter((m) => m.status === "awaiting_ceman").length,
    inProgress: allMaintenances.filter((m) => m.status === "in_progress").length,
    completed: allMaintenances.filter((m) => m.status === "completed").length,
  };

  const statCards = [
    { label: "Total", value: stats.total, icon: Wrench, color: "#999", accent: "rgba(0,0,0,0.04)" },
    { label: "Aguardando CEMAN", value: stats.awaitingCeman, icon: Calendar, color: "#2563eb", accent: "rgba(37,99,235,0.06)" },
    { label: "Em Andamento", value: stats.inProgress, icon: Wrench, color: "#ea580c", accent: "rgba(234,88,12,0.06)" },
    { label: "Concluidas", value: stats.completed, icon: CheckCircle, color: "#16a34a", accent: "rgba(22,163,74,0.06)" },
  ];

  const tableTitle =
    statusFilter === "all"
      ? "Todas as Manutencoes"
      : statusFilter === "awaiting_ceman"
      ? "Aguardando CEMAN"
      : statusFilter === "in_progress"
      ? "Manutencoes em Andamento"
      : statusFilter === "completed"
      ? "Manutencoes Concluidas"
      : "Manutencoes Canceladas";

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
            Manutencoes
          </h1>
          <p style={{ color: "#999", fontFamily: "'Barlow', sans-serif", fontSize: 14, marginTop: 4 }}>
            Gerencie o historico de manutencoes da frota
          </p>
        </div>
        <button onClick={() => navigate("/maintenance/new")} style={velBtnPrimary}>
          <Plus size={16} />
          Nova Manutencao
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        {statCards.map((s) => (
          <div
            key={s.label}
            style={{
              ...velPanel,
              borderLeft: `3px solid ${s.color}`,
              padding: "16px 20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ ...velSectionLabel, margin: 0 }}>{s.label}</p>
                <p
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 28,
                    color: s.color,
                    margin: "4px 0 0 0",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </p>
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: s.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  clipPath:
                    "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
                }}
              >
                <s.icon size={18} color={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={velPanel}>
        <div style={{ marginBottom: 12 }}>
          <span style={velSectionLabel}>Filtros</span>
          <div style={{ width: 24, height: 2, background: "#dc2626", marginTop: 6 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          <SimpleSelect
            label="Status"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as typeof statusFilter
              )
            }
            options={[
              { value: "all", label: "Todos" },
              { value: "awaiting_ceman", label: "Aguardando CEMAN" },
              { value: "in_progress", label: "Em Andamento" },
              { value: "completed", label: "Concluidas" },
              { value: "cancelled", label: "Canceladas" },
            ]}
          />

          <SimpleSelect
            label="Tipo"
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as typeof typeFilter)
            }
            options={[
              { value: "all", label: "Todos" },
              { value: "preventive", label: "Preventiva" },
              { value: "corrective", label: "Corretiva" },
            ]}
          />
        </div>
      </div>

      {/* Maintenance Table */}
      <div style={velPanel}>
        <div style={{ marginBottom: 16 }}>
          <span style={velSectionLabel}>{tableTitle}</span>
          <div style={{ width: 24, height: 2, background: "#dc2626", marginTop: 6 }} />
        </div>
        <MaintenanceTable maintenances={filteredMaintenances} />
      </div>
    </div>
  );
}

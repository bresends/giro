import { useState } from "react";
import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { SimpleSelect } from "../components/common/SimpleSelect";
import { VehicleList } from "../components/vehicles/VehicleList";
import { Loading } from "../components/common/Loading";
import { Plus, Truck, CheckCircle, Wrench, Briefcase } from "lucide-react";

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

export function VehiclesPage() {
  const navigate = useNavigate();
  const [maintenanceFilter, setMaintenanceFilter] = useState<
    "all" | "active" | "maintenance"
  >("all");
  const [serviceFilter, setServiceFilter] = useState<
    "all" | "operational" | "backup"
  >("all");

  const vehicles = useQuery(
    api.vehicles.list,
    maintenanceFilter === "all" && serviceFilter === "all"
      ? {}
      : maintenanceFilter === "active"
      ? { inMaintenance: false, ...(serviceFilter !== "all" ? { serviceType: serviceFilter } : {}) }
      : maintenanceFilter === "maintenance"
      ? { inMaintenance: true, ...(serviceFilter !== "all" ? { serviceType: serviceFilter } : {}) }
      : serviceFilter !== "all"
      ? { serviceType: serviceFilter }
      : {}
  );

  const stats = useQuery(api.vehicles.getStats);

  if (vehicles === undefined || stats === undefined) {
    return <Loading text="Carregando viaturas..." />;
  }

  const statCards = [
    { label: "Total", value: stats.total, icon: Truck, color: "#999", accent: "rgba(0,0,0,0.04)" },
    { label: "Ativas", value: stats.active, sub: `${stats.activePercentage}%`, icon: CheckCircle, color: "#16a34a", accent: "rgba(22,163,74,0.06)" },
    { label: "Manutencao", value: stats.inMaintenance, sub: `${stats.inMaintenancePercentage}%`, icon: Wrench, color: "#ea580c", accent: "rgba(234,88,12,0.06)" },
    { label: "Operacionais", value: stats.operational, sub: `${stats.backup} backup`, icon: Briefcase, color: "#2563eb", accent: "rgba(37,99,235,0.06)" },
  ];

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
            Viaturas
          </h1>
          <p style={{ color: "#999", fontFamily: "'Barlow', sans-serif", fontSize: 14, marginTop: 4 }}>
            Gerencie todas as viaturas da frota
          </p>
        </div>
        <button onClick={() => navigate("/vehicles/new")} style={velBtnPrimary}>
          <Plus size={16} />
          Nova Viatura
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
                <p style={velSectionLabel}>{s.label}</p>
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
                {s.sub && (
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: "#999", marginTop: 2 }}>
                    {s.sub}
                  </p>
                )}
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#1a1a1a",
                whiteSpace: "nowrap",
              }}
            >
              Status:
            </span>
            <div style={{ flex: 1 }}>
              <SimpleSelect
                value={maintenanceFilter}
                onChange={(e) =>
                  setMaintenanceFilter(
                    e.target.value as typeof maintenanceFilter
                  )
                }
                options={[
                  { value: "all", label: "Todas" },
                  { value: "active", label: "Ativas" },
                  { value: "maintenance", label: "Em Manutencao" },
                ]}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#1a1a1a",
                whiteSpace: "nowrap",
              }}
            >
              Servico:
            </span>
            <div style={{ flex: 1 }}>
              <SimpleSelect
                value={serviceFilter}
                onChange={(e) =>
                  setServiceFilter(
                    e.target.value as typeof serviceFilter
                  )
                }
                options={[
                  { value: "all", label: "Todos" },
                  { value: "operational", label: "Operacional" },
                  { value: "backup", label: "Backup" },
                ]}
              />
            </div>
          </div>
        </div>
        {(maintenanceFilter !== "all" || serviceFilter !== "all") && (
          <div style={{ marginTop: 12 }}>
            <button
              style={velBtnOutline}
              onClick={() => {
                setMaintenanceFilter("all");
                setServiceFilter("all");
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Vehicle List */}
      <VehicleList vehicles={vehicles as any} />
    </div>
  );
}

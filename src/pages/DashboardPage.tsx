import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { StatCard } from "../components/dashboard/StatCard";
import { VehicleList } from "../components/vehicles/VehicleList";
import { AlertsSection } from "../components/alerts/AlertsSection";
import { Loading } from "../components/common/Loading";
import { Truck, CheckCircle, Wrench, Briefcase, AlertTriangle, ShieldCheck, ExternalLink } from "lucide-react";

const velPanel: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(0,0,0,0.06)",
  padding: "24px",
  clipPath:
    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
};

const velSectionLabel: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  fontSize: 10,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#999",
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

export function DashboardPage() {
  const navigate = useNavigate();
  const stats = useQuery(api.vehicles.getStats);
  const allVehicles = useQuery(api.vehicles.list, {});
  const alerts = useQuery(api.alerts.getMaintenanceAlerts);
  const alertsSummary = useQuery(api.alerts.getAlertsSummary);

  if (stats === undefined || allVehicles === undefined || alerts === undefined || alertsSummary === undefined) {
    return <Loading text="Carregando dashboard..." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Page Title */}
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
          Dashboard
        </h1>
        <p style={{ color: "#999", fontFamily: "'Barlow', sans-serif", fontSize: 14, marginTop: 4 }}>
          Visao geral da frota
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard
          title="Total de Viaturas"
          value={stats.total}
          icon={Truck}
          iconColor="#2563eb"
        />
        <StatCard
          title="Ativas"
          value={stats.active}
          subtitle={`${stats.activePercentage}% da frota`}
          icon={CheckCircle}
          iconColor="#16a34a"
        />
        <StatCard
          title="Em Manutencao"
          value={stats.inMaintenance}
          subtitle={`${stats.inMaintenancePercentage}% da frota`}
          icon={Wrench}
          iconColor="#ea580c"
        />
        <StatCard
          title="Operacionais"
          value={stats.operational}
          subtitle={`${stats.backup} em backup`}
          icon={Briefcase}
          iconColor="#2563eb"
        />
        <StatCard
          title="Alertas"
          value={alertsSummary.total}
          subtitle={alertsSummary.critical > 0 ? `${alertsSummary.critical} criticos` : "Tudo em ordem"}
          icon={AlertTriangle}
          iconColor={alertsSummary.critical > 0 ? "#dc2626" : alertsSummary.high > 0 ? "#ea580c" : "#16a34a"}
        />
      </div>

      {/* Guarita Access Panel */}
      <div
        style={{
          ...velPanel,
          borderLeft: "3px solid #2563eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              clipPath:
                "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
            }}
          >
            <ShieldCheck size={28} color="#fff" />
          </div>
          <div>
            <h3
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                fontSize: 16,
                color: "#1a1a1a",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Sistema Guarita
              <ExternalLink size={14} color="#999" />
            </h3>
            <p style={{ color: "#999", fontFamily: "'Barlow', sans-serif", fontSize: 13, marginTop: 2 }}>
              Controle de saidas e chegadas de viaturas
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/guarita")}
          style={{
            ...velBtnPrimary,
            background: "#2563eb",
          }}
        >
          <ShieldCheck size={16} />
          Acessar Guarita
        </button>
      </div>

      {/* Alerts Section */}
      {alertsSummary.hasAlerts && (
        <div style={velPanel}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={18} color="#ea580c" />
            <span style={velSectionLabel}>Alertas de Manutencao</span>
          </div>
          <div style={{ width: 24, height: 2, background: "#dc2626", marginBottom: 16 }} />
          <AlertsSection alerts={alerts} />
        </div>
      )}

      {/* Vehicles List */}
      <div style={velPanel}>
        <div style={{ marginBottom: 16 }}>
          <span style={velSectionLabel}>Todas as Viaturas</span>
          <div style={{ width: 24, height: 2, background: "#dc2626", marginTop: 8 }} />
        </div>
        <VehicleList vehicles={allVehicles as any} />
      </div>
    </div>
  );
}

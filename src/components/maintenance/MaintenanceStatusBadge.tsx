interface MaintenanceStatusBadgeProps {
  status: "awaiting_ceman" | "in_progress" | "completed" | "cancelled";
}

const velBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "2px 10px",
  fontSize: 10,
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  clipPath:
    "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
};

export function MaintenanceStatusBadge({ status }: MaintenanceStatusBadgeProps) {
  const statusConfig = {
    awaiting_ceman: {
      label: "Aguardando CEMAN",
      bg: "rgba(37,99,235,0.08)",
      color: "#2563eb",
    },
    in_progress: {
      label: "Em Andamento",
      bg: "rgba(234,179,8,0.08)",
      color: "#ca8a04",
    },
    completed: {
      label: "Concluída",
      bg: "rgba(22,163,74,0.08)",
      color: "#16a34a",
    },
    cancelled: {
      label: "Cancelada",
      bg: "rgba(220,38,38,0.08)",
      color: "#dc2626",
    },
  };

  const config = statusConfig[status];

  return (
    <span style={{ ...velBadge, background: config.bg, color: config.color }}>
      {config.label}
    </span>
  );
}

interface MaintenanceTypeBadgeProps {
  type: "preventive" | "corrective";
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

export function MaintenanceTypeBadge({ type }: MaintenanceTypeBadgeProps) {
  const typeConfig = {
    preventive: {
      label: "Preventiva",
      bg: "rgba(37,99,235,0.08)",
      color: "#2563eb",
    },
    corrective: {
      label: "Corretiva",
      bg: "rgba(249,115,22,0.08)",
      color: "#ea580c",
    },
  };

  const config = typeConfig[type];

  return (
    <span style={{ ...velBadge, background: config.bg, color: config.color }}>
      {config.label}
    </span>
  );
}

interface VehicleServiceBadgeProps {
  serviceType: "operational" | "backup";
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

export function VehicleServiceBadge({ serviceType }: VehicleServiceBadgeProps) {
  const config = {
    operational: {
      label: "Operacional",
      bg: "rgba(37,99,235,0.08)",
      color: "#2563eb",
    },
    backup: {
      label: "Backup",
      bg: "rgba(0,0,0,0.04)",
      color: "#999",
    },
  };

  const { label, bg, color } = config[serviceType];

  return (
    <span style={{ ...velBadge, background: bg, color }}>
      {label}
    </span>
  );
}

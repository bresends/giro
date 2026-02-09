interface VehicleActivityBadgeProps {
  inMaintenance: boolean;
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

export function VehicleActivityBadge({ inMaintenance }: VehicleActivityBadgeProps) {
  if (inMaintenance) {
    return (
      <span style={{ ...velBadge, background: "rgba(249,115,22,0.08)", color: "#ea580c" }}>
        Em Manutenção
      </span>
    );
  }

  return (
    <span style={{ ...velBadge, background: "rgba(22,163,74,0.08)", color: "#16a34a" }}>
      Ativa
    </span>
  );
}

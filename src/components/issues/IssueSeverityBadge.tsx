interface IssueSeverityBadgeProps {
  severity: "low" | "medium" | "high" | "critical";
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

export function IssueSeverityBadge({ severity }: IssueSeverityBadgeProps) {
  const variants = {
    low: { label: "Baixa", bg: "rgba(37,99,235,0.08)", color: "#2563eb" },
    medium: { label: "Média", bg: "rgba(234,179,8,0.08)", color: "#ca8a04" },
    high: { label: "Alta", bg: "rgba(249,115,22,0.08)", color: "#ea580c" },
    critical: { label: "Crítica", bg: "rgba(220,38,38,0.08)", color: "#dc2626" },
  };

  const variant = variants[severity];

  return (
    <span style={{ ...velBadge, background: variant.bg, color: variant.color }}>
      {variant.label}
    </span>
  );
}

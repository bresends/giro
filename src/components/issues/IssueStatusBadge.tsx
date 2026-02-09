import { AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";

interface IssueStatusBadgeProps {
  status: "open" | "in_progress" | "resolved" | "closed";
}

const velBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "2px 10px",
  fontSize: 10,
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  clipPath:
    "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
};

export function IssueStatusBadge({ status }: IssueStatusBadgeProps) {
  const variants = {
    open: {
      label: "Aberto",
      icon: AlertCircle,
      bg: "rgba(220,38,38,0.08)",
      color: "#dc2626",
    },
    in_progress: {
      label: "Em Andamento",
      icon: Clock,
      bg: "rgba(37,99,235,0.08)",
      color: "#2563eb",
    },
    resolved: {
      label: "Resolvido",
      icon: CheckCircle,
      bg: "rgba(22,163,74,0.08)",
      color: "#16a34a",
    },
    closed: {
      label: "Fechado",
      icon: XCircle,
      bg: "rgba(0,0,0,0.04)",
      color: "#999",
    },
  };

  const variant = variants[status];
  const Icon = variant.icon;

  return (
    <span style={{ ...velBadge, background: variant.bg, color: variant.color }}>
      <Icon size={12} />
      {variant.label}
    </span>
  );
}

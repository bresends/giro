import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";

interface IssueStatusBadgeProps {
  status: "open" | "in_progress" | "resolved" | "closed";
}

export function IssueStatusBadge({ status }: IssueStatusBadgeProps) {
  const variants = {
    open: {
      label: "Aberto",
      icon: AlertCircle,
      className: "bg-giro-accent-soft text-giro-accent-soft-foreground",
    },
    in_progress: {
      label: "Em Andamento",
      icon: Clock,
      className: "bg-giro-neutral text-giro-neutral-foreground",
    },
    resolved: {
      label: "Resolvido",
      icon: CheckCircle,
      className: "bg-giro-success-soft text-giro-success-soft-foreground",
    },
    closed: {
      label: "Fechado",
      icon: XCircle,
      className: "bg-giro-neutral text-giro-neutral-foreground",
    },
  };

  const variant = variants[status];
  const Icon = variant.icon;

  return (
    <Badge variant="secondary" className={`${variant.className} gap-1`}>
      <Icon className="w-3 h-3" />
      {variant.label}
    </Badge>
  );
}

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
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
    in_progress: {
      label: "Em Andamento",
      icon: Clock,
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    resolved: {
      label: "Resolvido",
      icon: CheckCircle,
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    closed: {
      label: "Fechado",
      icon: XCircle,
      className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
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

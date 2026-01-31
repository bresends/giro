import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Loading } from "../components/common/Loading";
import { IssueList } from "../components/issues/IssueList";
import { useState } from "react";
import { SimpleSelect } from "../components/common/SimpleSelect";

export function IssuesPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("");

  const issues = useQuery(api.vehicleIssues.list, {
    status: statusFilter
      ? (statusFilter as "open" | "in_progress" | "resolved" | "closed")
      : undefined,
    severity: severityFilter
      ? (severityFilter as "low" | "medium" | "high" | "critical")
      : undefined,
  });

  if (issues === undefined) {
    return <Loading text="Carregando problemas..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Problemas</h1>
          <p className="text-muted-foreground">
            Gerencie os problemas e defeitos da frota
          </p>
        </div>
        <Button onClick={() => navigate("/issues/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Problema
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 items-end">
        <div className="w-64">
          <SimpleSelect
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "", label: "Todos" },
              { value: "open", label: "Aberto" },
              { value: "in_progress", label: "Em Andamento" },
              { value: "resolved", label: "Resolvido" },
              { value: "closed", label: "Fechado" },
            ]}
          />
        </div>

        <div className="w-64">
          <SimpleSelect
            label="Gravidade"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            options={[
              { value: "", label: "Todas" },
              { value: "low", label: "Baixa" },
              { value: "medium", label: "Média" },
              { value: "high", label: "Alta" },
              { value: "critical", label: "Crítica" },
            ]}
          />
        </div>

        {(statusFilter || severityFilter) && (
          <Button
            variant="outline"
            onClick={() => {
              setStatusFilter("");
              setSeverityFilter("");
            }}
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Lista de Problemas */}
      <IssueList issues={issues} />
    </div>
  );
}

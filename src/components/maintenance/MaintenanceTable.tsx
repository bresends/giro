import { useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MaintenanceStatusBadge } from "./MaintenanceStatusBadge";
import { MaintenanceTypeBadge } from "./MaintenanceTypeBadge";
import { Eye, Pencil, Trash2, MoreVertical, CheckCircle, Clock, XCircle, Calendar } from "lucide-react";
import { Wrench } from "lucide-react";

interface MaintenanceTableProps {
  maintenances: Array<{
    _id: Id<"maintenanceRecords">;
    type: "preventive" | "corrective";
    status: "awaiting_ceman" | "in_progress" | "completed" | "cancelled";
    seiProcessNumber?: string;
    sentDate?: number;
    returnDate?: number;
    location?: string;
    kmAtMaintenance: number;
    description: string;
    vehicle: {
      _id: Id<"vehicles">;
      operationalPrefix: string;
      plate: string;
      brand: string;
      model: string;
      type?: {
        name: string;
        description: string;
      };
    };
  }>;
}

const thStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: 10,
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#999",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  padding: "12px",
  fontSize: 13,
  fontFamily: "'Barlow', sans-serif",
  color: "#1a1a1a",
  borderBottom: "1px solid rgba(0,0,0,0.04)",
};

export function MaintenanceTable({ maintenances }: MaintenanceTableProps) {
  const navigate = useNavigate();
  const updateStatus = useMutation(api.maintenanceRecords.updateStatus);
  const deleteMaintenance = useMutation(api.maintenanceRecords.remove);

  const handleStatusChange = async (
    id: Id<"maintenanceRecords">,
    status: "awaiting_ceman" | "in_progress" | "completed" | "cancelled"
  ) => {
    try {
      await updateStatus({ id, status });
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Erro ao atualizar status"
      );
    }
  };

  const handleDelete = async (id: Id<"maintenanceRecords">) => {
    const confirmed = window.confirm(
      "Tem certeza que deseja deletar este registro de manutenção?"
    );

    if (confirmed) {
      try {
        await deleteMaintenance({ id });
      } catch (error) {
        alert(error instanceof Error ? error.message : "Erro ao deletar");
      }
    }
  };

  if (maintenances.length === 0) {
    return (
      <div className="text-center py-12">
        <Wrench size={48} className="mx-auto mb-4" style={{ color: "#ccc" }} />
        <h3
          className="text-sm mb-1"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#999",
          }}
        >
          Nenhuma manutenção encontrada
        </h3>
        <p className="text-xs text-[#999]" style={{ fontFamily: "'Barlow', sans-serif" }}>
          Registre manutenções para acompanhar o histórico da frota
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "rgba(0,0,0,0.02)" }}>
            <th style={thStyle}>Viatura</th>
            <th style={thStyle}>Processo SEI</th>
            <th style={thStyle}>Tipo</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Descrição</th>
            <th style={thStyle}>Datas</th>
            <th style={thStyle}>Oficina</th>
            <th style={thStyle}>KM</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {maintenances.map((maintenance) => (
            <tr
              key={maintenance._id}
              className="hover:bg-black/[0.02] transition-colors"
            >
              <td style={tdStyle}>
                <div>
                  <p className="font-semibold text-sm">{maintenance.vehicle.operationalPrefix}</p>
                  <p className="text-[11px] text-[#999]">{maintenance.vehicle.plate}</p>
                </div>
              </td>
              <td style={tdStyle}>
                <p className="text-xs font-mono text-[#999]">
                  {maintenance.seiProcessNumber || <span style={{ color: "#dc2626" }}>—</span>}
                </p>
              </td>
              <td style={tdStyle}>
                <MaintenanceTypeBadge type={maintenance.type} />
              </td>
              <td style={tdStyle}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="cursor-pointer hover:opacity-80 transition-opacity">
                      <MaintenanceStatusBadge status={maintenance.status} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(maintenance._id, "awaiting_ceman")}
                      className="gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Aguardando CEMAN
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(maintenance._id, "in_progress")}
                      className="gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Em Andamento
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(maintenance._id, "completed")}
                      className="gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Concluída
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(maintenance._id, "cancelled")}
                      className="gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancelada
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
              <td style={tdStyle}>
                <p className="text-xs max-w-xs truncate">{maintenance.description}</p>
              </td>
              <td style={tdStyle}>
                <div className="text-[11px] text-[#999]">
                  {maintenance.sentDate && (
                    <p>
                      Envio:{" "}
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                      }).format(new Date(maintenance.sentDate))}
                    </p>
                  )}
                  {maintenance.returnDate && (
                    <p>
                      Retorno:{" "}
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                      }).format(new Date(maintenance.returnDate))}
                    </p>
                  )}
                </div>
              </td>
              <td style={tdStyle}>
                <p className="text-xs text-[#999]">
                  {maintenance.location || <span style={{ color: "#dc2626" }}>—</span>}
                </p>
              </td>
              <td style={tdStyle}>
                <p className="text-xs" style={{ color: "#2563eb" }}>
                  {new Intl.NumberFormat("pt-BR").format(maintenance.kmAtMaintenance)}
                </p>
              </td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="p-1 cursor-pointer hover:bg-black/5 transition-colors"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                      }}
                    >
                      <MoreVertical size={16} style={{ color: "#999" }} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate(`/maintenance/${maintenance._id}`)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate(`/maintenance/${maintenance._id}/edit`)}
                      className="gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(maintenance._id)}
                      className="gap-2 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

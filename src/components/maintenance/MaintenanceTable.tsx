import { useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
        <Wrench className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">
          Nenhuma manutenção encontrada
        </h3>
        <p className="text-muted-foreground">
          Registre manutenções para acompanhar o histórico da frota
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Viatura</TableHead>
            <TableHead>Processo SEI</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Datas</TableHead>
            <TableHead>Oficina</TableHead>
            <TableHead>KM</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenances.map((maintenance) => (
            <TableRow key={maintenance._id}>
              <TableCell>
                <div>
                  <p className="font-medium">{maintenance.vehicle.operationalPrefix}</p>
                  <p className="text-sm text-muted-foreground">
                    {maintenance.vehicle.plate}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm font-mono">
                  {maintenance.seiProcessNumber || "-"}
                </p>
              </TableCell>
              <TableCell>
                <MaintenanceTypeBadge type={maintenance.type} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
                      <MaintenanceStatusBadge status={maintenance.status} />
                    </Button>
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
              </TableCell>
              <TableCell>
                <p className="max-w-xs truncate">{maintenance.description}</p>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {maintenance.sentDate && (
                    <p className="text-muted-foreground">
                      Envio:{" "}
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                      }).format(new Date(maintenance.sentDate))}
                    </p>
                  )}
                  {maintenance.returnDate && (
                    <p className="text-muted-foreground">
                      Retorno:{" "}
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                      }).format(new Date(maintenance.returnDate))}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">
                  {maintenance.location || "-"}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-sm">
                  {new Intl.NumberFormat("pt-BR").format(
                    maintenance.kmAtMaintenance
                  )}
                </p>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

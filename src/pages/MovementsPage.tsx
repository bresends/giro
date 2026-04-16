import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimpleSelect } from "../components/common/SimpleSelect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loading } from "../components/common/Loading";
import { EditMovementModal } from "../components/guarita/EditMovementModal";
import { getVehicleTypeColor } from "@/lib/utils";
import {
  ArrowLeftRight,
  AlertCircle,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";

interface Movement {
  _id: Id<"vehicleMovements">;
  vehicleId: Id<"vehicles">;
  personnelId: Id<"personnel">;
  destination: string;
  destinationType?: string;
  departureKm: number;
  departureTime: number;
  arrivalKm?: number;
  arrivalTime?: number;
  status: string;
  notes?: string;
  registeredByDepartureName?: string | null;
  vehicle: {
    _id: Id<"vehicles">;
    operationalPrefix: string;
    plate: string;
    type?: string;
  } | null;
  personnel: {
    _id: Id<"personnel">;
    rank: string;
    rg: number;
    name: string;
  } | null;
}

export function MovementsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "em_transito" | "concluido"
  >("all");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(
    null,
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    movementId: Id<"vehicleMovements"> | null;
  }>({ open: false, movementId: null });

  const deleteMovement = useMutation(api.vehicleMovements.remove);
  const vehicles = useQuery(api.vehicles.listSimple, {});

  // Build query args
  const queryArgs: {
    startDate?: number;
    endDate?: number;
    vehicleId?: Id<"vehicles">;
    status?: "em_transito" | "concluido";
  } = {};

  if (startDate) {
    queryArgs.startDate = new Date(startDate + "T00:00:00").getTime();
  }
  if (endDate) {
    // End of the selected day
    queryArgs.endDate = new Date(endDate + "T23:59:59.999").getTime();
  }
  if (vehicleFilter !== "all") {
    queryArgs.vehicleId = vehicleFilter as Id<"vehicles">;
  }
  if (statusFilter !== "all") {
    queryArgs.status = statusFilter;
  }

  const movements = useQuery(api.vehicleMovements.listFiltered, queryArgs);

  if (movements === undefined || vehicles === undefined) {
    return <Loading text="Carregando movimentacoes..." />;
  }

  const hasFilters =
    startDate || endDate || vehicleFilter !== "all" || statusFilter !== "all";

  // Stats
  const totalCount = movements.length;
  const inTransitCount = movements.filter(
    (m) => m.status === "em_transito",
  ).length;
  const completedCount = movements.filter(
    (m) => m.status === "concluido",
  ).length;
  const anomalyCount = movements.filter((m) => {
    if (m.status !== "concluido" || !m.arrivalKm) return false;
    const distance = m.arrivalKm - m.departureKm;
    return distance === 0 || distance > 500;
  }).length;

  // Vehicle options for filter
  const vehicleOptions = [
    { value: "all", label: "Todas" },
    ...vehicles.map((v) => ({
      value: v._id,
      label: `${v.operationalPrefix} - ${v.plate}`,
    })),
  ];

  const statusOptions = [
    { value: "all", label: "Todos" },
    { value: "em_transito", label: "Em Transito" },
    { value: "concluido", label: "Concluido" },
  ];

  function handleEditClick(movement: Movement) {
    setSelectedMovement(movement);
    setEditModalOpen(true);
  }

  function handleDeleteClick(movementId: Id<"vehicleMovements">) {
    setDeleteConfirm({ open: true, movementId });
  }

  async function handleConfirmDelete() {
    if (deleteConfirm.movementId) {
      await deleteMovement({ id: deleteConfirm.movementId });
    }
    setDeleteConfirm({ open: false, movementId: null });
  }

  function clearFilters() {
    setStartDate("");
    setEndDate("");
    setVehicleFilter("all");
    setStatusFilter("all");
  }

  function isAnomalousKm(movement: Movement): boolean {
    if (movement.status !== "concluido" || !movement.arrivalKm) return false;
    const distance = movement.arrivalKm - movement.departureKm;
    return distance === 0 || distance > 500;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Movimentacoes</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie e corrija movimentacoes de viaturas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{totalCount}</p>
              </div>
              <ArrowLeftRight className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Transito</p>
                <p className="text-2xl font-bold text-orange-600">
                  {inTransitCount}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Concluidos</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedCount}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        {anomalyCount > 0 && (
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">KM Suspeito</p>
                  <p className="text-2xl font-bold text-red-600">
                    {anomalyCount}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-1.5">
              <Label>Data Inicio</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Data Fim</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Viatura</Label>
              <SimpleSelect
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                options={vehicleOptions}
                placeholder="Todas"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <SimpleSelect
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | "em_transito" | "concluido"
                  )
                }
                options={statusOptions}
                placeholder="Todos"
              />
            </div>
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Movements Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Movimentacoes{" "}
            {hasFilters ? `(${movements.length} resultados)` : "(ultimas 100)"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {movements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-2" />
              <p>Nenhuma movimentacao encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Viatura</TableHead>
                    <TableHead>Motorista</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead className="text-right">KM Saida</TableHead>
                    <TableHead className="text-right">KM Chegada</TableHead>
                    <TableHead className="text-right">Distancia</TableHead>
                    <TableHead>Registrado por</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((movement) => {
                    const distance = movement.arrivalKm
                      ? movement.arrivalKm - movement.departureKm
                      : null;

                    const departureDate = new Date(movement.departureTime);
                    const dateStr = departureDate.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    });
                    const timeStr = departureDate.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    const anomalous = isAnomalousKm(movement);

                    return (
                      <TableRow
                        key={movement._id}
                        className={
                          anomalous
                            ? "bg-red-50 dark:bg-red-950/20"
                            : movement.status === "em_transito"
                              ? "bg-orange-50 dark:bg-orange-950/20"
                              : ""
                        }
                      >
                        <TableCell className="font-medium whitespace-nowrap">
                          {dateStr} {timeStr}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getVehicleTypeColor(
                              movement.vehicle?.type,
                            )}
                          >
                            {movement.vehicle?.operationalPrefix}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {movement.personnel?.rank}{" "}
                          {movement.personnel?.name}
                        </TableCell>
                        <TableCell>{movement.destination}</TableCell>
                        <TableCell
                          className={`text-right font-mono ${anomalous ? "text-red-600 font-bold" : ""}`}
                        >
                          {new Intl.NumberFormat("pt-BR").format(
                            movement.departureKm,
                          )}
                        </TableCell>
                        <TableCell
                          className={`text-right font-mono ${anomalous ? "text-red-600 font-bold" : ""}`}
                        >
                          {movement.arrivalKm ? (
                            new Intl.NumberFormat("pt-BR").format(
                              movement.arrivalKm,
                            )
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {distance !== null ? (
                            <span
                              className={
                                anomalous
                                  ? "text-red-600 font-bold"
                                  : "text-green-700 dark:text-green-400"
                              }
                            >
                              {new Intl.NumberFormat("pt-BR").format(distance)}{" "}
                              km
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm">
                          {movement.registeredByDepartureName ?? (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {movement.status === "em_transito" ? (
                            <Badge variant="outline" className="text-orange-600 border-orange-300">
                              Em Transito
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-600 border-green-300">
                              Concluido
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <button
                              type="button"
                              className="inline-flex items-center justify-center h-8 rounded-md px-2.5 text-sm hover:bg-accent hover:text-accent-foreground"
                              onClick={() => handleEditClick(movement)}
                              title="Editar movimentacao"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center justify-center h-8 rounded-md px-2.5 text-sm hover:bg-accent hover:text-accent-foreground"
                              onClick={() => handleDeleteClick(movement._id)}
                              title="Deletar movimentacao"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <EditMovementModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        movement={selectedMovement}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ open, movementId: null })}
      >
        <DialogContent className="light text-foreground">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusao</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar esta movimentacao? Esta acao nao
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() =>
                setDeleteConfirm({ open: false, movementId: null })
              }
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

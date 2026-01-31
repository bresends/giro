import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  Car,
  Check,
  Clock,
  Copy,
  LogIn,
  LogOut,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Loading } from "../components/common/Loading";
import { ArrivalModal } from "../components/guarita/ArrivalModal";
import { DepartureModal } from "../components/guarita/DepartureModal";
import { EditMovementModal } from "../components/guarita/EditMovementModal";
import { PersonnelQuickAddModal } from "../components/guarita/PersonnelQuickAddModal";
import { getVehicleTypeColor } from "@/lib/utils";

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
  vehicle: {
    _id: Id<"vehicles">;
    operationalPrefix: string;
    plate: string;
    color?: string;
    type?: string;
  } | null;
  personnel: {
    _id: Id<"personnel">;
    rank: string;
    rg: string;
    name: string;
  } | null;
}

function generateShiftReportHTML(movements: Movement[]): string {
  // Calcular período baseado no horário atual
  const now = new Date();
  const currentHour = now.getHours();

  const today7am = new Date();
  today7am.setHours(7, 0, 0, 0);

  const yesterday7am = new Date(today7am);
  yesterday7am.setDate(yesterday7am.getDate() - 1);

  const tomorrow7am = new Date(today7am);
  tomorrow7am.setDate(tomorrow7am.getDate() + 1);

  let shiftStart: Date;
  let shiftEnd: Date;

  // Se antes das 7h, turno é de ontem 7h até hoje 7h
  // Se depois das 7h, turno é de hoje 7h até amanhã 7h
  if (currentHour < 7) {
    shiftStart = yesterday7am;
    shiftEnd = today7am;
  } else {
    shiftStart = today7am;
    shiftEnd = tomorrow7am;
  }

  const periodStart = shiftStart.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const periodEnd = shiftEnd.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Gerar linhas da tabela
  const tableRows = movements
    .map((movement) => {
      const distance = movement.arrivalKm
        ? movement.arrivalKm - movement.departureKm
        : null;

      // Calcular tempo fora
      let timeOutStr = "—";
      if (movement.arrivalTime) {
        const timeOutMinutes = Math.floor(
          (movement.arrivalTime - movement.departureTime) / (1000 * 60),
        );
        const hours = Math.floor(timeOutMinutes / 60);
        const minutes = timeOutMinutes % 60;
        timeOutStr = `${hours}h ${minutes.toString().padStart(2, "0")}min`;
      }

      return `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${movement.vehicle?.operationalPrefix || "-"}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${movement.personnel?.rank || "-"}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${movement.personnel?.rg || "-"}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${movement.personnel?.name || "-"}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${movement.destination}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${new Intl.NumberFormat("pt-BR").format(movement.departureKm)}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${movement.arrivalKm ? new Intl.NumberFormat("pt-BR").format(movement.arrivalKm) : "—"}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${new Date(movement.departureTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${movement.arrivalTime ? new Date(movement.arrivalTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${timeOutStr}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${distance !== null ? new Intl.NumberFormat("pt-BR").format(distance) + " km" : "—"}</td>
      </tr>
    `;
    })
    .join("");

  return `
<div style="font-family: 'Calibri', sans-serif; font-size: 12pt; line-height: 1.5;">
  <h2 style="text-align: center; margin-bottom: 16px;">Relatório de Movimentações de Viaturas</h2>
  <p style="text-align: center; margin-bottom: 24px;">
    <strong>Período:</strong> ${periodStart} até ${periodEnd}
  </p>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
    <thead>
      <tr style="background-color: #f5f5f5;">
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Viatura</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Posto/Grad</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">RG</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Motorista</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Destino</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">KM Saída</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">KM Chegada</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Horário Saída</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Horário Chegada</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Tempo Fora</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Distância Percorrida</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <p style="margin-top: 24px; font-size: 10pt; color: #666;">
    <strong>Total de saídas:</strong> ${movements.length}
  </p>
</div>
  `.trim();
}

export function GuaritaPage() {
  const inTransit = useQuery(api.vehicleMovements.listInTransit);
  const recentMovements = useQuery(api.vehicleMovements.listRecent);
  const shiftMovements = useQuery(api.vehicleMovements.listShiftMovements);
  const deleteMovement = useMutation(api.vehicleMovements.remove);

  const [departureModalOpen, setDepartureModalOpen] = useState(false);
  const [arrivalModalOpen, setArrivalModalOpen] = useState(false);
  const [personnelModalOpen, setPersonnelModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    movementId: Id<"vehicleMovements"> | null;
  }>({ open: false, movementId: null });

  const handleArrivalClick = (movement: Movement) => {
    setSelectedMovement(movement);
    setArrivalModalOpen(true);
  };

  const handleCopyShiftReport = async () => {
    // Verificar se dados estão carregados
    if (!shiftMovements || shiftMovements.length === 0) {
      return;
    }

    // Gerar HTML
    const html = generateShiftReportHTML(shiftMovements);

    // Copiar para clipboard
    try {
      const blob = new Blob([html], { type: "text/html" });
      const clipboardItem = new ClipboardItem({ "text/html": blob });
      await navigator.clipboard.write([clipboardItem]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  };

  const handleEditClick = (movement: Movement) => {
    setSelectedMovement(movement);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (movementId: Id<"vehicleMovements">) => {
    setDeleteConfirm({ open: true, movementId });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.movementId) return;

    try {
      await deleteMovement({ id: deleteConfirm.movementId });
      setDeleteConfirm({ open: false, movementId: null });
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert(
        error instanceof Error ? error.message : "Erro ao deletar movimentação",
      );
    }
  };

  if (inTransit === undefined || recentMovements === undefined) {
    return <Loading text="Carregando movimentações..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Guarita - Controle de Viaturas
              </h1>
              <p className="text-muted-foreground">
                {new Date().toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                size="lg"
                variant="outline"
                onClick={handleCopyShiftReport}
                disabled={shiftMovements === undefined}
                title="Copiar movimentações do turno"
              >
                {copied ? (
                  <Check className="w-5 h-5 mr-2 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 mr-2" />
                )}
                Copiar
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setPersonnelModalOpen(true)}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Cadastrar Militar
              </Button>
              <Button
                size="lg"
                variant="default"
                onClick={() => setDepartureModalOpen(true)}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Registrar Saída
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* In-Transit Vehicles */}
      {inTransit.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Viaturas em Trânsito ({inTransit.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inTransit.map((movement) => {
                const timeElapsed = Math.floor(
                  (Date.now() - movement.departureTime) / (1000 * 60),
                );
                const hours = Math.floor(timeElapsed / 60);
                const minutes = timeElapsed % 60;

                return (
                  <Card
                    key={movement._id}
                    className="border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20"
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-2">
                          <Badge className={getVehicleTypeColor(movement.vehicle?.type)}>
                            {movement.vehicle?.operationalPrefix}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {movement.vehicle?.plate}
                            {movement.vehicle?.color &&
                              ` • ${movement.vehicle.color}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-orange-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {hours > 0 ? `${hours}h ` : ""}
                            {minutes}min
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Motorista:
                          </span>
                          <span className="font-medium">
                            {movement.personnel?.rank}{" "}
                            {movement.personnel?.name}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Destino:
                          </span>
                          <span className="font-medium">
                            {movement.destination}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Saída:</span>
                          <span className="font-medium">
                            {new Date(
                              movement.departureTime,
                            ).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            •{" "}
                            {new Intl.NumberFormat("pt-BR").format(
                              movement.departureKm,
                            )}{" "}
                            km
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        size="sm"
                        onClick={() => handleArrivalClick(movement)}
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Registrar Chegada
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {inTransit.length === 0 && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="p-6 text-center">
            <Car className="w-12 h-12 mx-auto mb-2 text-green-600" />
            <p className="text-green-800 dark:text-green-200 font-medium">
              Todas as viaturas na unidade
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Nenhuma viatura em trânsito no momento
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recent Movements History */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Saídas</CardTitle>
        </CardHeader>
        <CardContent>
          {recentMovements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-2" />
              <p>Nenhuma movimentação registrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Viatura</TableHead>
                    <TableHead>Posto/Grad</TableHead>
                    <TableHead>RG</TableHead>
                    <TableHead>Motorista</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead className="text-right">KM Saída</TableHead>
                    <TableHead className="text-right">KM Chegada</TableHead>
                    <TableHead>Horário Saída</TableHead>
                    <TableHead>Horário Chegada</TableHead>
                    <TableHead className="text-right">Tempo</TableHead>
                    <TableHead className="text-right">Distância</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMovements.map((movement) => {
                    const distance = movement.arrivalKm
                      ? movement.arrivalKm - movement.departureKm
                      : null;

                    const departureDate = new Date(movement.departureTime);
                    const dateStr = departureDate.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    });

                    // Calcular tempo fora
                    let timeOutStr = "—";
                    if (movement.arrivalTime) {
                      const timeOutMinutes = Math.floor(
                        (movement.arrivalTime - movement.departureTime) /
                          (1000 * 60),
                      );
                      const hours = Math.floor(timeOutMinutes / 60);
                      const minutes = timeOutMinutes % 60;
                      timeOutStr = `${hours}h ${minutes.toString().padStart(2, "0")}min`;
                    }

                    return (
                      <TableRow
                        key={movement._id}
                        className={
                          movement.status === "em_transito"
                            ? "bg-orange-50 dark:bg-orange-950/20"
                            : ""
                        }
                      >
                        <TableCell className="font-medium">{dateStr}</TableCell>
                        <TableCell>
                          <Badge className={getVehicleTypeColor(movement.vehicle?.type)}>
                            {movement.vehicle?.operationalPrefix}
                            {movement.vehicle?.color && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({movement.vehicle.color})
                              </span>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>{movement.personnel?.rank}</TableCell>
                        <TableCell>{movement.personnel?.rg}</TableCell>
                        <TableCell>{movement.personnel?.name}</TableCell>
                        <TableCell>{movement.destination}</TableCell>
                        <TableCell className="text-right font-mono">
                          {new Intl.NumberFormat("pt-BR").format(
                            movement.departureKm,
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {movement.arrivalKm ? (
                            new Intl.NumberFormat("pt-BR").format(
                              movement.arrivalKm,
                            )
                          ) : (
                            <span className="text-orange-600 font-bold">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(movement.departureTime).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </TableCell>
                        <TableCell>
                          {movement.arrivalTime ? (
                            new Date(movement.arrivalTime).toLocaleTimeString(
                              "pt-BR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          ) : (
                            <span className="text-orange-600 font-bold">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {movement.arrivalTime ? (
                            <span className="text-blue-700 dark:text-blue-400">
                              {timeOutStr}
                            </span>
                          ) : (
                            <span className="text-orange-600 font-bold">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {distance !== null ? (
                            <span className="text-green-700 dark:text-green-400">
                              {new Intl.NumberFormat("pt-BR").format(distance)}{" "}
                              km
                            </span>
                          ) : (
                            <span className="text-orange-600 font-bold">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <button
                              type="button"
                              className="inline-flex items-center justify-center h-8 rounded-md px-2.5 text-sm hover:bg-accent hover:text-accent-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(movement);
                              }}
                              title="Editar saída"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center justify-center h-8 rounded-md px-2.5 text-sm hover:bg-accent hover:text-accent-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(movement._id);
                              }}
                              title="Deletar saída"
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

      {/* Modals */}
      <PersonnelQuickAddModal
        open={personnelModalOpen}
        onOpenChange={setPersonnelModalOpen}
      />
      <DepartureModal
        open={departureModalOpen}
        onOpenChange={setDepartureModalOpen}
      />
      <ArrivalModal
        open={arrivalModalOpen}
        onOpenChange={setArrivalModalOpen}
        movement={selectedMovement}
      />
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
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar esta movimentação? Esta ação não
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

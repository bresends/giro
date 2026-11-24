import { useMutation, useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { GiroButton } from "@/components/giro/giro-button";
import { giroDialog, giroDialogDescription, giroDialogTitle } from "@/components/giro/styles";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { shiftWindowAt, useNow } from "@/lib/giro";
import { api } from "../../convex/_generated/api";
import { Loading } from "../components/common/Loading";
import { ArrivalModal } from "../components/guarita/ArrivalModal";
import { DepartureModal } from "../components/guarita/DepartureModal";
import { EditMovementModal } from "../components/guarita/EditMovementModal";
import { GuaritaHeader } from "../components/guarita/GuaritaHeader";
import { InTransitBoard } from "../components/guarita/InTransitBoard";
import { PersonnelQuickAddModal } from "../components/guarita/PersonnelQuickAddModal";
import { RecentMovements } from "../components/guarita/RecentMovements";
import { ShiftSummary } from "../components/guarita/ShiftSummary";
import type { Movement } from "../components/guarita/types";


export function GuaritaPage() {
  const now = useNow();
  const shiftWindow = useMemo(() => shiftWindowAt(new Date(now)), [now]);

  const inTransit = useQuery(api.vehicleMovements.listInTransit);
  const recentMovements = useQuery(api.vehicleMovements.listRecent);
  const shiftMovements = useQuery(api.vehicleMovements.listShiftMovements, {
    startMs: shiftWindow.startMs,
    endMs: shiftWindow.endMs,
  });
  const fleet = useQuery(api.vehicles.listSimple, {});
  const deleteMovement = useMutation(api.vehicleMovements.remove);

  const [departureModalOpen, setDepartureModalOpen] = useState(false);
  const [arrivalModalOpen, setArrivalModalOpen] = useState(false);
  const [personnelModalOpen, setPersonnelModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Movement | null>(null);
  const [deleting, setDeleting] = useState(false);

  const inGarage = useMemo(() => {
    if (!fleet || !inTransit) return undefined;
    const out = new Set(inTransit.map((m) => m.vehicleId));
    return fleet.filter((v) => !out.has(v._id) && !v.inMaintenance).length;
  }, [fleet, inTransit]);

  const handleArrivalClick = (movement: Movement) => {
    setSelectedMovement(movement);
    setArrivalModalOpen(true);
  };

  const handleEditClick = (movement: Movement) => {
    setSelectedMovement(movement);
    setEditModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMovement({ id: deleteTarget._id });
      setDeleteTarget(null);
      toast.success("Movimentação excluída.");
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao excluir movimentação");
    } finally {
      setDeleting(false);
    }
  };

  if (inTransit === undefined || recentMovements === undefined) {
    return <Loading text="Carregando movimentações..." />;
  }

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 pt-6 pb-14 sm:px-6 lg:px-10 lg:pt-8">
      <GuaritaHeader
        now={now}
        onAddPersonnel={() => setPersonnelModalOpen(true)}
        onDeparture={() => setDepartureModalOpen(true)}
      />

      <InTransitBoard movements={inTransit} now={now} onArrival={handleArrivalClick} />

      <ShiftSummary
        movements={shiftMovements}
        window={shiftWindow}
        now={now}
        fleetSize={fleet?.length}
        inGarage={inGarage}
      />

      <RecentMovements
        movements={recentMovements}
        now={now}
        onEdit={handleEditClick}
        onDelete={setDeleteTarget}
      />

      <PersonnelQuickAddModal open={personnelModalOpen} onOpenChange={setPersonnelModalOpen} />
      <DepartureModal open={departureModalOpen} onOpenChange={setDepartureModalOpen} />
      <ArrivalModal
        open={arrivalModalOpen}
        onOpenChange={setArrivalModalOpen}
        movement={selectedMovement}
      />
      <EditMovementModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        movement={selectedMovement}
        appearance="giro"
      />

      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className={`${giroDialog} sm:max-w-md`}>
          <DialogHeader>
            <DialogTitle className={giroDialogTitle}>Excluir movimentação?</DialogTitle>
            <DialogDescription className={giroDialogDescription}>
              {deleteTarget?.vehicle?.operationalPrefix
                ? `A saída de ${deleteTarget.vehicle.operationalPrefix} será apagada do histórico. `
                : ""}
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <GiroButton variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </GiroButton>
            <GiroButton variant="danger" onClick={() => void handleConfirmDelete()} disabled={deleting}>
              {deleting ? "Excluindo..." : "Excluir"}
            </GiroButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

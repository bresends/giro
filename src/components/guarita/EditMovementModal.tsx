import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimpleSelect } from "../common/SimpleSelect";

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
  vehicle?: {
    _id: Id<"vehicles">;
    operationalPrefix: string;
    plate: string;
  } | null;
  personnel?: {
    _id: Id<"personnel">;
    rank: string;
    rg: number;
    name: string;
  } | null;
}

interface EditMovementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movement: Movement | null;
}

export function EditMovementModal({
  open,
  onOpenChange,
  movement,
}: EditMovementModalProps) {
  const vehicles = useQuery(api.vehicles.list, { inMaintenance: false });
  const personnel = useQuery(api.personnel.list, { activeOnly: true });
  const updateMovement = useMutation(api.vehicleMovements.update);

  const [formData, setFormData] = useState({
    vehicleId: "" as Id<"vehicles"> | "",
    personnelId: "" as Id<"personnel"> | "",
    destination: "",
    destinationType: "" as "ocorrencia" | "qrf" | "ceman" | "cal" | "outro" | "",
    notes: "",
    departureKm: 0,
    arrivalKm: 0,
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load movement data when dialog opens
  useEffect(() => {
    if (open && movement) {
      const departureDate = new Date(movement.departureTime);
      const departureDateStr = departureDate.toISOString().split("T")[0];
      const departureTimeStr = departureDate.toTimeString().slice(0, 5);

      const arrivalDate = movement.arrivalTime ? new Date(movement.arrivalTime) : null;
      const arrivalDateStr = arrivalDate ? arrivalDate.toISOString().split("T")[0] : "";
      const arrivalTimeStr = arrivalDate ? arrivalDate.toTimeString().slice(0, 5) : "";

      setFormData({
        vehicleId: movement.vehicleId,
        personnelId: movement.personnelId,
        destination: movement.destination,
        destinationType: (movement.destinationType as any) || "",
        notes: movement.notes || "",
        departureKm: movement.departureKm,
        arrivalKm: movement.arrivalKm || 0,
        departureDate: departureDateStr,
        departureTime: departureTimeStr,
        arrivalDate: arrivalDateStr,
        arrivalTime: arrivalTimeStr,
      });
      setError(null);
    }
  }, [open, movement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!movement) return;

    if (!formData.vehicleId || !formData.personnelId) {
      setError("Selecione a viatura e o motorista");
      return;
    }

    if (!formData.destination.trim()) {
      setError("Informe o destino");
      return;
    }

    setIsSubmitting(true);

    try {
      // Converter data/hora para timestamp
      const departureTimestamp = new Date(
        `${formData.departureDate}T${formData.departureTime}`
      ).getTime();

      let arrivalTimestamp: number | undefined = undefined;
      if (formData.arrivalDate && formData.arrivalTime) {
        arrivalTimestamp = new Date(
          `${formData.arrivalDate}T${formData.arrivalTime}`
        ).getTime();
      }

      await updateMovement({
        id: movement._id,
        vehicleId: formData.vehicleId,
        personnelId: formData.personnelId,
        destination: formData.destination,
        destinationType: formData.destinationType || undefined,
        notes: formData.notes || undefined,
        departureKm: formData.departureKm,
        departureTime: departureTimestamp,
        arrivalKm: formData.arrivalKm || undefined,
        arrivalTime: arrivalTimestamp,
      });

      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar movimentação");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open && movement !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl light text-foreground">
        <DialogHeader>
          <DialogTitle>Editar Movimentação</DialogTitle>
          <DialogDescription>
            Atualize as informações da saída da viatura.
          </DialogDescription>
        </DialogHeader>

        {!movement ? (
          <p>Carregando...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <SimpleSelect
              label="Viatura"
              value={formData.vehicleId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  vehicleId: e.target.value as Id<"vehicles">,
                })
              }
              options={
                vehicles?.map((v) => ({
                  value: v._id,
                  label: `${v.operationalPrefix} - ${v.plate}`,
                })) || []
              }
              placeholder="Selecione a viatura"
              required
            />

            <SimpleSelect
              label="Motorista"
              value={formData.personnelId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personnelId: e.target.value as Id<"personnel">,
                })
              }
              options={
                personnel?.map((p) => ({
                  value: p._id,
                  label: `${p.rank} ${p.name} - RG ${p.rg}`,
                })) || []
              }
              placeholder="Selecione o motorista"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SimpleSelect
              label="Tipo de Destino"
              value={formData.destinationType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  destinationType: e.target.value as typeof formData.destinationType,
                })
              }
              options={[
                { value: "ocorrencia", label: "Ocorrência" },
                { value: "qrf", label: "QRF" },
                { value: "ceman", label: "CEMAN" },
                { value: "cal", label: "CAL" },
                { value: "outro", label: "Outro" },
              ]}
              placeholder="Selecione o tipo"
            />

            <div className="space-y-2">
              <Label htmlFor="destination">
                Destino <span className="text-red-500">*</span>
              </Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                placeholder="Ex: Av. Goiás, 123"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departureKm">
                KM Saída <span className="text-red-500">*</span>
              </Label>
              <Input
                id="departureKm"
                type="number"
                value={formData.departureKm}
                onChange={(e) =>
                  setFormData({ ...formData, departureKm: Number(e.target.value) })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="arrivalKm">KM Chegada</Label>
              <Input
                id="arrivalKm"
                type="number"
                value={formData.arrivalKm || ""}
                onChange={(e) =>
                  setFormData({ ...formData, arrivalKm: Number(e.target.value) || 0 })
                }
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departureDate">
                Data Saída <span className="text-red-500">*</span>
              </Label>
              <Input
                id="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={(e) =>
                  setFormData({ ...formData, departureDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="departureTime">
                Horário Saída <span className="text-red-500">*</span>
              </Label>
              <Input
                id="departureTime"
                type="time"
                value={formData.departureTime}
                onChange={(e) =>
                  setFormData({ ...formData, departureTime: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="arrivalDate">Data Chegada</Label>
              <Input
                id="arrivalDate"
                type="date"
                value={formData.arrivalDate}
                onChange={(e) =>
                  setFormData({ ...formData, arrivalDate: e.target.value })
                }
                placeholder="Opcional"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="arrivalTime">Horário Chegada</Label>
              <Input
                id="arrivalTime"
                type="time"
                value={formData.arrivalTime}
                onChange={(e) =>
                  setFormData({ ...formData, arrivalTime: e.target.value })
                }
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Observações adicionais (opcional)"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

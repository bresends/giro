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
  status: string;
  notes?: string;
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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load movement data when dialog opens
  useEffect(() => {
    if (open && movement) {
      setFormData({
        vehicleId: movement.vehicleId,
        personnelId: movement.personnelId,
        destination: movement.destination,
        destinationType: (movement.destinationType as any) || "",
        notes: movement.notes || "",
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
      await updateMovement({
        id: movement._id,
        vehicleId: formData.vehicleId,
        personnelId: formData.personnelId,
        destination: formData.destination,
        destinationType: formData.destinationType || undefined,
        notes: formData.notes || undefined,
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
      <DialogContent className="max-w-2xl">
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
                  label: `${v.operationalPrefix} - ${v.plate}${v.color ? ` (${v.color})` : ""}`,
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

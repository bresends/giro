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
import { GiroButton } from "@/components/giro/giro-button";
import {
  giroDialog,
  giroDialogDescription,
  giroDialogTitle,
  giroErrorBox,
  giroField,
  giroLabel,
  giroSelect,
} from "@/components/giro/styles";
import { cn } from "@/lib/utils";
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
  /** "giro" aplica a direção Placar (guarita); o admin usa o visual padrão. */
  appearance?: "default" | "giro";
}

/** Data local no formato do input type="date" (toISOString usaria UTC). */
function toLocalDateInput(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function Field({
  id,
  text,
  isRequired,
  giro,
  children,
}: {
  id?: string;
  text: string;
  isRequired?: boolean;
  giro: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className={giro ? giroLabel : undefined}>
        {text}{" "}
        {isRequired && (
          <span className={giro ? "text-giro-accent" : "text-red-500"}>*</span>
        )}
      </Label>
      {children}
    </div>
  );
}

export function EditMovementModal({
  open,
  onOpenChange,
  movement,
  appearance = "default",
}: EditMovementModalProps) {
  const giro = appearance === "giro";
  const field = giro ? giroField : undefined;
  const select = giro ? giroSelect : undefined;

  const vehicles = useQuery(api.vehicles.listSimple, {});
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
      const departureDateStr = toLocalDateInput(departureDate);
      const departureTimeStr = departureDate.toTimeString().slice(0, 5);

      const arrivalDate = movement.arrivalTime ? new Date(movement.arrivalTime) : null;
      const arrivalDateStr = arrivalDate ? toLocalDateInput(arrivalDate) : "";
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
      <DialogContent
        className={giro ? cn(giroDialog, "sm:max-w-2xl") : "max-w-2xl light text-foreground"}
      >
        <DialogHeader>
          <DialogTitle className={giro ? giroDialogTitle : undefined}>
            {giro ? "Editar movimentação" : "Editar Movimentação"}
          </DialogTitle>
          <DialogDescription className={giro ? giroDialogDescription : undefined}>
            Atualize as informações da saída da viatura.
          </DialogDescription>
        </DialogHeader>

        {!movement ? (
          <p>Carregando...</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div
              role="alert"
              className={
                giro
                  ? giroErrorBox
                  : "bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-800 dark:text-red-200"
              }
            >
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="edit-vehicle" text="Viatura" isRequired giro={giro}>
              <SimpleSelect
                id="edit-vehicle"
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
                className={select}
              />
            </Field>

            <Field id="edit-personnel" text="Motorista" isRequired giro={giro}>
              <SimpleSelect
                id="edit-personnel"
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
                className={select}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="edit-destinationType" text="Tipo de destino" giro={giro}>
              <SimpleSelect
                id="edit-destinationType"
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
                className={select}
              />
            </Field>

            <Field id="destination" text="Destino" isRequired giro={giro}>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                placeholder="Ex: Av. Goiás, 123"
                required
                className={field}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="departureKm" text="KM saída" isRequired giro={giro}>
              <Input
                id="departureKm"
                type="number"
                inputMode="numeric"
                value={formData.departureKm}
                onChange={(e) =>
                  setFormData({ ...formData, departureKm: Number(e.target.value) })
                }
                required
                className={field}
              />
            </Field>

            <Field id="arrivalKm" text="KM chegada" giro={giro}>
              <Input
                id="arrivalKm"
                type="number"
                inputMode="numeric"
                value={formData.arrivalKm || ""}
                onChange={(e) =>
                  setFormData({ ...formData, arrivalKm: Number(e.target.value) || 0 })
                }
                placeholder="Opcional"
                className={field}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field id="departureDate" text="Data saída" isRequired giro={giro}>
              <Input
                id="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={(e) =>
                  setFormData({ ...formData, departureDate: e.target.value })
                }
                required
                className={field}
              />
            </Field>

            <Field id="departureTime" text="Horário saída" isRequired giro={giro}>
              <Input
                id="departureTime"
                type="time"
                value={formData.departureTime}
                onChange={(e) =>
                  setFormData({ ...formData, departureTime: e.target.value })
                }
                required
                className={field}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field id="arrivalDate" text="Data chegada" giro={giro}>
              <Input
                id="arrivalDate"
                type="date"
                value={formData.arrivalDate}
                onChange={(e) =>
                  setFormData({ ...formData, arrivalDate: e.target.value })
                }
                className={field}
              />
            </Field>

            <Field id="arrivalTime" text="Horário chegada" giro={giro}>
              <Input
                id="arrivalTime"
                type="time"
                value={formData.arrivalTime}
                onChange={(e) =>
                  setFormData({ ...formData, arrivalTime: e.target.value })
                }
                className={field}
              />
            </Field>
          </div>

          <Field id="notes" text="Observações" giro={giro}>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Observações adicionais (opcional)"
              className={field}
            />
          </Field>

          <DialogFooter className={giro ? "pt-1" : undefined}>
            {giro ? (
              <>
                <GiroButton
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </GiroButton>
                <GiroButton type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar alterações"}
                </GiroButton>
              </>
            ) : (
              <>
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
              </>
            )}
          </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

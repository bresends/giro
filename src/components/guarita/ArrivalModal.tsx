import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconRegistrarChegada } from "@/components/giro/icons";
import { GiroButton } from "@/components/giro/giro-button";
import {
  giroDialog,
  giroDialogDescription,
  giroDialogTitle,
  giroErrorBox,
  giroField,
  giroInfoBox,
  giroLabel,
} from "@/components/giro/styles";
import { cn } from "@/lib/utils";

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
  vehicle: {
    _id: Id<"vehicles">;
    operationalPrefix: string;
    plate: string;
  } | null;
  personnel: {
    _id: Id<"personnel">;
    rank: string;
    rg: number;
    name: string;
  } | null;
}

interface ArrivalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movement: Movement | null;
}

export function ArrivalModal({
  open,
  onOpenChange,
  movement,
}: ArrivalModalProps) {
  const registerArrival = useMutation(api.vehicleMovements.registerArrival);

  const [formData, setFormData] = useState({
    arrivalKm: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warningConfirmed, setWarningConfirmed] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open && movement) {
      setFormData({
        arrivalKm: movement.departureKm,
      });
      setError(null);
      setWarningConfirmed(false);
    }
  }, [open, movement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!movement) return;

    if (formData.arrivalKm < movement.departureKm) {
      setError(
        `KM de chegada (${formData.arrivalKm}) não pode ser menor que KM de saída (${movement.departureKm} km)`
      );
      return;
    }

    const distance = formData.arrivalKm - movement.departureKm;
    if (distance > 500 && !warningConfirmed) {
      setError(
        `Distancia de ${new Intl.NumberFormat("pt-BR").format(distance)} km parece incorreta. Clique novamente em "Confirmar mesmo assim" se tiver certeza.`
      );
      setWarningConfirmed(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Usar horário atual automaticamente
      const now = Date.now();

      await registerArrival({
        id: movement._id,
        arrivalKm: formData.arrivalKm,
        arrivalTime: now,
      });

      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao registrar chegada");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!movement) return null;

  const kmTraveled = formData.arrivalKm - movement.departureKm;
  // Mesmo limite da confirmação em handleSubmit
  const kmSuspicious = kmTraveled > 500;
  const kmInvalid = formData.arrivalKm < movement.departureKm;
  const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(giroDialog, "sm:max-w-xl")}>
        <DialogHeader>
          <DialogTitle className={giroDialogTitle}>
            Registrar chegada · {movement.vehicle?.operationalPrefix}
          </DialogTitle>
          <DialogDescription className={giroDialogDescription}>
            Informe a quilometragem do painel. O horário é registrado automaticamente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div role="alert" className={giroErrorBox}>
              {error}
            </div>
          )}

          <dl className={cn(giroInfoBox, "grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3")}>
            <div className="flex min-w-0 flex-col gap-0.5">
              <dt className="text-xs text-giro-muted">Viatura</dt>
              <dd className="truncate text-sm font-semibold">
                {movement.vehicle?.operationalPrefix} · {movement.vehicle?.plate}
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <dt className="text-xs text-giro-muted">Motorista</dt>
              <dd className="truncate text-sm font-semibold">
                {movement.personnel?.rank} {movement.personnel?.name}
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <dt className="text-xs text-giro-muted">Destino</dt>
              <dd className="truncate text-sm font-semibold">{movement.destination}</dd>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <dt className="text-xs text-giro-muted">Saída</dt>
              <dd className="text-sm font-semibold tabular-nums">
                {new Date(movement.departureTime).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <dt className="text-xs text-giro-muted">KM de saída</dt>
              <dd className="text-sm font-semibold tabular-nums">{fmt(movement.departureKm)} km</dd>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <dt className="text-xs text-giro-muted">Chegada</dt>
              <dd className="text-sm font-semibold tabular-nums">
                {new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-2">
            <Label htmlFor="arrivalKm" className={giroLabel}>
              KM de chegada <span className="text-giro-accent">*</span>
            </Label>
            <Input
              id="arrivalKm"
              type="number"
              inputMode="numeric"
              value={formData.arrivalKm}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  arrivalKm: parseInt(e.target.value) || 0,
                });
                setWarningConfirmed(false);
              }}
              min={movement.departureKm}
              required
              aria-invalid={kmInvalid}
              aria-describedby="arrivalKm-hint"
              className={cn(
                giroField,
                "h-16 text-[28px] font-bold tracking-[-0.5px] tabular-nums md:text-[28px]",
                kmInvalid && "border-giro-accent focus-visible:ring-giro-accent/30",
              )}
              autoFocus
            />
            <p
              id="arrivalKm-hint"
              className={cn("text-xs", kmInvalid ? "font-medium text-giro-accent" : "text-giro-muted")}
            >
              {kmInvalid
                ? `O KM de chegada deve ser maior ou igual ao KM de saída (${fmt(movement.departureKm)} km).`
                : `Valor mínimo: ${fmt(movement.departureKm)} km`}
            </p>
          </div>

          {kmTraveled >= 0 && (
            <div
              aria-live="polite"
              className={cn(
                "rounded-2xl px-4 py-3 text-sm",
                kmSuspicious
                  ? "bg-giro-accent-soft text-giro-accent-soft-foreground"
                  : kmTraveled === 0
                    ? "bg-giro-warning-soft text-giro-warning-soft-foreground"
                    : "bg-giro-success-soft text-giro-success-soft-foreground",
              )}
            >
              <p>
                <span className="font-semibold">Distância percorrida:</span>{" "}
                <span className="tabular-nums">{fmt(kmTraveled)} km</span>
              </p>
              {kmSuspicious && (
                <p className="mt-1 font-semibold">Distância muito alta. Confira o KM no painel.</p>
              )}
              {kmTraveled === 0 && (
                <p className="mt-1">Mesma quilometragem da saída.</p>
              )}
            </div>
          )}

          <DialogFooter className="pt-1">
            <GiroButton
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </GiroButton>
            <GiroButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting || kmInvalid}
            >
              <IconRegistrarChegada />
              {isSubmitting
                ? "Registrando..."
                : kmSuspicious && warningConfirmed
                  ? "Confirmar mesmo assim"
                  : "Registrar chegada"}
            </GiroButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

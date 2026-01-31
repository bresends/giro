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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car } from "lucide-react";

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
    color?: string;
  } | null;
  personnel: {
    _id: Id<"personnel">;
    rank: string;
    rg: string;
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

  // Reset form when dialog opens
  useEffect(() => {
    if (open && movement) {
      setFormData({
        arrivalKm: movement.departureKm,
      });
      setError(null);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar Chegada de Viatura</DialogTitle>
          <DialogDescription>
            Registre a chegada da viatura informando a quilometragem atual.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Departure Info Card */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Car className="w-5 h-5" />
              <h3 className="font-semibold">Informações da Saída</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Viatura</p>
                <p className="font-semibold">
                  {movement.vehicle?.operationalPrefix} - {movement.vehicle?.plate}
                  {movement.vehicle?.color && ` (${movement.vehicle.color})`}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Motorista</p>
                <p className="font-semibold">
                  {movement.personnel?.rank} {movement.personnel?.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Destino</p>
                <p className="font-semibold">{movement.destination}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Horário de Saída</p>
                <p className="font-semibold">
                  {new Date(movement.departureTime).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">KM de Saída</p>
                <p className="font-semibold">
                  {new Intl.NumberFormat("pt-BR").format(movement.departureKm)} km
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrivalKm">
              KM de Chegada <span className="text-red-500">*</span>
            </Label>
            <Input
              id="arrivalKm"
              type="number"
              value={formData.arrivalKm}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  arrivalKm: parseInt(e.target.value) || 0,
                })
              }
              min={movement.departureKm}
              required
              className={`text-2xl font-bold h-16 ${
                formData.arrivalKm < movement.departureKm
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              autoFocus
            />
            {formData.arrivalKm < movement.departureKm ? (
              <p className="text-xs text-red-600 font-medium">
                ⚠️ KM de chegada deve ser maior ou igual ao KM de saída ({new Intl.NumberFormat("pt-BR").format(movement.departureKm)} km)
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Valor mínimo: {new Intl.NumberFormat("pt-BR").format(movement.departureKm)} km
              </p>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-md">
            <p className="text-sm text-muted-foreground mb-1">Horário de Chegada:</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Horário será registrado automaticamente
            </p>
          </div>

          {kmTraveled >= 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-md">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Distância percorrida:</strong>{" "}
                {new Intl.NumberFormat("pt-BR").format(kmTraveled)} km
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || formData.arrivalKm < movement.departureKm}
            >
              {isSubmitting ? "Registrando..." : "Registrar Chegada"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

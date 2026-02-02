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

interface DepartureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepartureModal({ open, onOpenChange }: DepartureModalProps) {
  const vehicles = useQuery(api.vehicles.list, { inMaintenance: false });
  const personnel = useQuery(api.personnel.list, { activeOnly: true });
  const createMovement = useMutation(api.vehicleMovements.create);

  const [formData, setFormData] = useState({
    vehicleId: "" as Id<"vehicles"> | "",
    personnelId: "" as Id<"personnel"> | "",
    destination: "",
    destinationType: "" as "ocorrencia" | "qrf" | "ceman" | "cal" | "outro" | "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        vehicleId: "",
        personnelId: "",
        destination: "",
        destinationType: "",
        notes: "",
      });
      setError(null);
    }
  }, [open]);

  // Get selected vehicle's current KM
  const selectedVehicle = vehicles?.find((v) => v._id === formData.vehicleId) || undefined;
  const selectedPerson = personnel?.find((p) => p._id === formData.personnelId) || undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.vehicleId || !formData.personnelId) {
      setError("Selecione a viatura e o motorista");
      return;
    }

    if (!formData.destination.trim()) {
      setError("Informe o destino");
      return;
    }

    if (!selectedVehicle) {
      setError("Viatura não encontrada");
      return;
    }

    if (selectedVehicle.currentKm === undefined || selectedVehicle.currentKm === null) {
      setError("KM atual da viatura não disponível. Verifique se há leituras registradas.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Usar horário atual e KM atual da viatura
      const now = Date.now();

      await createMovement({
        vehicleId: formData.vehicleId,
        personnelId: formData.personnelId,
        destination: formData.destination,
        destinationType: formData.destinationType || undefined,
        departureKm: selectedVehicle.currentKm,
        departureTime: now,
        notes: formData.notes || undefined,
      });

      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao registrar saída");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl light text-foreground">
        <DialogHeader>
          <DialogTitle>Registrar Saída de Viatura</DialogTitle>
          <DialogDescription>
            Registre a saída de uma viatura informando a viatura, o motorista e o destino.
          </DialogDescription>
        </DialogHeader>

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
                setFormData({ ...formData, vehicleId: e.target.value as Id<"vehicles"> })
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
                setFormData({ ...formData, personnelId: e.target.value as Id<"personnel"> })
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

          {selectedVehicle && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">KM de Saída (atual):</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {new Intl.NumberFormat("pt-BR").format(selectedVehicle.currentKm)} km
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Horário de Saída:</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {new Date().toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                KM e horário serão registrados automaticamente
              </p>
            </div>
          )}

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
              {isSubmitting ? "Registrando..." : "Registrar Saída"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { SimpleSelect } from "../common/SimpleSelect";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";

interface DepartureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepartureModal({ open, onOpenChange }: DepartureModalProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const allVehicles = useQuery(api.vehicles.list, {});
  const inTransitMovements = useQuery(api.vehicleMovements.listInTransit);
  const personnel = useQuery(api.personnel.list, { activeOnly: true });
  const createMovement = useMutation(api.vehicleMovements.create);

  // Filter out vehicles that are currently in transit
  const vehicles = allVehicles?.filter((vehicle) => {
    return !inTransitMovements?.some(
      (movement) => movement.vehicleId === vehicle._id,
    );
  });

  const [formData, setFormData] = useState({
    vehicleId: "" as Id<"vehicles"> | "",
    personnelId: "" as Id<"personnel"> | "",
    destination: "",
    destinationType: "" as
      | "ocorrencia"
      | "qrf"
      | "ceman"
      | "cal"
      | "outro"
      | "",
    notes: "",
  });

  const vehicleItems = (vehicles || []).map((v) => ({
    value: v._id,
    label: `${v.operationalPrefix} - ${v.plate}`,
  }));

  const personnelItems = (personnel || []).map((p) => ({
    value: p._id,
    label: `${p.rank} ${p.rg} ${p.name}`,
  }));

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
  const selectedVehicle = vehicles?.find((v) => v._id === formData.vehicleId);

  // Get latest movement for the selected vehicle to prefill the driver
  const latestMovement = useQuery(
    api.vehicleMovements.getLatest,
    formData.vehicleId ? { vehicleId: formData.vehicleId } : "skip",
  );

  // Prefill driver when vehicle is selected and latest movement is loaded
  useEffect(() => {
    if (
      latestMovement?.personnelId &&
      formData.vehicleId &&
      !formData.personnelId
    ) {
      setFormData((prev) => ({
        ...prev,
        personnelId: latestMovement.personnelId,
      }));
    }
  }, [latestMovement, formData.vehicleId]);

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

    if (
      selectedVehicle.currentKm === undefined ||
      selectedVehicle.currentKm === null
    ) {
      setError(
        "KM atual da viatura não disponível. Verifique se há leituras registradas.",
      );
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
      <DialogContent
        ref={setContainer}
        className="max-w-2xl light text-foreground"
      >
        <DialogHeader>
          <DialogTitle>Registrar Saída de Viatura</DialogTitle>
          <DialogDescription>
            Registre a saída de uma viatura informando a viatura, o motorista e
            o destino.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
          <div className="space-y-2 flex flex-col">
            <Label>
              Viatura <span className="text-red-500">*</span>
            </Label>
            <Combobox
              items={vehicleItems}
              value={
                vehicleItems.find(
                  (v) => v.value === formData.vehicleId,
                ) || null
              }
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  vehicleId: v ? v.value : "",
                })
              }
            >
              <ComboboxInput placeholder="Selecione a viatura" />
              <ComboboxContent container={container}>
                <ComboboxEmpty>Nenhuma viatura encontrada.</ComboboxEmpty>
                <ComboboxList>
                  {(v) => (
                    <ComboboxItem key={v.value} value={v}>
                      {v.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label>
              Motorista <span className="text-red-500">*</span>
            </Label>
            <Combobox
              items={personnelItems}
              value={
                personnelItems.find(
                  (p) => p.value === formData.personnelId,
                ) || null
              }
              onValueChange={(p) =>
                setFormData({
                  ...formData,
                  personnelId: p ? p.value : "",
                })
              }
            >
              <ComboboxInput placeholder="Selecione o motorista" />
              <ComboboxContent container={container}>
                <ComboboxEmpty>Nenhum motorista encontrado.</ComboboxEmpty>
                <ComboboxList>
                  {(p) => (
                    <ComboboxItem key={p.value} value={p}>
                      {p.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          {selectedVehicle && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">KM de Saída (atual):</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {new Intl.NumberFormat("pt-BR").format(
                      selectedVehicle.currentKm,
                    )}{" "}
                    km
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
                  destinationType: e.target
                    .value as typeof formData.destinationType,
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

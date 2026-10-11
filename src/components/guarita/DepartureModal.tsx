import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { ArrowRightFromSquare } from "@gravity-ui/icons";
import { GiroButton } from "@/components/giro/giro-button";
import {
  giroCombobox,
  giroDialog,
  giroDialogDescription,
  giroDialogTitle,
  giroErrorBox,
  giroField,
  giroInfoBox,
  giroLabel,
  giroSelect,
} from "@/components/giro/styles";
import { cn } from "@/lib/utils";
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
      latestMovement?.departureTime &&
      formData.vehicleId &&
      !formData.personnelId
    ) {
      const tz = Temporal.Now.timeZoneId();

      // Como o turno de 24h começa às 7h da manhã, subtraímos 7 horas de ambos
      // os horários para alinhar o início do turno com a meia-noite do calendário.
      // Se as datas resultantes forem iguais, a saída pertence ao mesmo turno.
      const nowShifted = Temporal.Now.zonedDateTimeISO().subtract({ hours: 7 });
      const movementShifted = Temporal.Instant.fromEpochMilliseconds(
        latestMovement.departureTime,
      )
        .toZonedDateTimeISO(tz)
        .subtract({ hours: 7 });

      if (nowShifted.toPlainDate().equals(movementShifted.toPlainDate())) {
        setFormData((prev) => ({
          ...prev,
          personnelId: latestMovement.personnelId,
        }));
      }
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
      <DialogContent ref={setContainer} className={cn(giroDialog, "sm:max-w-xl")}>
        <DialogHeader>
          <DialogTitle className={giroDialogTitle}>Registrar saída</DialogTitle>
          <DialogDescription className={giroDialogDescription}>
            Informe a viatura, o motorista e o destino. KM e horário são registrados automaticamente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div role="alert" className={giroErrorBox}>
              {error}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label className={giroLabel}>
              Viatura <span className="text-giro-accent">*</span>
            </Label>
            <Combobox
              items={vehicleItems}
              value={
                vehicleItems.find((v) => v.value === formData.vehicleId) || null
              }
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  vehicleId: v ? v.value : "",
                })
              }
            >
              <ComboboxInput placeholder="Selecione a viatura" className={giroCombobox} />
              <ComboboxContent container={container} className="font-giro">
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

          <div className="flex flex-col gap-2">
            <Label className={giroLabel}>
              Motorista <span className="text-giro-accent">*</span>
            </Label>
            <Combobox
              items={personnelItems}
              value={
                personnelItems.find((p) => p.value === formData.personnelId) ||
                null
              }
              onValueChange={(p) =>
                setFormData({
                  ...formData,
                  personnelId: p ? p.value : "",
                })
              }
            >
              <ComboboxInput placeholder="Selecione o motorista" className={giroCombobox} />
              <ComboboxContent container={container} className="font-giro">
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
            <dl className={cn(giroInfoBox, "grid grid-cols-2 gap-4")}>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-giro-muted">KM de saída (atual)</dt>
                <dd className="text-2xl font-bold tracking-[-0.5px] tabular-nums">
                  {new Intl.NumberFormat("pt-BR").format(
                    selectedVehicle.currentKm,
                  )}{" "}
                  km
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-giro-muted">Horário de saída</dt>
                <dd className="text-2xl font-bold tracking-[-0.5px] tabular-nums">
                  {new Date().toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </dd>
              </div>
            </dl>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="destinationType" className={giroLabel}>
                Tipo de destino
              </Label>
              <SimpleSelect
                id="destinationType"
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
                className={giroSelect}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="destination" className={giroLabel}>
                Destino <span className="text-giro-accent">*</span>
              </Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                placeholder="Ex: Av. Goiás, 123"
                required
                className={giroField}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="notes" className={giroLabel}>
              Observações
            </Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Opcional"
              className={giroField}
            />
          </div>
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
            <GiroButton type="submit" variant="primary" size="lg" disabled={isSubmitting}>
              <ArrowRightFromSquare />
              {isSubmitting ? "Registrando..." : "Registrar saída"}
            </GiroButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

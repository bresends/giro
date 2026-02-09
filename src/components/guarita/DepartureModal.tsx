import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { SimpleSelect } from "../common/SimpleSelect";

interface DepartureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const velInput: React.CSSProperties = {
  background: "#fff",
  border: "1.5px solid #e5e5e5",
  color: "#1a1a1a",
  fontFamily: "'Barlow', sans-serif",
  fontSize: "14px",
  fontWeight: 400,
  padding: "11px 14px",
  width: "100%",
  outline: "none",
  clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
};

export function DepartureModal({ open, onOpenChange }: DepartureModalProps) {
  const allVehicles = useQuery(api.vehicles.list, { inMaintenance: false });
  const inTransitMovements = useQuery(api.vehicleMovements.listInTransit);
  const personnel = useQuery(api.personnel.list, { activeOnly: true });
  const createMovement = useMutation(api.vehicleMovements.create);

  // Filter out vehicles that are currently in transit
  const vehicles = allVehicles?.filter((vehicle) => {
    return !inTransitMovements?.some(
      (movement) => movement.vehicleId === vehicle._id
    );
  });

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
  const selectedVehicle = vehicles?.find((v) => v._id === formData.vehicleId);

  // Get latest movement for the selected vehicle to prefill the driver
  const latestMovement = useQuery(
    api.vehicleMovements.getLatest,
    formData.vehicleId ? { vehicleId: formData.vehicleId } : "skip"
  );

  // Prefill driver when vehicle is selected and latest movement is loaded
  useEffect(() => {
    if (latestMovement?.personnelId && formData.vehicleId && !formData.personnelId) {
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
        <div>
          <h2
            className="text-xl text-[#1a1a1a] tracking-[0.05em] uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
          >
            Registrar Saída de Viatura
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-0.5 w-6" style={{ background: "#dc2626" }} />
            <p className="text-[11px] text-[#999] tracking-wide">
              Informe a viatura, o motorista e o destino
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div
              className="px-4 py-3"
              style={{
                background: "rgba(220,38,38,0.04)",
                borderLeft: "2px solid #dc2626",
              }}
            >
              <p className="text-sm text-[#dc2626]">{error}</p>
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
            <div
              className="p-4"
              style={{
                background: "rgba(37,99,235,0.04)",
                borderLeft: "2px solid #2563eb",
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p
                    className="text-[10px] text-[#999] tracking-[0.15em] uppercase mb-1"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    KM de Saída (atual)
                  </p>
                  <p className="text-2xl font-bold text-[#2563eb] tabular-nums" style={{ fontFamily: "'Barlow', sans-serif" }}>
                    {new Intl.NumberFormat("pt-BR").format(selectedVehicle.currentKm)} km
                  </p>
                </div>
                <div>
                  <p
                    className="text-[10px] text-[#999] tracking-[0.15em] uppercase mb-1"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    Horário de Saída
                  </p>
                  <p className="text-2xl font-bold text-[#2563eb] tabular-nums" style={{ fontFamily: "'Barlow', sans-serif" }}>
                    {new Date().toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-[#999] mt-2">
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

            <div className="space-y-1.5">
              <label
                className="block text-[10px] text-[#999] tracking-[0.15em] uppercase font-semibold"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Destino <span className="text-[#dc2626]">*</span>
              </label>
              <input
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                placeholder="Ex: Av. Goiás, 123"
                required
                style={velInput}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              className="block text-[10px] text-[#999] tracking-[0.15em] uppercase font-semibold"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Observações
            </label>
            <input
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Observações adicionais (opcional)"
              style={velInput}
            />
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs text-[#999] tracking-wider uppercase hover:text-[#1a1a1a] transition-colors cursor-pointer disabled:opacity-40"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                border: "1px solid rgba(0,0,0,0.08)",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs text-white tracking-wider uppercase transition-all hover:brightness-110 cursor-pointer disabled:opacity-40"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                background: "#dc2626",
                border: "none",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              {isSubmitting ? "Registrando..." : "Registrar Saída"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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

  const velLabel = "block text-[10px] text-[#999] tracking-[0.15em] uppercase font-semibold mb-1.5";
  const velLabelStyle: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

  return (
    <Dialog open={open && movement !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl light text-foreground">
        <div>
          <h2
            className="text-xl text-[#1a1a1a] tracking-[0.05em] uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
          >
            Editar Movimentação
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-0.5 w-6" style={{ background: "#dc2626" }} />
            <p className="text-[11px] text-[#999] tracking-wide">
              Atualize as informações da saída
            </p>
          </div>
        </div>

        {!movement ? (
          <p className="text-[#999] text-sm">Carregando...</p>
        ) : (
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

            <div className="space-y-1.5">
              <label className={velLabel} style={velLabelStyle}>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={velLabel} style={velLabelStyle}>
                KM Saída <span className="text-[#dc2626]">*</span>
              </label>
              <input
                type="number"
                value={formData.departureKm}
                onChange={(e) =>
                  setFormData({ ...formData, departureKm: Number(e.target.value) })
                }
                required
                style={velInput}
              />
            </div>

            <div className="space-y-1.5">
              <label className={velLabel} style={velLabelStyle}>
                KM Chegada
              </label>
              <input
                type="number"
                value={formData.arrivalKm || ""}
                onChange={(e) =>
                  setFormData({ ...formData, arrivalKm: Number(e.target.value) || 0 })
                }
                placeholder="Opcional"
                style={velInput}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={velLabel} style={velLabelStyle}>
                Data Saída <span className="text-[#dc2626]">*</span>
              </label>
              <input
                type="date"
                value={formData.departureDate}
                onChange={(e) =>
                  setFormData({ ...formData, departureDate: e.target.value })
                }
                required
                style={velInput}
              />
            </div>

            <div className="space-y-1.5">
              <label className={velLabel} style={velLabelStyle}>
                Horário Saída <span className="text-[#dc2626]">*</span>
              </label>
              <input
                type="time"
                value={formData.departureTime}
                onChange={(e) =>
                  setFormData({ ...formData, departureTime: e.target.value })
                }
                required
                style={velInput}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={velLabel} style={velLabelStyle}>
                Data Chegada
              </label>
              <input
                type="date"
                value={formData.arrivalDate}
                onChange={(e) =>
                  setFormData({ ...formData, arrivalDate: e.target.value })
                }
                style={velInput}
              />
            </div>

            <div className="space-y-1.5">
              <label className={velLabel} style={velLabelStyle}>
                Horário Chegada
              </label>
              <input
                type="time"
                value={formData.arrivalTime}
                onChange={(e) =>
                  setFormData({ ...formData, arrivalTime: e.target.value })
                }
                style={velInput}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={velLabel} style={velLabelStyle}>
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
              {isSubmitting ? "Atualizando..." : "Atualizar"}
            </button>
          </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

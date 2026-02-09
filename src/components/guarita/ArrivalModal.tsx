import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
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
      <DialogContent className="max-w-2xl light text-foreground">
        <div>
          <h2
            className="text-xl text-[#1a1a1a] tracking-[0.05em] uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
          >
            Registrar Chegada de Viatura
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-0.5 w-6" style={{ background: "#dc2626" }} />
            <p className="text-[11px] text-[#999] tracking-wide">
              Informe a quilometragem atual
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

          {/* Departure Info Card */}
          <div
            className="p-4 space-y-3"
            style={{
              background: "rgba(0,0,0,0.015)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex items-center gap-2 pb-2" style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
              <Car size={16} className="text-[#1a1a1a]" />
              <h3
                className="text-sm text-[#1a1a1a] tracking-[0.05em] uppercase font-semibold"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Informações da Saída
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-[#999] tracking-[0.15em] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Viatura</p>
                <p className="text-sm text-[#1a1a1a] font-medium mt-0.5">
                  {movement.vehicle?.operationalPrefix} - {movement.vehicle?.plate}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-[#999] tracking-[0.15em] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Motorista</p>
                <p className="text-sm text-[#1a1a1a] font-medium mt-0.5">
                  {movement.personnel?.rank} {movement.personnel?.name}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-[#999] tracking-[0.15em] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Destino</p>
                <p className="text-sm text-[#1a1a1a] font-medium mt-0.5">{movement.destination}</p>
              </div>

              <div>
                <p className="text-[10px] text-[#999] tracking-[0.15em] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Horário de Saída</p>
                <p className="text-sm text-[#1a1a1a] font-medium mt-0.5">
                  {new Date(movement.departureTime).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-[#999] tracking-[0.15em] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>KM de Saída</p>
                <p className="text-sm text-[#1a1a1a] font-medium mt-0.5 tabular-nums">
                  {new Intl.NumberFormat("pt-BR").format(movement.departureKm)} km
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              className="block text-[10px] text-[#999] tracking-[0.15em] uppercase font-semibold"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              KM de Chegada <span className="text-[#dc2626]">*</span>
            </label>
            <input
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
              autoFocus
              style={{
                ...velInput,
                fontSize: "24px",
                fontWeight: 700,
                padding: "16px 14px",
                borderColor: formData.arrivalKm < movement.departureKm ? "#dc2626" : "#e5e5e5",
              }}
            />
            {formData.arrivalKm < movement.departureKm ? (
              <p className="text-[11px] text-[#dc2626] font-medium">
                KM de chegada deve ser maior ou igual ao KM de saída ({new Intl.NumberFormat("pt-BR").format(movement.departureKm)} km)
              </p>
            ) : (
              <p className="text-[10px] text-[#999]">
                Valor mínimo: {new Intl.NumberFormat("pt-BR").format(movement.departureKm)} km
              </p>
            )}
          </div>

          <div
            className="p-4"
            style={{
              background: "rgba(37,99,235,0.04)",
              borderLeft: "2px solid #2563eb",
            }}
          >
            <p className="text-[10px] text-[#999] tracking-[0.15em] uppercase mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Horário de Chegada</p>
            <p className="text-2xl font-bold text-[#2563eb] tabular-nums" style={{ fontFamily: "'Barlow', sans-serif" }}>
              {new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-[10px] text-[#999] mt-1">
              Horário será registrado automaticamente
            </p>
          </div>

          {kmTraveled >= 0 && (
            <div
              className="p-3"
              style={{
                background: "rgba(22,163,106,0.04)",
                borderLeft: "2px solid #16a34a",
              }}
            >
              <p className="text-sm text-[#16a34a] font-medium">
                <strong>Distância percorrida:</strong>{" "}
                {new Intl.NumberFormat("pt-BR").format(kmTraveled)} km
              </p>
            </div>
          )}

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
              disabled={isSubmitting || formData.arrivalKm < movement.departureKm}
              className="px-5 py-2.5 text-xs text-white tracking-wider uppercase transition-all hover:brightness-110 cursor-pointer disabled:opacity-40"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                background: "#dc2626",
                border: "none",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              {isSubmitting ? "Registrando..." : "Registrar Chegada"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

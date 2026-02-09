import { FormEvent, useState } from "react";
import { SimpleSelect } from "../common/SimpleSelect";
import { DatePicker } from "../common/DatePicker";
import { Id } from "../../../convex/_generated/dataModel";

interface MaintenanceFormData {
  vehicleId: Id<"vehicles"> | "";
  type: "preventive" | "corrective";
  status: "awaiting_ceman" | "in_progress" | "completed" | "cancelled" | "scheduled";
  seiProcessNumber?: string;
  sentDate?: Date;
  returnDate?: Date;
  location?: string;
  kmAtMaintenance: number;
  description: string;
  notes?: string;
}

interface MaintenanceFormProps {
  initialData?: Partial<MaintenanceFormData>;
  vehicles: Array<{
    _id: Id<"vehicles">;
    operationalPrefix: string;
    plate: string;
    currentKm: number;
  }>;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const velInput: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #e5e5e5",
  background: "#fff",
  color: "#1a1a1a",
  fontSize: 14,
  fontFamily: "'Barlow', sans-serif",
  clipPath:
    "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
  outline: "none",
};

const velLabel: React.CSSProperties = {
  display: "block",
  fontSize: 10,
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#999",
  marginBottom: 6,
};

const velBtnPrimary: React.CSSProperties = {
  background: "#dc2626",
  color: "#fff",
  padding: "8px 20px",
  border: "none",
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  fontSize: 13,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  clipPath:
    "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
  cursor: "pointer",
};

const velBtnOutline: React.CSSProperties = {
  background: "transparent",
  color: "#999",
  padding: "8px 20px",
  border: "1px solid rgba(0,0,0,0.1)",
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  fontSize: 13,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  clipPath:
    "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
  cursor: "pointer",
};

export function MaintenanceForm({
  initialData,
  vehicles,
  onSubmit,
  onCancel,
  isEdit = false,
}: MaintenanceFormProps) {
  const [formData, setFormData] = useState<MaintenanceFormData>(
    initialData
      ? {
          vehicleId: initialData.vehicleId || "",
          type: initialData.type || "preventive",
          status: initialData.status || "awaiting_ceman",
          seiProcessNumber: initialData.seiProcessNumber || "",
          sentDate: initialData.sentDate,
          returnDate: initialData.returnDate,
          location: initialData.location || "",
          kmAtMaintenance: initialData.kmAtMaintenance || 0,
          description: initialData.description || "",
          notes: initialData.notes || "",
        }
      : {
          vehicleId: "",
          type: "preventive",
          status: "awaiting_ceman",
          seiProcessNumber: "",
          sentDate: undefined,
          returnDate: undefined,
          location: "",
          kmAtMaintenance: 0,
          description: "",
          notes: "",
        }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (vehicles.length === 0) {
    return (
      <div
        className="text-center p-6"
        style={{
          borderLeft: "3px solid #ca8a04",
          background: "rgba(234,179,8,0.04)",
        }}
      >
        <h3
          className="text-sm"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#ca8a04",
          }}
        >
          Nenhuma viatura cadastrada
        </h3>
        <p className="mt-2 text-xs text-[#999]" style={{ fontFamily: "'Barlow', sans-serif" }}>
          É necessário cadastrar viaturas antes de criar uma manutenção.
        </p>
        <div className="mt-4">
          <button type="button" style={velBtnOutline} onClick={onCancel}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.vehicleId) {
      setError("Selecione uma viatura");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData: any = {
        type: formData.type,
        status: formData.status,
        kmAtMaintenance: formData.kmAtMaintenance,
        description: formData.description,
      };

      if (!isEdit) {
        submitData.vehicleId = formData.vehicleId;
      }

      if (formData.seiProcessNumber) {
        submitData.seiProcessNumber = formData.seiProcessNumber;
      }

      if (formData.sentDate) {
        submitData.sentDate = formData.sentDate.getTime();
      }

      if (formData.returnDate) {
        submitData.returnDate = formData.returnDate.getTime();
      }

      if (formData.location) {
        submitData.location = formData.location;
      }

      if (formData.notes) {
        submitData.notes = formData.notes;
      }

      await onSubmit(submitData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar manutenção");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedVehicle = vehicles.find((v) => v._id === formData.vehicleId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          className="p-3"
          style={{
            borderLeft: "2px solid #dc2626",
            background: "rgba(220,38,38,0.04)",
          }}
        >
          <p className="text-sm" style={{ color: "#dc2626", fontFamily: "'Barlow', sans-serif" }}>{error}</p>
        </div>
      )}

      <SimpleSelect
        label="Viatura"
        value={formData.vehicleId}
        onChange={(e) => {
          const sv = vehicles.find((v) => v._id === e.target.value);
          setFormData({
            ...formData,
            vehicleId: e.target.value as Id<"vehicles">,
            kmAtMaintenance: sv?.currentKm || 0,
          });
        }}
        options={vehicles.map((vehicle) => ({
          value: vehicle._id,
          label: `${vehicle.operationalPrefix} - ${vehicle.plate}`,
        }))}
        placeholder="Selecione a viatura"
        required
        disabled={isEdit}
      />

      {selectedVehicle && (
        <div
          className="p-2 text-xs"
          style={{
            borderLeft: "2px solid #2563eb",
            background: "rgba(37,99,235,0.04)",
            fontFamily: "'Barlow', sans-serif",
            color: "#999",
          }}
        >
          KM atual da viatura:{" "}
          <span className="font-semibold" style={{ color: "#2563eb" }}>
            {new Intl.NumberFormat("pt-BR").format(selectedVehicle.currentKm)} km
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SimpleSelect
          label="Tipo"
          value={formData.type}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as "preventive" | "corrective",
            })
          }
          options={[
            { value: "preventive", label: "Preventiva" },
            { value: "corrective", label: "Corretiva" },
          ]}
          required
        />

        <SimpleSelect
          label="Status"
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as MaintenanceFormData["status"],
            })
          }
          options={[
            { value: "awaiting_ceman", label: "Aguardando CEMAN" },
            { value: "in_progress", label: "Em Andamento" },
            { value: "completed", label: "Concluída" },
            { value: "cancelled", label: "Cancelada" },
          ]}
          required
        />
      </div>

      <div>
        <label style={velLabel}>
          Descrição <span style={{ color: "#dc2626" }}>*</span>
        </label>
        <input
          style={velInput}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Ex: Troca de óleo e filtros"
          required
        />
      </div>

      <div>
        <label style={velLabel}>
          KM na Manutenção <span style={{ color: "#dc2626" }}>*</span>
        </label>
        <input
          type="number"
          style={velInput}
          value={formData.kmAtMaintenance}
          onChange={(e) =>
            setFormData({
              ...formData,
              kmAtMaintenance: parseInt(e.target.value) || 0,
            })
          }
          min={0}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label style={velLabel}>Data de Envio</label>
          <DatePicker
            value={formData.sentDate}
            onChange={(date) => setFormData({ ...formData, sentDate: date })}
            placeholder="Selecione a data de envio"
          />
        </div>

        <div>
          <label style={velLabel}>Data de Retorno</label>
          <DatePicker
            value={formData.returnDate}
            onChange={(date) => setFormData({ ...formData, returnDate: date })}
            placeholder="Selecione a data de retorno"
          />
        </div>
      </div>

      <div>
        <label style={velLabel}>Oficina</label>
        <input
          style={velInput}
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="Ex: Oficina Central, Terceirizada XYZ"
        />
      </div>

      <div>
        <label style={velLabel}>Número do Processo SEI</label>
        <input
          style={velInput}
          value={formData.seiProcessNumber}
          onChange={(e) =>
            setFormData({ ...formData, seiProcessNumber: e.target.value })
          }
          placeholder="Ex: 20250001100000"
        />
      </div>

      <div>
        <label style={velLabel}>Observações</label>
        <input
          style={velInput}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Anotações adicionais sobre a manutenção"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={isSubmitting} style={{ ...velBtnPrimary, opacity: isSubmitting ? 0.6 : 1 }}>
          {isSubmitting ? "Salvando..." : isEdit ? "Atualizar" : "Cadastrar"}
        </button>
        <button type="button" style={velBtnOutline} onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

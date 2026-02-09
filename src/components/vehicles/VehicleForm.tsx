import { FormEvent, useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { SimpleSelect } from "../common/SimpleSelect";

interface VehicleFormData {
  plate: string;
  brand: string;
  model: string;
  year: number;
  chassisNumber: string;
  renavam: string;
  operationalPrefix: string;
  typeId: Id<"vehicleTypes"> | "";
  nextMaintenanceKm?: number;
  ownershipType: "propria" | "locada";
  serviceType: "operational" | "backup";
}

interface VehicleFormProps {
  initialData?: VehicleFormData;
  vehicleTypes: Array<{
    _id: Id<"vehicleTypes">;
    name: string;
    description: string;
  }>;
  onSubmit: (data: VehicleFormData) => Promise<void>;
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

export function VehicleForm({
  initialData,
  vehicleTypes,
  onSubmit,
  onCancel,
  isEdit = false,
}: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>(
    initialData || {
      plate: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      chassisNumber: "",
      renavam: "",
      operationalPrefix: "",
      typeId: "",
      nextMaintenanceKm: undefined,
      ownershipType: "propria",
      serviceType: "operational",
    },
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (vehicleTypes.length === 0) {
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
          Nenhum tipo de viatura cadastrado
        </h3>
        <p className="mt-2 text-xs text-[#999]" style={{ fontFamily: "'Barlow', sans-serif" }}>
          É necessário cadastrar tipos de viatura antes de criar uma nova viatura.
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

    if (!formData.typeId) {
      setError("Selecione um tipo de viatura");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar viatura");
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label style={velLabel}>
            Prefixo Operacional <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            style={velInput}
            value={formData.operationalPrefix}
            onChange={(e) =>
              setFormData({ ...formData, operationalPrefix: e.target.value })
            }
            placeholder="Ex: ABT-01"
            required
          />
        </div>

        <div>
          <label style={velLabel}>
            Placa <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            style={velInput}
            value={formData.plate}
            onChange={(e) =>
              setFormData({ ...formData, plate: e.target.value.toUpperCase() })
            }
            placeholder="Ex: ABC-1234"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SimpleSelect
          label="Tipo de Viatura"
          value={formData.typeId}
          onChange={(e) =>
            setFormData({
              ...formData,
              typeId: e.target.value as Id<"vehicleTypes">,
            })
          }
          options={vehicleTypes.map((type) => ({
            value: type._id,
            label: `${type.name} - ${type.description}`,
          }))}
          placeholder="Selecione o tipo"
          required
        />

        <div>
          <label style={velLabel}>
            Marca <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            style={velInput}
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            placeholder="Ex: Mercedes-Benz"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label style={velLabel}>
            Modelo <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            style={velInput}
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
            placeholder="Ex: Atego 1719"
            required
          />
        </div>

        <div>
          <label style={velLabel}>
            Ano <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            type="number"
            style={velInput}
            value={formData.year}
            onChange={(e) =>
              setFormData({ ...formData, year: parseInt(e.target.value) })
            }
            min={1980}
            max={new Date().getFullYear() + 1}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label style={velLabel}>
            N° Chassi <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            style={velInput}
            value={formData.chassisNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                chassisNumber: e.target.value.toUpperCase(),
              })
            }
            placeholder="Ex: 9BW..."
            required
          />
        </div>

        <div>
          <label style={velLabel}>
            Renavam <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            style={velInput}
            value={formData.renavam}
            onChange={(e) =>
              setFormData({ ...formData, renavam: e.target.value })
            }
            placeholder="Ex: 12345678900"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label style={velLabel}>Próxima Revisão (km)</label>
          <input
            type="number"
            style={velInput}
            value={formData.nextMaintenanceKm || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                nextMaintenanceKm: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            min={0}
            placeholder="Ex: 15000"
          />
          <p className="text-[10px] text-[#999] mt-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Opcional - KM da próxima manutenção preventiva
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SimpleSelect
          label="Propriedade"
          value={formData.ownershipType}
          onChange={(e) =>
            setFormData({
              ...formData,
              ownershipType: e.target.value as VehicleFormData["ownershipType"],
            })
          }
          options={[
            { value: "propria", label: "Própria" },
            { value: "locada", label: "Locada" },
          ]}
          required
        />

        <SimpleSelect
          label="Uso Atual"
          value={formData.serviceType}
          onChange={(e) =>
            setFormData({
              ...formData,
              serviceType: e.target.value as VehicleFormData["serviceType"],
            })
          }
          options={[
            { value: "operational", label: "Serviço Operacional" },
            { value: "backup", label: "Backup" },
          ]}
          required
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

import { FormEvent, useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { SimpleSelect } from "../common/SimpleSelect";

interface IssueFormData {
  vehicleId: Id<"vehicles"> | "";
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status?: "open" | "in_progress" | "resolved" | "closed";
}

interface IssueFormProps {
  initialData?: IssueFormData;
  vehicles: Array<{
    _id: Id<"vehicles">;
    operationalPrefix: string;
    plate: string;
  }>;
  onSubmit: (data: IssueFormData) => Promise<void>;
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

const velTextarea: React.CSSProperties = {
  ...velInput,
  resize: "vertical" as const,
  minHeight: 100,
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

export function IssueForm({
  initialData,
  vehicles,
  onSubmit,
  onCancel,
  isEdit = false,
}: IssueFormProps) {
  const [formData, setFormData] = useState<IssueFormData>(
    initialData || {
      vehicleId: "",
      title: "",
      description: "",
      severity: "medium",
      status: "open",
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.vehicleId) {
      setError("Selecione uma viatura");
      return;
    }

    if (!formData.title.trim()) {
      setError("O título é obrigatório");
      return;
    }

    if (!formData.description.trim()) {
      setError("A descrição é obrigatória");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar problema");
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

      <SimpleSelect
        label="Viatura"
        value={formData.vehicleId}
        onChange={(e) =>
          setFormData({
            ...formData,
            vehicleId: e.target.value as Id<"vehicles">,
          })
        }
        options={vehicles.map((vehicle) => ({
          value: vehicle._id,
          label: `${vehicle.operationalPrefix} - ${vehicle.plate}`,
        }))}
        placeholder="Selecione a viatura"
        required
        disabled={isEdit}
      />

      <div>
        <label style={velLabel}>
          Título <span style={{ color: "#dc2626" }}>*</span>
        </label>
        <input
          style={velInput}
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          placeholder="Ex: Pneu furado, luz queimada, etc."
          required
        />
      </div>

      <div>
        <label style={velLabel}>
          Descrição <span style={{ color: "#dc2626" }}>*</span>
        </label>
        <textarea
          style={velTextarea}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Descreva o problema em detalhes..."
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SimpleSelect
          label="Gravidade"
          value={formData.severity}
          onChange={(e) =>
            setFormData({
              ...formData,
              severity: e.target.value as IssueFormData["severity"],
            })
          }
          options={[
            { value: "low", label: "Baixa" },
            { value: "medium", label: "Média" },
            { value: "high", label: "Alta" },
            { value: "critical", label: "Crítica" },
          ]}
          required
        />

        {isEdit && (
          <SimpleSelect
            label="Status"
            value={formData.status || "open"}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as IssueFormData["status"],
              })
            }
            options={[
              { value: "open", label: "Aberto" },
              { value: "in_progress", label: "Em Andamento" },
              { value: "resolved", label: "Resolvido" },
              { value: "closed", label: "Fechado" },
            ]}
            required
          />
        )}
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

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-md p-3">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
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

      <div className="space-y-2">
        <Label htmlFor="title">
          Título <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          placeholder="Ex: Pneu furado, luz queimada, etc."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Descrição <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : isEdit ? "Atualizar" : "Cadastrar"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

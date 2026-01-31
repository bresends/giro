import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  color?: string;
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
      color: undefined,
      ownershipType: "propria",
      serviceType: "operational",
    },
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (vehicleTypes.length === 0) {
    return (
      <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">
          Nenhum tipo de viatura cadastrado
        </h3>
        <p className="mt-2 text-yellow-700 dark:text-yellow-300">
          É necessário cadastrar tipos de viatura antes de criar uma nova
          viatura. Entre em contato com o administrador do sistema.
        </p>
        <div className="mt-4">
          <Button variant="secondary" onClick={onCancel}>
            Voltar
          </Button>
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
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-md p-3">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="operationalPrefix">
            Prefixo Operacional <span className="text-red-500">*</span>
          </Label>
          <Input
            id="operationalPrefix"
            value={formData.operationalPrefix}
            onChange={(e) =>
              setFormData({ ...formData, operationalPrefix: e.target.value })
            }
            placeholder="Ex: ABT-01"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="plate">
            Placa <span className="text-red-500">*</span>
          </Label>
          <Input
            id="plate"
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

        <div className="space-y-2">
          <Label htmlFor="brand">
            Marca <span className="text-red-500">*</span>
          </Label>
          <Input
            id="brand"
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
        <div className="space-y-2">
          <Label htmlFor="model">
            Modelo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
            placeholder="Ex: Atego 1719"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">
            Ano <span className="text-red-500">*</span>
          </Label>
          <Input
            id="year"
            type="number"
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
        <div className="space-y-2">
          <Label htmlFor="chassisNumber">
            N° Chassi <span className="text-red-500">*</span>
          </Label>
          <Input
            id="chassisNumber"
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

        <div className="space-y-2">
          <Label htmlFor="renavam">
            Renavam <span className="text-red-500">*</span>
          </Label>
          <Input
            id="renavam"
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
        <div className="space-y-2">
          <Label htmlFor="nextMaintenanceKm">
            Próxima Revisão (km)
          </Label>
          <Input
            id="nextMaintenanceKm"
            type="number"
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
          <p className="text-xs text-muted-foreground">
            Opcional - KM da próxima manutenção preventiva
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">
            Cor
          </Label>
          <Input
            id="color"
            value={formData.color || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                color: e.target.value || undefined,
              })
            }
            placeholder="Ex: Vermelho, Branco"
          />
          <p className="text-xs text-muted-foreground">
            Opcional - Cor da viatura
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

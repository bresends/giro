import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { SimpleSelect } from "../common/SimpleSelect";
import { DatePicker } from "../common/DatePicker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
      <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">
          Nenhuma viatura cadastrada
        </h3>
        <p className="mt-2 text-yellow-700 dark:text-yellow-300">
          É necessário cadastrar viaturas antes de criar uma manutenção.
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

    if (!formData.vehicleId) {
      setError("Selecione uma viatura");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert dates to timestamps
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
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-md p-3">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <SimpleSelect
        label="Viatura"
        value={formData.vehicleId}
        onChange={(e) => {
          const selectedVehicle = vehicles.find((v) => v._id === e.target.value);
          setFormData({
            ...formData,
            vehicleId: e.target.value as Id<"vehicles">,
            kmAtMaintenance: selectedVehicle?.currentKm || 0,
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
        <div className="text-sm text-muted-foreground">
          KM atual da viatura:{" "}
          <span className="font-semibold">
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

      <div className="space-y-2">
        <Label htmlFor="description">
          Descrição <span className="text-red-500">*</span>
        </Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Ex: Troca de óleo e filtros"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="kmAtMaintenance">
          KM na Manutenção <span className="text-red-500">*</span>
        </Label>
        <Input
          id="kmAtMaintenance"
          type="number"
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
        <div className="space-y-2">
          <Label htmlFor="sentDate">Data de Envio</Label>
          <DatePicker
            value={formData.sentDate}
            onChange={(date) => setFormData({ ...formData, sentDate: date })}
            placeholder="Selecione a data de envio"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="returnDate">Data de Retorno</Label>
          <DatePicker
            value={formData.returnDate}
            onChange={(date) => setFormData({ ...formData, returnDate: date })}
            placeholder="Selecione a data de retorno"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Oficina</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="Ex: Oficina Central, Terceirizada XYZ"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="seiProcessNumber">Número do Processo SEI</Label>
        <Input
          id="seiProcessNumber"
          value={formData.seiProcessNumber}
          onChange={(e) =>
            setFormData({ ...formData, seiProcessNumber: e.target.value })
          }
          placeholder="Ex: 20250001100000"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Anotações adicionais sobre a manutenção"
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

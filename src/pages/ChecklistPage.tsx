import { useMutation, useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { parseRoteiro } from "@/components/checklist/parseRoteiro";
import {
  ChecklistConferenceStep,
  ChecklistIdentifyStep,
  ChecklistSentStep,
  type ChecklistRole,
  type ChecklistVehicle,
} from "@/components/checklist/ChecklistSteps";
import { giroCombobox } from "@/components/giro/styles";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { shiftWindowAt } from "@/lib/giro";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

type Step = "identificar" | "conferir" | "enviado";

export function ChecklistPage() {
  const [searchParams] = useSearchParams();
  const opFunctions = useQuery(api.vehicleChecklists.listOperationalFunctions, { activeOnly: true });
  const vehicles = useQuery(api.vehicles.list, {});
  const shiftWindow = useMemo(() => shiftWindowAt(), []);
  const dailyStatus = useQuery(api.vehicleChecklists.listDailyStatus, shiftWindow);
  const viewer = useQuery(api.auth.viewer);
  const submitChecklist = useMutation(api.vehicleChecklists.submitChecklist);

  const [step, setStep] = useState<Step>("identificar");
  // null = ainda segue o QR code; "" = escolha manual vazia
  const [manualFunctionId, setManualFunctionId] = useState<Id<"operationalFunctions"> | "" | null>(null);
  const [role, setRole] = useState<ChecklistRole | "">("");
  const [hasAlterations, setHasAlterations] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<number | null>(null);

  // Função vinculada à viatura do QR code (?vehicleId=)
  const qrVehicleId = searchParams.get("vehicleId");
  const qrFunction = useMemo(
    () => (qrVehicleId && opFunctions ? opFunctions.find((f) => f.currentVehicleId === qrVehicleId) ?? null : null),
    [qrVehicleId, opFunctions],
  );
  const fromQr = manualFunctionId === null && qrFunction !== null;
  const functionId = manualFunctionId ?? qrFunction?._id ?? "";

  useEffect(() => {
    if (qrVehicleId && opFunctions && !qrFunction) {
      toast.error("Nenhuma função operacional ativa está vinculada a esta viatura no momento.");
    }
  }, [qrVehicleId, opFunctions, qrFunction]);

  const selectedFunction = opFunctions?.find((f) => f._id === functionId);
  const isVehicleLinked = !!selectedFunction?.vehicle;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  const template = useQuery(
    api.vehicleChecklists.getTemplate,
    functionId && role ? { operationalFunctionId: functionId, role } : "skip",
  );
  const roteiro = useMemo(() => (template ? parseRoteiro(template.content) : null), [template]);

  const vehicleInfo: ChecklistVehicle | null = useMemo(() => {
    const v = selectedFunction?.vehicle;
    if (!v) return null;
    const full = vehicles?.find((x) => x._id === v._id);
    return {
      prefix: v.operationalPrefix,
      plate: v.plate,
      model: v.model,
      subtitle: full ? `${full.brand} · ${full.year}` : null,
      type: full?.type?.name ?? null,
      currentKm: full?.currentKm ?? null,
      nextMaintenanceKm: full?.nextMaintenanceKm ?? null,
      situation: full?.inMaintenance ? "Em manutenção" : full?.serviceType === "backup" ? "Reserva" : "Operacional",
    };
  }, [selectedFunction, vehicles]);

  const status = dailyStatus?.find((d) => d.operationalFunctionId === functionId);

  const functionItems = (opFunctions ?? []).map((f) => ({
    value: f._id,
    label: f.vehicle ? `${f.name} · ${f.vehicle.operationalPrefix}` : `${f.name} · sem viatura vinculada`,
  }));

  const handleSubmit = async () => {
    if (!functionId || !role) {
      toast.error("Selecione a viatura e o papel de serviço");
      return;
    }
    if (!isVehicleLinked) {
      toast.error("Não é possível enviar o checklist sem uma viatura vinculada.");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitChecklist({ operationalFunctionId: functionId, role, hasAlterations });
      setSubmittedAt(Date.now());
      setStep("enviado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao enviar checklist");
    } finally {
      setIsSubmitting(false);
    }
  };

  const restart = () => {
    setRole("");
    setHasAlterations(false);
    setSubmittedAt(null);
    setStep("identificar");
  };

  if (step === "enviado" && vehicleInfo && role) {
    return (
      <ChecklistSentStep
        vehicle={vehicleInfo}
        role={role}
        submittedAt={submittedAt}
        militar={viewer?.name || viewer?.email || "—"}
        hasAlterations={hasAlterations}
        onDone={restart}
      />
    );
  }

  if (step === "conferir" && vehicleInfo && role) {
    return (
      <ChecklistConferenceStep
        vehicle={vehicleInfo}
        role={role}
        onBack={() => setStep("identificar")}
        template={template}
        roteiro={roteiro}
        hasAlterations={hasAlterations}
        onAlterationsChange={setHasAlterations}
        onSubmit={() => void handleSubmit()}
        submitting={isSubmitting}
        canSubmit={!!template && isVehicleLinked}
      />
    );
  }

  const showPicker = !fromQr || !functionId;

  return (
    <ChecklistIdentifyStep
      fromQr={fromQr && !!functionId}
      picker={
        showPicker ? (
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium" htmlFor="checklist-viatura">
              Viatura
            </label>
            <Combobox
              items={functionItems}
              value={functionItems.find((f) => f.value === functionId) || null}
              onValueChange={(v) => {
                setManualFunctionId(v ? v.value : "");
                setRole("");
              }}
            >
              <ComboboxInput
                id="checklist-viatura"
                placeholder={opFunctions === undefined ? "Carregando..." : "Buscar viatura ou função"}
                className={giroCombobox}
              />
              <ComboboxContent className="giro-ui font-giro">
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
        ) : null
      }
      unlinkedFunctionName={functionId && !isVehicleLinked ? (selectedFunction?.name ?? "") : null}
      vehicle={vehicleInfo}
      role={role}
      onRoleChange={setRole}
      submissions={{ comandante: status?.comandante ?? null, motorista: status?.motorista ?? null }}
      onStart={() => setStep("conferir")}
      onChooseManually={() => setManualFunctionId(qrFunction?._id ?? "")}
    />
  );
}

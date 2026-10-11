import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleCheckFill,
  PaperPlane,
  QrCode,
} from "@gravity-ui/icons";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { parseRoteiro } from "@/components/checklist/parseRoteiro";
import { GiroButton } from "@/components/giro/giro-button";
import { giroCombobox } from "@/components/giro/styles";
import { VehicleIllustration } from "@/components/giro/VehicleIllustration";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { formatKm, formatTime, shiftWindowAt } from "@/lib/giro";
import { cn } from "@/lib/utils";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { RichTextRenderer } from "../components/common/RichTextRenderer";

type Role = "motorista" | "comandante";
type Step = "identificar" | "conferir" | "enviado";

const ROLE_LABEL: Record<Role, string> = { comandante: "Comandante", motorista: "Motorista" };

interface VehicleInfo {
  prefix: string;
  plate: string;
  model: string;
  subtitle: string | null;
  type: string | null;
  currentKm: number | null;
  nextMaintenanceKm: number | null;
  situation: string;
}

function VehicleCard({ vehicle }: { vehicle: VehicleInfo }) {
  return (
    <div className="flex flex-col gap-3.5 rounded-[20px] bg-giro-neutral p-4 text-giro-neutral-foreground">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-lg border border-giro-separator bg-white px-2 py-1 text-[13px] font-bold tracking-[0.5px]">
          {vehicle.prefix}
        </span>
        <span className="text-xs text-giro-neutral-muted">Placa {vehicle.plate}</span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-[30px] leading-tight font-bold tracking-[-0.8px]">{vehicle.model}</span>
          {vehicle.subtitle && <span className="text-xs text-giro-neutral-muted">{vehicle.subtitle}</span>}
        </div>
        <VehicleIllustration type={vehicle.type} className="h-[72px] w-24 shrink-0" />
      </div>
      <dl className="grid grid-cols-3 gap-3 border-t border-[#16191C1A] pt-3">
        {[
          ["KM atual", formatKm(vehicle.currentKm)],
          ["Próx. manutenção", vehicle.nextMaintenanceKm != null ? formatKm(vehicle.nextMaintenanceKm, true) : "—"],
          ["Situação", vehicle.situation],
        ].map(([label, value]) => (
          <div key={label} className="flex min-w-0 flex-col gap-0.5">
            <dt className="text-[11px] text-giro-neutral-muted">{label}</dt>
            <dd className="truncate text-sm font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Rodapé fixo das telas do celular, com a ação principal. */
function StickyFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-auto flex flex-col items-center gap-3 border-t border-giro-separator bg-white px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:-mx-6 sm:px-6">
      {children}
    </div>
  );
}

function RadioCard({
  name,
  checked,
  onChange,
  label,
  sub,
  subClassName,
  tone = "neutral",
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  sub: string;
  subClassName?: string;
  tone?: "neutral" | "warning";
}) {
  const warning = tone === "warning" && checked;
  return (
    <label
      className={cn(
        "flex min-h-16 cursor-pointer items-center gap-3.5 rounded-[18px] px-4 py-3.5 transition-colors duration-150 has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-giro-accent/30",
        warning
          ? "bg-giro-warning text-giro-warning-foreground"
          : checked
            ? "bg-white ring-2 ring-giro-fg ring-inset"
            : "bg-white ring-1 ring-giro-default ring-inset hover:ring-giro-muted/40",
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-[22px] shrink-0 items-center justify-center rounded-full",
          warning
            ? "bg-giro-warning-foreground text-giro-warning"
            : checked
              ? "border-[7px] border-giro-fg"
              : "border-2 border-giro-default",
        )}
      >
        {warning && <Check className="size-3.5" />}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-base font-semibold">{label}</span>
        <span className={cn("text-[13px]", warning ? "text-giro-warning-foreground" : "text-giro-muted", subClassName)}>
          {sub}
        </span>
      </span>
    </label>
  );
}

function SeiNotice({ after }: { after?: boolean }) {
  return (
    <div className="flex flex-col gap-[3px] rounded-2xl bg-giro-warning-soft px-4 py-3.5 text-giro-warning-soft-foreground">
      <p className="text-sm font-semibold">Próximo passo: documento no SEI</p>
      <p className="text-[13px]">
        {after
          ? "Relate as alterações no SEI e encaminhe ao Chefe da SGP. A administração acompanha o processo a partir deste envio."
          : "Depois de enviar, relate as alterações no SEI e encaminhe ao Chefe da SGP."}
      </p>
    </div>
  );
}

function Guidelines() {
  return (
    <details className="group rounded-[20px] bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-[20px] px-[18px] py-3.5 outline-none focus-visible:ring-[3px] focus-visible:ring-giro-accent/30 [&::-webkit-details-marker]:hidden">
        <span className="text-[15px] font-semibold">Orientações gerais</span>
        <ChevronDown aria-hidden="true" className="size-[18px] text-giro-muted transition-transform group-open:rotate-180" />
      </summary>
      <div className="flex flex-col gap-3 px-[18px] pb-4 text-sm leading-relaxed">
        <p>Fica estabelecido que o presente Check List de Viatura terá caráter exclusivamente descritivo.</p>
        <p>
          Caso sejam identificadas inconsistências, ausências, avarias, extravios, substituições ou quaisquer divergências
          durante a conferência, deverá ser <strong>obrigatoriamente</strong> confeccionado documento oficial via Sistema
          Eletrônico de Informações (SEI), encaminhado ao Chefe da SGP para ciência e providências cabíveis.
        </p>
        <p>
          Cada constatação de alteração, inconsistência, ausência ou avaria deverá ser formalizada em{" "}
          <strong>novo processo</strong> SEI específico, destinado ao Chefe da SGP.
        </p>
        <p>
          O procedimento tem por finalidade facilitar o controle individualizado das alterações constatadas pelos
          militares durante o serviço operacional.
        </p>
        <p>
          Não havendo alterações ou inconsistências, será suficiente o registro da expressão{" "}
          <strong>“Sem alterações”</strong> no campo correspondente ao final do Check List.
        </p>
      </div>
    </details>
  );
}

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
  const [role, setRole] = useState<Role | "">("");
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
  const itemTotal = roteiro?.reduce((sum, s) => sum + s.items.length, 0) ?? 0;

  const vehicleInfo: VehicleInfo | null = useMemo(() => {
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

  const column = "mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-md flex-col px-4 sm:px-6 lg:min-h-[calc(100dvh-4rem)]";

  // ── Passo 3: enviado ───────────────────────────────────────────────
  if (step === "enviado" && vehicleInfo && role) {
    return (
      <div className={column}>
        <div className="flex flex-col gap-7 pt-5 pb-7">
          <div className="flex flex-col gap-3.5 rounded-3xl bg-giro-neutral p-[18px] text-giro-neutral-foreground motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-200">
            <span className="inline-flex h-7 w-fit items-center gap-1.5 rounded-full bg-white pr-3 pl-2 text-[13px] font-semibold">
              <CircleCheckFill className="size-4 text-giro-success" />
              Enviado às {submittedAt ? formatTime(submittedAt) : "—"}
            </span>
            <div className="flex items-end justify-between gap-2">
              <div className="flex min-w-0 flex-col gap-1">
                <h1 className="text-[28px] leading-tight font-bold tracking-[-0.6px]">Checklist enviado</h1>
                <p className="text-sm text-giro-neutral-muted">
                  {vehicleInfo.prefix} · {ROLE_LABEL[role]}
                </p>
              </div>
              <VehicleIllustration type={vehicleInfo.type} className="h-[90px] w-[120px] shrink-0" />
            </div>
          </div>

          <section aria-labelledby="resumo-envio" className="flex flex-col gap-3">
            <h2 id="resumo-envio" className="text-[17px] font-semibold">Resumo</h2>
            <dl className="rounded-[20px] bg-white px-[18px] py-2">
              {[
                ["Viatura", `${vehicleInfo.prefix} · ${vehicleInfo.model}`],
                ["Papel", ROLE_LABEL[role]],
                ["Militar", viewer?.name || viewer?.email || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 border-b border-giro-separator py-2.5">
                  <dt className="text-sm text-giro-muted">{label}</dt>
                  <dd className="truncate text-[15px] font-semibold">{value}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-3 py-2.5">
                <dt className="text-sm text-giro-muted">Resultado</dt>
                <dd
                  className={cn(
                    "inline-flex h-[26px] items-center rounded-full px-3 text-[13px] font-semibold",
                    hasAlterations
                      ? "bg-giro-warning text-giro-warning-foreground"
                      : "bg-giro-success-soft text-giro-success-soft-foreground",
                  )}
                >
                  {hasAlterations ? "Com alterações" : "Sem alterações"}
                </dd>
              </div>
            </dl>
          </section>

          {hasAlterations ? (
            <SeiNotice after />
          ) : (
            <p className="rounded-2xl bg-giro-success-soft px-4 py-3.5 text-sm font-medium text-giro-success-soft-foreground">
              Procedimento concluído. Viatura liberada sem alterações.
            </p>
          )}
        </div>

        <StickyFooter>
          <GiroButton variant="primary" size="xl" className="w-full" onClick={restart}>
            Concluir
          </GiroButton>
        </StickyFooter>
      </div>
    );
  }

  // ── Passo 2: conferência ───────────────────────────────────────────
  if (step === "conferir" && vehicleInfo && role) {
    return (
      <div className={column}>
        <div className="flex flex-col gap-7 pt-5 pb-7">
          <div className="flex flex-col gap-3.5">
            <GiroButton variant="secondary" size="sm" className="w-fit pr-3.5 pl-2.5 text-sm" onClick={() => setStep("identificar")}>
              <ArrowLeft />
              Voltar
            </GiroButton>
            <div className="flex flex-col gap-1">
              <h1 className="text-[30px] leading-tight font-semibold tracking-[-0.6px]">Conferência</h1>
              <p className="text-sm text-giro-muted">Conferência do {ROLE_LABEL[role].toLowerCase()}</p>
            </div>
          </div>

          <VehicleCard vehicle={vehicleInfo} />

          <Guidelines />

          <section aria-labelledby="roteiro-titulo" className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <h2 id="roteiro-titulo" className="text-[17px] font-semibold">Roteiro</h2>
              {roteiro && (
                <span className="inline-flex h-[22px] items-center rounded-full bg-giro-default px-2 text-xs font-semibold">
                  {itemTotal} {itemTotal === 1 ? "item" : "itens"}
                </span>
              )}
            </div>

            {template === undefined ? (
              <p className="rounded-[20px] bg-white px-[18px] py-6 text-sm text-giro-muted">Carregando roteiro...</p>
            ) : template === null ? (
              <p className="rounded-[20px] bg-giro-accent-soft px-[18px] py-4 text-sm font-medium text-giro-accent-soft-foreground">
                Nenhum checklist cadastrado para esta função e papel. Fale com a SGP antes de enviar.
              </p>
            ) : roteiro ? (
              roteiro.map((section, si) => {
                const offset = roteiro.slice(0, si).reduce((sum, s) => sum + s.items.length, 0);
                return (
                  <div key={`${section.title}-${si}`} className="overflow-hidden rounded-[20px] bg-white">
                    <div className="flex items-center justify-between gap-2 bg-giro-neutral px-[18px] py-3.5 text-giro-neutral-foreground">
                      <h3 className="text-base font-semibold">{section.title}</h3>
                      <span className="shrink-0 text-[13px] text-giro-neutral-muted">
                        {section.items.length} {section.items.length === 1 ? "item" : "itens"}
                      </span>
                    </div>
                    <ol className="px-[18px] py-0.5">
                      {section.items.map((item, ii) => (
                        <li key={ii} className="flex gap-3.5 border-b border-giro-separator py-3.5 last:border-b-0">
                          <span className="w-5 shrink-0 text-[13px] font-semibold text-giro-muted tabular-nums">
                            {String(offset + ii + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 text-[15px]">{item}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[20px] bg-white px-[18px] py-4">
                <RichTextRenderer content={template.content} />
              </div>
            )}
            {template && (
              <p className="px-1 text-xs text-giro-muted">
                Roteiro atualizado em {new Date(template.updatedAt).toLocaleDateString("pt-BR")} às{" "}
                {formatTime(template.updatedAt)}
              </p>
            )}
          </section>

          {template && (
            <section aria-labelledby="resultado-titulo" className="flex flex-col gap-3">
              <h2 id="resultado-titulo" className="text-[17px] font-semibold">Resultado</h2>
              <div role="radiogroup" aria-labelledby="resultado-titulo" className="flex flex-col gap-2.5">
                <RadioCard
                  name="resultado"
                  checked={!hasAlterations}
                  onChange={() => setHasAlterations(false)}
                  label="Sem alterações"
                  sub="Tudo conforme o roteiro"
                />
                <RadioCard
                  name="resultado"
                  checked={hasAlterations}
                  onChange={() => setHasAlterations(true)}
                  label="Com alterações"
                  sub="Algo diferente do roteiro"
                  tone="warning"
                />
              </div>
              {hasAlterations && <SeiNotice />}
            </section>
          )}
        </div>

        <StickyFooter>
          <GiroButton
            variant="primary"
            size="xl"
            className="w-full"
            onClick={() => void handleSubmit()}
            disabled={isSubmitting || !template || !isVehicleLinked}
          >
            <PaperPlane />
            {isSubmitting ? "Enviando..." : "Enviar checklist"}
          </GiroButton>
        </StickyFooter>
      </div>
    );
  }

  // ── Passo 1: viatura e papel ───────────────────────────────────────
  const showPicker = !fromQr || !functionId;

  return (
    <div className={column}>
      <div className="flex flex-col gap-4 pt-5 pb-7">
        {fromQr && functionId ? (
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-giro-success-soft-foreground">
            <QrCode className="size-4 text-giro-success" />
            Viatura identificada pelo QR code
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.5px]">Checklist de viatura</h1>
            <p className="text-sm text-giro-muted">Escolha a viatura que você vai conferir neste plantão.</p>
          </div>
        )}

        {showPicker && (
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
              <ComboboxContent className="font-giro">
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
        )}

        {functionId && !isVehicleLinked && (
          <div role="alert" className="rounded-2xl bg-giro-accent-soft px-4 py-3.5 text-giro-accent-soft-foreground">
            <p className="text-sm font-semibold">Viatura não vinculada</p>
            <p className="text-[13px]">
              A função {selectedFunction?.name} está sem viatura física vinculada. Fale com a SGP; o checklist fica
              bloqueado até a vinculação.
            </p>
          </div>
        )}

        {vehicleInfo && <VehicleCard vehicle={vehicleInfo} />}

        {vehicleInfo && (
          <fieldset className="mt-1 flex flex-col gap-2.5">
            <legend className="mb-2.5 text-[13px] font-semibold text-giro-muted">
              Checklist de hoje · você vai conferir como
            </legend>
            {(["comandante", "motorista"] as const).map((r) => {
              const sent = status?.[r];
              return (
                <RadioCard
                  key={r}
                  name="papel"
                  checked={role === r}
                  onChange={() => setRole(r)}
                  label={ROLE_LABEL[r]}
                  sub={sent ? `Enviado às ${formatTime(sent.createdAt)} por ${sent.userName}` : "Pendente"}
                  subClassName={sent ? undefined : "font-semibold text-giro-amber"}
                />
              );
            })}
          </fieldset>
        )}
      </div>

      <StickyFooter>
        <GiroButton
          variant="primary"
          size="xl"
          className="w-full"
          disabled={!vehicleInfo || !role}
          onClick={() => setStep("conferir")}
        >
          Iniciar conferência
          <ArrowRight />
        </GiroButton>
        {fromQr && functionId && (
          <button
            type="button"
            onClick={() => setManualFunctionId(qrFunction?._id ?? "")}
            className="rounded-full px-3 py-1 text-[13px] font-medium text-giro-muted outline-none hover:text-giro-fg focus-visible:ring-[3px] focus-visible:ring-giro-accent/30"
          >
            Não é esta viatura? Escolher manualmente
          </button>
        )}
      </StickyFooter>
    </div>
  );
}

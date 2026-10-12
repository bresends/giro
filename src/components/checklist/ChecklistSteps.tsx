import { ArrowLeft, ArrowRight, Check, ChevronDown, CircleCheck, ScanQrCode, Send } from "lucide-react";
import { GiroButton } from "@/components/giro/giro-button";
import { VehicleIllustration } from "@/components/giro/VehicleIllustration";
import { formatKm, formatTime } from "@/lib/giro";
import { cn } from "@/lib/utils";
import { RichTextRenderer } from "../common/RichTextRenderer";
import type { RoteiroSection } from "./parseRoteiro";

/**
 * Passos do checklist na direção "Placar" (`design/hero.pen`):
 * `Checklist · Mobile · 1 Viatura identificada`, `Checklist · 2 Conferência · B+A · Cartão da viatura`
 * e `Checklist · 3 Enviado · Destaque 2 · Viatura`. Componentes só de apresentação.
 */

export type ChecklistRole = "motorista" | "comandante";

const ROLE_LABEL: Record<ChecklistRole, string> = { comandante: "Comandante", motorista: "Motorista" };

export interface ChecklistVehicle {
  prefix: string;
  plate: string;
  model: string;
  subtitle: string | null;
  type: string | null;
  currentKm: number | null;
  nextMaintenanceKm: number | null;
  situation: string;
}

export interface RoleSubmission {
  createdAt: number;
  userName: string;
}

const COLUMN = "mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-md flex-col lg:min-h-[calc(100dvh-4rem)]";
const BODY = "flex flex-col px-4";

function VehicleCard({ vehicle }: { vehicle: ChecklistVehicle }) {
  return (
    <div className="flex flex-col gap-3.5 rounded-[20px] bg-giro-neutral p-4 text-giro-neutral-foreground">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex shrink-0 items-center rounded-lg bg-white px-2 py-1 text-[13px] font-bold tracking-[0.5px] whitespace-nowrap ring-1 ring-giro-separator ring-inset">
          {vehicle.prefix}
        </span>
        <span className="min-w-0 truncate text-right text-xs text-giro-neutral-muted">Placa {vehicle.plate}</span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-[30px] font-bold tracking-[-0.8px]">{vehicle.model}</span>
          {vehicle.subtitle && <span className="w-[172px] text-xs text-giro-neutral-muted">{vehicle.subtitle}</span>}
        </div>
        <VehicleIllustration type={vehicle.type} />
      </div>
      <dl className="flex gap-3 pt-3 shadow-[inset_0_1px_0_#16191C1A]">
        {[
          ["KM atual", formatKm(vehicle.currentKm)],
          ["Próx. manutenção", vehicle.nextMaintenanceKm != null ? formatKm(vehicle.nextMaintenanceKm, true) : "—"],
          ["Situação", vehicle.situation],
        ].map(([label, value]) => (
          <div key={label} className="flex min-w-0 flex-1 flex-col gap-0.5">
            <dt className="text-[11px] leading-[13px] text-giro-neutral-muted">{label}</dt>
            <dd className="truncate text-sm leading-[17px] font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Rodapé fixo com a ação principal (Footer do design). */
function StickyFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 mt-auto flex flex-col items-center gap-3 bg-white px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[inset_0_1px_0_var(--color-giro-separator)]">
      {children}
    </div>
  );
}

/**
 * Cartão de opção com rádio.
 * - `role`: 64px de altura, cantos 16, rótulo 16/600 e legenda 12 (papel)
 * - `result`: preenchimento 16×18, cantos 20, rótulo 17/600 e legenda 13 (resultado)
 */
function RadioCard({
  name,
  checked,
  onChange,
  label,
  sub,
  subClassName,
  size,
  tone = "neutral",
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  sub: string;
  subClassName?: string;
  size: "role" | "result";
  tone?: "neutral" | "warning";
}) {
  const warning = tone === "warning" && checked;
  const role = size === "role";
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center transition-colors duration-150 has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-giro-accent/30",
        role ? "h-16 gap-3 rounded-2xl px-4" : "gap-3.5 rounded-[20px] px-[18px] py-4",
        warning
          ? "bg-giro-warning text-giro-warning-foreground"
          : checked
            ? "bg-white ring-2 ring-giro-fg ring-inset"
            : role
              ? "bg-white ring-1 ring-giro-default ring-inset hover:ring-giro-muted/40"
              : "bg-white hover:ring-1 hover:ring-giro-default hover:ring-inset",
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
              ? "-m-[3.5px] size-[29px] border-[7px] border-giro-fg"
              : "-m-px size-6 border-2 border-giro-default",
        )}
      >
        {warning && <Check className="size-3.5" />}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className={cn("font-semibold", role ? "text-base" : "text-[17px] leading-[21px]")}>{label}</span>
        <span
          className={cn(
            role ? "text-xs" : "text-[13px] leading-[16px]",
            warning ? "text-giro-warning-foreground" : "text-giro-muted",
            subClassName,
          )}
        >
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
      <p className="text-[13px] leading-[1.45]">
        {after
          ? "Relate as alterações no SEI e encaminhe ao Chefe da SGP. A administração acompanha o processo a partir deste envio."
          : "Depois de enviar, relate as alterações no SEI e encaminhe ao Chefe da SGP."}
      </p>
    </div>
  );
}

/** Texto institucional do checklist (não aparece no design; fica recolhido no fim da conferência). */
function Guidelines() {
  return (
    <details className="group rounded-[20px] bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-[20px] px-[18px] py-3.5 outline-none focus-visible:ring-[3px] focus-visible:ring-giro-accent/30 [&::-webkit-details-marker]:hidden">
        <span className="text-[15px] font-semibold">Orientações gerais</span>
        <ChevronDown aria-hidden="true" className="size-[18px] text-giro-muted transition-transform group-open:rotate-180" />
      </summary>
      <div className="giro-prose flex flex-col gap-3 px-[18px] pb-4 text-sm">
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

// ── Passo 1: viatura e papel ─────────────────────────────────────────

export function ChecklistIdentifyStep({
  fromQr,
  picker,
  unlinkedFunctionName,
  vehicle,
  role,
  onRoleChange,
  submissions,
  onStart,
  onChooseManually,
}: {
  fromQr: boolean;
  /** Seletor de viatura (Combobox); `null` quando a viatura veio do QR code. */
  picker: React.ReactNode;
  unlinkedFunctionName: string | null;
  vehicle: ChecklistVehicle | null;
  role: ChecklistRole | "";
  onRoleChange: (role: ChecklistRole) => void;
  submissions: Partial<Record<ChecklistRole, RoleSubmission | null>>;
  onStart: () => void;
  onChooseManually?: () => void;
}) {
  return (
    <div className={COLUMN}>
      <div className={cn(BODY, "gap-4 py-5")}>
        {fromQr ? (
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-giro-success-soft-foreground">
            <ScanQrCode className="size-4 text-giro-success" />
            Viatura identificada pelo QR code
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            <h1 className="text-[26px] font-semibold tracking-[-0.5px]">Checklist de viatura</h1>
            <p className="text-sm text-giro-muted">Escolha a viatura que você vai conferir neste plantão.</p>
          </div>
        )}

        {picker}

        {unlinkedFunctionName && (
          <div role="alert" className="rounded-2xl bg-giro-accent-soft px-4 py-3.5 text-giro-accent-soft-foreground">
            <p className="text-sm font-semibold">Viatura não vinculada</p>
            <p className="text-[13px]">
              A função {unlinkedFunctionName} está sem viatura física vinculada. Fale com a SGP; o checklist fica
              bloqueado até a vinculação.
            </p>
          </div>
        )}

        {vehicle && <VehicleCard vehicle={vehicle} />}

        {vehicle && (
          <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-2.5 text-[13px] font-semibold text-giro-muted">
              Checklist de hoje · você vai conferir como
            </legend>
            {(["comandante", "motorista"] as const).map((r) => {
              const sent = submissions[r];
              return (
                <RadioCard
                  key={r}
                  name="papel"
                  size="role"
                  checked={role === r}
                  onChange={() => onRoleChange(r)}
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
        <GiroButton variant="primary" size="xl" className="w-full" disabled={!vehicle || !role} onClick={onStart}>
          Iniciar conferência
          <ArrowRight className="size-[18px]" />
        </GiroButton>
        {fromQr && onChooseManually && (
          <button
            type="button"
            onClick={onChooseManually}
            className="rounded-full text-[13px] font-medium text-giro-muted outline-none hover:text-giro-fg focus-visible:ring-[3px] focus-visible:ring-giro-accent/30"
          >
            Não é esta viatura? Escolher manualmente
          </button>
        )}
      </StickyFooter>
    </div>
  );
}

// ── Passo 2: conferência ─────────────────────────────────────────────

export function ChecklistConferenceStep({
  vehicle,
  role,
  onBack,
  template,
  roteiro,
  hasAlterations,
  onAlterationsChange,
  onSubmit,
  submitting,
  canSubmit,
}: {
  vehicle: ChecklistVehicle;
  role: ChecklistRole;
  onBack: () => void;
  /** `undefined` carregando; `null` sem template cadastrado. */
  template: { content: string } | null | undefined;
  roteiro: RoteiroSection[] | null;
  hasAlterations: boolean;
  onAlterationsChange: (value: boolean) => void;
  onSubmit: () => void;
  submitting: boolean;
  canSubmit: boolean;
}) {
  const itemTotal = roteiro?.reduce((sum, s) => sum + s.items.length, 0) ?? 0;

  return (
    <div className={COLUMN}>
      <div className={cn(BODY, "gap-7 pt-5 pb-7")}>
        <div className="flex flex-col gap-3.5">
          <GiroButton variant="secondary" size="sm" className="w-fit gap-1.5 pr-3.5 pl-2.5 text-sm" onClick={onBack}>
            <ArrowLeft />
            Voltar
          </GiroButton>
          <div className="flex flex-col gap-1">
            <h1 className="text-[30px] font-semibold tracking-[-0.6px]">Conferência</h1>
            <p className="text-sm text-giro-muted">Conferência do {ROLE_LABEL[role].toLowerCase()}</p>
          </div>
        </div>

        <VehicleCard vehicle={vehicle} />

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
                      <li key={ii} className="flex gap-3.5 py-3.5 shadow-[inset_0_-1px_0_var(--color-giro-separator)] last:shadow-none">
                        <span className="shrink-0 text-[13px] leading-[1.6] font-semibold text-giro-muted tabular-nums">
                          {String(ii + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 text-[15px] leading-[1.45]">{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })
          ) : (
            <div className="giro-prose rounded-[20px] bg-white px-[18px] py-4">
              <RichTextRenderer content={template.content} />
            </div>
          )}
        </section>

        {template && (
          <section aria-labelledby="resultado-titulo" className="flex flex-col gap-3">
            <h2 id="resultado-titulo" className="text-[17px] font-semibold">Resultado</h2>
            <div role="radiogroup" aria-labelledby="resultado-titulo" className="flex flex-col gap-2.5">
              <RadioCard
                name="resultado"
                size="result"
                checked={!hasAlterations}
                onChange={() => onAlterationsChange(false)}
                label="Sem alterações"
                sub="Tudo conforme o roteiro"
              />
              <RadioCard
                name="resultado"
                size="result"
                checked={hasAlterations}
                onChange={() => onAlterationsChange(true)}
                label="Com alterações"
                sub="Algo diferente do roteiro"
                tone="warning"
              />
            </div>
            {hasAlterations && <SeiNotice />}
          </section>
        )}

        <Guidelines />
      </div>

      <StickyFooter>
        <GiroButton variant="primary" size="xl" className="w-full" onClick={onSubmit} disabled={submitting || !canSubmit}>
          <Send className="size-[18px]" />
          {submitting ? "Enviando..." : "Enviar checklist"}
        </GiroButton>
      </StickyFooter>
    </div>
  );
}

// ── Passo 3: enviado ─────────────────────────────────────────────────

export function ChecklistSentStep({
  vehicle,
  role,
  submittedAt,
  militar,
  hasAlterations,
  onDone,
}: {
  vehicle: ChecklistVehicle;
  role: ChecklistRole;
  submittedAt: number | null;
  militar: string;
  hasAlterations: boolean;
  onDone: () => void;
}) {
  return (
    <div className={COLUMN}>
      <div className={cn(BODY, "gap-7 pt-5 pb-7")}>
        <div className="flex flex-col gap-3.5 rounded-3xl bg-giro-neutral p-[18px] text-giro-neutral-foreground motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-200">
          <span className="inline-flex h-7 w-fit items-center gap-1.5 rounded-full bg-white pr-3 pl-2 text-[13px] font-semibold">
            <CircleCheck className="size-4 text-giro-success" />
            Enviado às {submittedAt ? formatTime(submittedAt) : "—"}
          </span>
          <div className="flex items-end justify-between gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h1 className="text-[28px] font-bold tracking-[-0.6px]">Checklist enviado</h1>
              <p className="text-sm text-giro-neutral-muted">
                {vehicle.prefix} · {ROLE_LABEL[role]}
              </p>
            </div>
            <VehicleIllustration type={vehicle.type} placement="hero" />
          </div>
        </div>

        <section aria-labelledby="resumo-envio" className="flex flex-col gap-3">
          <h2 id="resumo-envio" className="text-[17px] font-semibold">Resumo</h2>
          <dl className="rounded-[20px] bg-white px-[18px] py-2">
            {[
              ["Viatura", `${vehicle.prefix} · ${vehicle.model}`],
              ["Papel", ROLE_LABEL[role]],
              ["Militar", militar],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 py-2.5">
                <dt className="text-sm leading-[17px] text-giro-muted">{label}</dt>
                <dd className="truncate text-[15px] leading-[18px] font-semibold">{value}</dd>
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
        <GiroButton variant="primary" size="xl" className="w-full" onClick={onDone}>
          Concluir
        </GiroButton>
      </StickyFooter>
    </div>
  );
}

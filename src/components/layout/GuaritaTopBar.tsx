import { Bell, ChevronDown, FileText } from "lucide-react";
import { Shield } from "@gravity-ui/icons";
import { IconChecklist, IconSair } from "@/components/giro/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { GiroBrand } from "@/components/giro/GiroLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Movement } from "@/components/guarita/types";
import { formatDuration, formatTime, initials, transitState } from "@/lib/giro";
import { cn } from "@/lib/utils";

export interface GuaritaTopBarProps {
  current: "guarita" | "checklist";
  userLabel: string | null;
  /** Foto do perfil do Google; sem foto (ou se não carregar), mostra as iniciais. */
  userImage?: string | null;
  review?: boolean;
  movements?: Movement[];
  now: number;
  onSignOut: () => void;
}

/** Avatar de 32px: foto do Google ou iniciais no estilo do design. */
function Avatar({ label, image, className }: { label: string | null; image?: string | null; className: string }) {
  const [failed, setFailed] = useState(false);
  if (image && !failed) {
    return (
      <img
        src={image}
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="size-8 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span aria-hidden="true" className={cn("inline-flex size-8 shrink-0 items-center justify-center rounded-full text-xs", className)}>
      {initials(label)}
    </span>
  );
}

/**
 * Topbar da direção "Placar" (`design/hero.pen`).
 * Desktop (lg+): `Guarita · Ícones Gravity UI` → Top Bar.
 * Celular: `Checklist · Mobile` → Top Bar; navegação e "Sair" ficam no menu do avatar.
 */
export function GuaritaTopBar({ current, userLabel, userImage, movements, now, review = false, onSignOut }: GuaritaTopBarProps) {
  const alerts = movements?.filter(m => transitState(now - m.departureTime) !== "normal")
    .sort((a, b) => a.departureTime - b.departureTime);
  const isChecklist = current === "checklist";
  const guarita = review ? "/design-review/guarita" : "/guarita";
  const checklist = review ? "/design-review/checklist-1" : "/checklist";
  const report = review ? "/design-review/relatorio" : "/guarita/relatorio";
  const section = isChecklist ? "Checklist" : "Guarita";
  const role = isChecklist ? "Checklist de viatura" : "Plantão da guarita";
  const other = isChecklist
    ? { to: guarita, label: "Guarita", icon: <Shield /> }
    : { to: checklist, label: "Checklist da viatura", icon: <IconChecklist className="size-[18px]" /> };

  return (
    <header className="sticky top-0 z-40 border-b border-giro-separator bg-white lg:bg-giro-bg">
      <div className="mx-auto flex h-[55px] max-w-[1440px] items-center justify-between px-4 lg:h-15.75 lg:px-10">
        <div className="flex min-w-0 items-center gap-2.5 lg:gap-3">
          <Link to={guarita} aria-label="GIRO, ir para a guarita" className="rounded-lg focus-visible:outline-2 focus-visible:outline-giro-accent">
            <span className="lg:hidden"><GiroBrand size="sm" /></span>
            <span className="hidden lg:block"><GiroBrand /></span>
          </Link>
          <span aria-hidden="true" className="hidden h-5 w-px bg-giro-separator lg:block" />
          <span className="truncate text-sm text-giro-muted">{section}{!isChecklist && <span className="hidden lg:inline"> · 1º Batalhão Bombeiro Militar</span>}</span>
        </div>
        <nav aria-label="Principal" className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger aria-label={alerts?.length ? `Alertas, ${alerts.length} ativos` : "Alertas"} className="relative hidden size-9 items-center justify-center rounded-full text-giro-muted hover:bg-giro-default focus-visible:outline-2 focus-visible:outline-giro-accent lg:flex">
              <Bell className="size-[18px]" />
              {!!alerts?.length && <span className="absolute top-2 right-2 size-2 rounded-full bg-giro-accent ring-1 ring-white" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="giro-ui max-h-80 w-72 overflow-y-auto rounded-2xl bg-white p-3 font-giro">
              <DropdownMenuLabel className="flex justify-between">Atenção agora {alerts && <span className="text-giro-muted">{alerts.length} {alerts.length === 1 ? "viatura" : "viaturas"}</span>}</DropdownMenuLabel>
              {alerts?.length ? <ul className="divide-y divide-giro-separator">{alerts.map((movement) => (
                <li key={movement._id} className="px-2 py-2 text-sm">
                  <strong>{movement.vehicle?.operationalPrefix ?? "Viatura"} · fora há {formatDuration(now - movement.departureTime)}</strong>
                  <p>{transitState(now - movement.departureTime) === "critical" ? "Provável esquecimento" : "Acima de 2h"} · saiu {formatTime(movement.departureTime)}</p>
                </li>
              ))}</ul> : <p className="px-2 py-2 text-sm text-giro-muted">{alerts ? "Nenhum alerta ativo." : "Carregando alertas..."}</p>}
              <DropdownMenuItem asChild><Link to={guarita + "#em-transito-titulo"} onClick={() => document.getElementById("em-transito-titulo")?.scrollIntoView()}>Ver em trânsito</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Menu do usuário" className="flex items-center gap-2.5 rounded-full text-left focus-visible:outline-2 focus-visible:outline-giro-accent">
              <Avatar label={userLabel} image={userImage} className="bg-giro-default font-bold text-giro-fg" />
              <span className="hidden max-w-48 flex-col lg:flex">
                <span className="truncate text-[13px] font-semibold">{userLabel}</span>
                <span className="text-xs text-giro-muted">{role}</span>
              </span>
              <ChevronDown className="hidden size-4 text-giro-muted lg:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="giro-ui min-w-52 rounded-xl font-giro">
              {userLabel && <DropdownMenuLabel>{userLabel}</DropdownMenuLabel>}
              <DropdownMenuItem asChild><Link to={other.to}>{other.icon}{other.label}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to={report}><FileText />Relatório do plantão</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={onSignOut}><IconSair className="size-[18px]" />Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}

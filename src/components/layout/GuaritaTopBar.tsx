import { Shield } from "@gravity-ui/icons";
import { IconChecklist, IconSair } from "@/components/giro/icons";
import { Link } from "react-router-dom";
import { GiroButton } from "@/components/giro/giro-button";
import { GiroBrand } from "@/components/giro/GiroLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initials } from "@/lib/giro";

export interface GuaritaTopBarProps {
  current: "guarita" | "checklist";
  userLabel: string | null;
  onSignOut: () => void;
}

/**
 * Topbar da direção "Placar" (`design/hero.pen`).
 * Desktop (lg+): `Guarita · Ícones Gravity UI` → Top Bar.
 * Celular: `Checklist · Mobile` → Top Bar; navegação e "Sair" ficam no menu do avatar.
 */
export function GuaritaTopBar({ current, userLabel, onSignOut }: GuaritaTopBarProps) {
  const isChecklist = current === "checklist";
  const section = isChecklist ? "Checklist" : "Guarita";
  const role = isChecklist ? "Checklist de viatura" : "Plantão da guarita";
  const other = isChecklist
    ? { to: "/guarita", label: "Guarita", icon: <Shield /> }
    : { to: "/checklist", label: "Checklist", icon: <IconChecklist className="size-[18px]" /> };

  return (
    <header className="sticky top-0 z-40 border-b border-giro-separator bg-white lg:bg-giro-bg">
      {/* Celular */}
      <div className="flex h-[55px] items-center justify-between px-4 lg:hidden">
        <div className="flex min-w-0 items-center gap-2.5">
          <Link to="/guarita" aria-label="GIRO, ir para a guarita" className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-giro-accent/35">
            <GiroBrand size="sm" />
          </Link>
          <span className="truncate text-sm text-giro-muted">{section}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Menu do usuário"
            className="inline-flex size-8 items-center justify-center rounded-full bg-giro-default text-xs font-bold text-giro-fg outline-none focus-visible:ring-[3px] focus-visible:ring-giro-accent/35"
          >
            {initials(userLabel)}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="giro-ui min-w-52 rounded-xl font-giro">
            {userLabel && <DropdownMenuLabel className="truncate">{userLabel}</DropdownMenuLabel>}
            <DropdownMenuItem asChild>
              <Link to={other.to}>
                {other.icon}
                {other.label}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onSignOut}>
              <IconSair className="size-[18px]" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden h-[63px] max-w-[1440px] items-center justify-between px-10 lg:flex">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/guarita" aria-label="GIRO, ir para a guarita" className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-giro-accent/35">
            <GiroBrand />
          </Link>
          <span aria-hidden="true" className="h-5 w-px bg-giro-separator" />
          <span className="truncate text-sm text-giro-muted">{section}</span>
        </div>

        <nav aria-label="Principal" className="flex shrink-0 items-center gap-2">
          {/* No design, o atalho para o checklist e o divisor ficam ocultos na guarita */}
          {isChecklist && (
            <>
              <GiroButton asChild variant="ghost" size="sm" className="text-sm">
                <Link to={other.to}>
                  {other.icon}
                  {other.label}
                </Link>
              </GiroButton>
              <span aria-hidden="true" className="h-5 w-px bg-giro-separator" />
            </>
          )}

          {userLabel && (
            <div className="flex items-center gap-2.5 pr-1.5 pl-2">
              <span
                aria-hidden="true"
                className="inline-flex size-8 items-center justify-center rounded-full bg-giro-accent-soft text-xs font-semibold text-giro-accent-soft-foreground"
              >
                {initials(userLabel)}
              </span>
              <span className="flex max-w-48 flex-col">
                <span className="truncate text-[13px] font-semibold">{userLabel}</span>
                <span className="text-xs text-giro-muted">{role}</span>
              </span>
            </div>
          )}

          <GiroButton variant="ghost" size="sm" className="text-sm" onClick={onSignOut}>
            <IconSair className="size-[18px]" />
            Sair
          </GiroButton>
        </nav>
      </div>
    </header>
  );
}

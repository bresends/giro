import { useAuthActions } from "@convex-dev/auth/react";
import { ArrowRightFromSquare, ListCheck, Shield } from "@gravity-ui/icons";
import { useQuery } from "convex/react";
import { useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { GiroButton } from "@/components/giro/giro-button";
import { GiroBrand } from "@/components/giro/GiroLogo";
import { initials } from "@/lib/giro";
import { api } from "../../../convex/_generated/api";

interface GuaritaLayoutProps {
  children: React.ReactNode;
}

export function GuaritaLayout({ children }: GuaritaLayoutProps) {
  const { signOut } = useAuthActions();
  const location = useLocation();
  const viewer = useQuery(api.auth.viewer);

  // A direção "Placar" só tem valores Light por enquanto
  useLayoutEffect(() => {
    const originalTheme = document.documentElement.classList.contains("dark");
    document.documentElement.classList.remove("dark");

    return () => {
      if (originalTheme) {
        document.documentElement.classList.add("dark");
      }
    };
  }, []);

  const isChecklistRoute = location.pathname.startsWith("/checklist");
  const section = isChecklistRoute ? "Checklist" : "Guarita";
  const userLabel = viewer?.name || viewer?.email || null;

  return (
    <div className="min-h-screen bg-giro-bg font-giro text-giro-fg antialiased">
      <header className="sticky top-0 z-40 border-b border-giro-separator bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 lg:bg-giro-bg/95 lg:supports-[backdrop-filter]:bg-giro-bg/80">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:h-16 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/guarita"
              aria-label="GIRO, ir para a guarita"
              className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-giro-accent/35"
            >
              <GiroBrand size="sm" className="lg:hidden" />
              <GiroBrand className="hidden lg:inline-flex" />
            </Link>
            <span aria-hidden="true" className="hidden h-5 w-px bg-giro-separator sm:block" />
            <span className="truncate text-sm text-giro-muted">{section}</span>
          </div>

          <nav aria-label="Principal" className="flex shrink-0 items-center gap-1 sm:gap-2">
            {isChecklistRoute ? (
              <GiroButton asChild variant="ghost" size="sm" className="text-sm">
                <Link to="/guarita">
                  <Shield />
                  <span className="hidden sm:inline">Guarita</span>
                </Link>
              </GiroButton>
            ) : (
              <GiroButton asChild variant="ghost" size="sm" className="text-sm">
                <Link to="/checklist">
                  <ListCheck className="size-[18px]" />
                  <span className="hidden sm:inline">Checklist</span>
                </Link>
              </GiroButton>
            )}

            <span aria-hidden="true" className="hidden h-5 w-px bg-giro-separator sm:block" />

            {userLabel && (
              <div className="flex items-center gap-2.5 pl-1 pr-1.5">
                <span
                  aria-hidden="true"
                  className="inline-flex size-8 items-center justify-center rounded-full bg-giro-accent-soft text-xs font-semibold text-giro-accent-soft-foreground"
                >
                  {initials(userLabel)}
                </span>
                <span className="hidden max-w-48 flex-col lg:flex">
                  <span className="truncate text-[13px] font-semibold">{userLabel}</span>
                  <span className="text-xs text-giro-muted">
                    {isChecklistRoute ? "Checklist de viatura" : "Plantão da guarita"}
                  </span>
                </span>
              </div>
            )}

            <GiroButton
              variant="ghost"
              size="sm"
              className="text-sm"
              onClick={() => void signOut()}
              aria-label="Sair"
            >
              <ArrowRightFromSquare />
              <span className="hidden sm:inline">Sair</span>
            </GiroButton>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}

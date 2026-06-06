import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut, ShieldCheck, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface GuaritaLayoutProps {
  children: React.ReactNode;
}

export function GuaritaLayout({ children }: GuaritaLayoutProps) {
  const { signOut } = useAuthActions();
  const location = useLocation();

  // Force light theme
  useLayoutEffect(() => {
    const originalTheme = document.documentElement.classList.contains("dark");
    document.documentElement.classList.remove("dark");

    return () => {
      if (originalTheme) {
        document.documentElement.classList.add("dark");
      }
    };
  }, []);

  const isChecklistRoute = location.pathname === "/checklist";

  return (
    <div className="light min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold truncate">Sistema Giro</h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  CBMGO - Controle de Viaturas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isChecklistRoute ? (
                <Link to="/guarita">
                  <Button variant="secondary" className="flex items-center gap-1.5 font-semibold px-2.5 sm:px-4">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Ir para Guarita</span>
                    <span className="sm:hidden">Guarita</span>
                  </Button>
                </Link>
              ) : (
                <Link to="/checklist">
                  <Button variant="default" className="flex items-center gap-1.5 font-semibold shadow-xs px-2.5 sm:px-4">
                    <ClipboardList className="w-4 h-4" />
                    <span className="hidden sm:inline">Checklist</span>
                    <span className="sm:hidden">Checklist</span>
                  </Button>
                </Link>
              )}

              <Button variant="outline" onClick={() => void signOut()} className="px-2.5 sm:px-4">
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 sm:p-6">{children}</main>
    </div>
  );
}

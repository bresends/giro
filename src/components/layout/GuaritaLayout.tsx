import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLayoutEffect } from "react";

interface GuaritaLayoutProps {
  children: React.ReactNode;
}

export function GuaritaLayout({ children }: GuaritaLayoutProps) {
  const { signOut } = useAuthActions();

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

  return (
    <div className="light min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Sistema Giro</h1>
                <p className="text-xs text-muted-foreground">
                  CBMGO - Controle de Viaturas
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={() => void signOut()}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}

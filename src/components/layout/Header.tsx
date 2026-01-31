import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Truck, LogOut } from "lucide-react";

export function Header() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Truck className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold">
              Giro
            </h1>
            <p className="text-xs text-muted-foreground">
              Gestão de Frota CBMGO
            </p>
          </div>
        </div>
        {isAuthenticated && (
          <Button variant="ghost" onClick={() => void signOut()}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        )}
      </div>
    </header>
  );
}

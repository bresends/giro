import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { UserAvatar } from "./UserAvatar";

export function Header() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  return (
    <header className="sticky top-0 z-50 bg-card border-b">
      <div className="h-16 px-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="" className="size-8" />
          <div>
            <h1 className="font-giro text-xl font-extrabold tracking-tight">
              GIRO
            </h1>
            <p className="text-xs text-muted-foreground">
              Gestão de Frota CBMGO
            </p>
          </div>
        </div>
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <UserAvatar />
            <Button variant="ghost" onClick={() => void signOut()}>
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

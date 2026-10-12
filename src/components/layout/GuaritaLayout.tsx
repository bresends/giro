import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import { GuaritaTopBar } from "./GuaritaTopBar";

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
  const userLabel = viewer?.name || viewer?.email || null;

  return (
    <div className="giro-ui min-h-screen bg-giro-bg font-giro text-giro-fg antialiased">
      <GuaritaTopBar
        current={isChecklistRoute ? "checklist" : "guarita"}
        userLabel={userLabel}
        onSignOut={() => void signOut()}
      />

      <main>{children}</main>
    </div>
  );
}

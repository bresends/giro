import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut, Zap } from "lucide-react";

export function Header() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(247,247,247,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div className="px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-end gap-3">
            <Zap
              className="text-red-600 mb-0.5"
              size={24}
              strokeWidth={2}
              fill="rgba(220,38,38,0.12)"
            />
            <h1
              className="text-2xl text-[#1a1a1a] leading-none tracking-wider"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              GIRO
            </h1>
            <div
              className="h-0.5 w-8 mb-1"
              style={{ background: "linear-gradient(90deg, #dc2626, transparent)" }}
            />
            <span
              className="text-[10px] text-[#999] tracking-[0.2em] uppercase mb-0.5"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              ADMIN · CBMGO
            </span>
          </div>

          {isAuthenticated && (
            <button
              onClick={() => void signOut()}
              className="flex items-center gap-2 px-4 py-2 text-xs text-[#999] tracking-wider uppercase hover:text-red-600 transition-colors cursor-pointer"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                border: "1px solid rgba(0,0,0,0.06)",
                clipPath:
                  "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              <LogOut size={14} strokeWidth={2} />
              Sair
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

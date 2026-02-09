"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Radio,
  Shield,
  Signal,
  Truck,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const signInSchema = z.object({
  email: z.string().email("Identificação inválida"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const signUpSchema = z
  .object({
    email: z.string().email("Identificação inválida"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

function ScanlineOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
      }}
    />
  );
}

function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,136,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,136,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.5) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
    </div>
  );
}

function StatusIndicator({
  label,
  status,
  blinking,
}: {
  label: string;
  status: "online" | "standby" | "alert";
  blinking?: boolean;
}) {
  const colors = {
    online: "bg-green-400 shadow-green-400/50",
    standby: "bg-amber-400 shadow-amber-400/50",
    alert: "bg-red-500 shadow-red-500/50",
  };
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
      <div
        className={`h-1.5 w-1.5 rounded-full ${colors[status]} shadow-[0_0_6px] ${blinking ? "animate-pulse" : ""}`}
      />
      <span className="text-green-300/60">{label}</span>
    </div>
  );
}

function ClockDisplay() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="font-mono text-green-400/80 tabular-nums">
      <div className="text-[10px] uppercase tracking-[0.3em] text-green-500/40 mb-0.5">
        HORÁRIO LOCAL
      </div>
      <div className="text-lg tracking-[0.15em]">
        {time.toLocaleTimeString("pt-BR", { hour12: false })}
      </div>
    </div>
  );
}

export function LoginCommandCenter() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [authError, setAuthError] = useState<string | null>(null);

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const currentForm = flow === "signIn" ? signInForm : signUpForm;

  async function onSubmit(data: any) {
    setAuthError(null);
    try {
      const formData = new FormData();
      formData.set("email", data.email);
      formData.set("password", data.password);
      formData.set("flow", flow);
      await signIn("password", formData);
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Falha na autenticação",
      );
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap');

        .cmd-input {
          background: rgba(0, 255, 136, 0.03);
          border: 1px solid rgba(0, 255, 136, 0.15);
          color: #a3ffcc;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          padding: 10px 14px;
          width: 100%;
          outline: none;
          transition: all 0.2s;
          letter-spacing: 0.05em;
        }
        .cmd-input::placeholder {
          color: rgba(0, 255, 136, 0.2);
          font-family: 'JetBrains Mono', monospace;
        }
        .cmd-input:focus {
          border-color: rgba(0, 255, 136, 0.4);
          background: rgba(0, 255, 136, 0.06);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.08), inset 0 0 20px rgba(0, 255, 136, 0.02);
        }
        .cmd-input[type="password"] {
          letter-spacing: 0.2em;
        }

        .cmd-btn {
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.3);
          color: #00ff88;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          padding: 12px 24px;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        .cmd-btn:hover {
          background: rgba(0, 255, 136, 0.18);
          border-color: rgba(0, 255, 136, 0.5);
          box-shadow: 0 0 30px rgba(0, 255, 136, 0.15);
        }
        .cmd-btn:active {
          background: rgba(0, 255, 136, 0.25);
        }
        .cmd-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0,255,136,0.1), transparent);
          transition: left 0.5s;
        }
        .cmd-btn:hover::before {
          left: 100%;
        }

        @keyframes borderGlow {
          0%, 100% { border-color: rgba(0, 255, 136, 0.1); }
          50% { border-color: rgba(0, 255, 136, 0.25); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cmd-panel {
          animation: fadeInUp 0.6s ease-out;
        }

        .corner-mark::before,
        .corner-mark::after {
          content: '';
          position: absolute;
          width: 12px;
          height: 12px;
          border-color: rgba(0, 255, 136, 0.25);
        }
        .corner-mark::before {
          top: -1px;
          left: -1px;
          border-top: 1px solid;
          border-left: 1px solid;
        }
        .corner-mark::after {
          bottom: -1px;
          right: -1px;
          border-bottom: 1px solid;
          border-right: 1px solid;
        }
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(0,255,136,0.03) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,180,255,0.02) 0%, transparent 50%), #0a0e0d",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <ScanlineOverlay />
        <GridBackground />

        <div className="w-full max-w-md relative z-10 cmd-panel">
          {/* Header block */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Shield
                    className="text-green-400/70"
                    size={28}
                    strokeWidth={1.5}
                  />
                  <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
                </div>
                <div>
                  <h1
                    className="text-green-400/90 text-xl tracking-[0.15em] font-semibold"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    GIRO
                  </h1>
                  <div className="text-[9px] text-green-500/30 tracking-[0.35em] uppercase">
                    Sistema de Frota
                  </div>
                </div>
              </div>
              <ClockDisplay />
            </div>

            {/* Status bar */}
            <div
              className="flex items-center justify-between px-3 py-2 border border-green-900/30 relative corner-mark"
              style={{ background: "rgba(0,255,136,0.02)" }}
            >
              <StatusIndicator label="Rede" status="online" />
              <StatusIndicator label="Servidor" status="online" />
              <StatusIndicator label="Despacho" status="standby" blinking />
              <div className="flex items-center gap-1.5">
                <Wifi size={10} className="text-green-500/40" />
                <Signal size={10} className="text-green-500/40" />
                <Radio size={10} className="text-green-500/40" />
              </div>
            </div>
          </div>

          {/* Main terminal */}
          <div
            className="border border-green-900/20 relative corner-mark"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,255,136,0.02) 0%, rgba(0,0,0,0.3) 100%)",
              animation: "borderGlow 4s ease-in-out infinite",
            }}
          >
            {/* Terminal header */}
            <div className="border-b border-green-900/20 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500/60" />
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500/60" />
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[10px] text-green-500/30 tracking-[0.2em] uppercase ml-2">
                  {flow === "signIn"
                    ? "AUTH // LOGIN"
                    : "AUTH // NOVO REGISTRO"}
                </span>
              </div>
              <span className="text-[9px] text-green-500/20 tracking-[0.15em]">
                CBMGO 8°BBM
              </span>
            </div>

            {/* Terminal body */}
            <div className="px-5 py-5">
              {/* Prompt text */}
              <div className="text-[10px] text-green-500/40 mb-5 tracking-wider">
                <span className="text-green-400/60">$</span>{" "}
                {flow === "signIn"
                  ? "autenticar --modo seguro"
                  : "registrar --novo-operador"}
              </div>

              <form
                key={flow}
                onSubmit={currentForm.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <Controller
                  name="email"
                  control={currentForm.control}
                  render={({ field, fieldState }) => (
                    <div>
                      <label className="text-[10px] text-green-500/50 tracking-[0.2em] uppercase block mb-1.5">
                        Identificação
                      </label>
                      <input
                        {...field}
                        type="email"
                        placeholder="operador@cbmgo.gov.br"
                        className="cmd-input"
                        autoComplete="email"
                      />
                      {fieldState.invalid && fieldState.error && (
                        <div className="text-[10px] text-red-400/80 mt-1 tracking-wider">
                          ▸ {fieldState.error.message}
                        </div>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="password"
                  control={currentForm.control}
                  render={({ field, fieldState }) => (
                    <div>
                      <label className="text-[10px] text-green-500/50 tracking-[0.2em] uppercase block mb-1.5">
                        Chave de Acesso
                      </label>
                      <input
                        {...field}
                        type="password"
                        className="cmd-input"
                        autoComplete={
                          flow === "signIn" ? "current-password" : "new-password"
                        }
                      />
                      {fieldState.invalid && fieldState.error && (
                        <div className="text-[10px] text-red-400/80 mt-1 tracking-wider">
                          ▸ {fieldState.error.message}
                        </div>
                      )}
                    </div>
                  )}
                />

                {flow === "signUp" && (
                  <Controller
                    name="confirmPassword"
                    control={currentForm.control as any}
                    render={({ field, fieldState }) => (
                      <div>
                        <label className="text-[10px] text-green-500/50 tracking-[0.2em] uppercase block mb-1.5">
                          Confirmar Chave
                        </label>
                        <input
                          {...field}
                          type="password"
                          className="cmd-input"
                          autoComplete="new-password"
                        />
                        {fieldState.invalid && fieldState.error && (
                          <div className="text-[10px] text-red-400/80 mt-1 tracking-wider">
                            ▸ {fieldState.error.message}
                          </div>
                        )}
                      </div>
                    )}
                  />
                )}

                {authError && (
                  <div
                    className="border border-red-500/30 px-3 py-2.5"
                    style={{ background: "rgba(255,50,50,0.05)" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[10px] text-red-400/90 tracking-wider uppercase">
                        Erro de Autenticação
                      </span>
                    </div>
                    <p className="text-[11px] text-red-400/70 mt-1 ml-3.5">
                      {authError}
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <button type="submit" className="cmd-btn">
                    {flow === "signIn" ? "◆ Acessar Sistema" : "◆ Registrar"}
                  </button>
                </div>
              </form>

              {/* Toggle */}
              <div className="mt-5 pt-4 border-t border-green-900/15 text-center">
                <span className="text-[10px] text-green-500/30 tracking-wider">
                  {flow === "signIn"
                    ? "Novo operador?"
                    : "Já possui acesso?"}
                </span>{" "}
                <button
                  type="button"
                  className="text-[10px] text-green-400/60 tracking-wider hover:text-green-400/90 transition-colors underline underline-offset-2 decoration-green-400/20 hover:decoration-green-400/40 cursor-pointer"
                  onClick={() => {
                    setFlow(flow === "signIn" ? "signUp" : "signIn");
                    setAuthError(null);
                    signInForm.reset();
                    signUpForm.reset();
                  }}
                >
                  {flow === "signIn" ? "Solicitar registro" : "Fazer login"}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between text-[8px] text-green-500/20 tracking-[0.2em] uppercase px-1">
            <div className="flex items-center gap-2">
              <Truck size={10} className="text-green-500/20" />
              <span>Gestão de Frota v2.0</span>
            </div>
            <span>Corpo de Bombeiros Militar de Goiás</span>
          </div>
        </div>
      </div>
    </>
  );
}

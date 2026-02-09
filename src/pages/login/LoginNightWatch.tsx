"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Siren } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const signInSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const signUpSchema = z
  .object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

function FireTruckSVG() {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      className="w-full h-auto max-w-[500px]"
      style={{ filter: "drop-shadow(0 0 40px rgba(220,38,38,0.15))" }}
    >
      {/* Chassis */}
      <rect x="80" y="220" width="440" height="80" rx="8" fill="#1a1a2e" stroke="#dc2626" strokeWidth="1" opacity="0.8" />
      <rect x="80" y="220" width="440" height="80" rx="8" fill="url(#truckGrad)" />

      {/* Cab */}
      <path d="M80 220 L80 160 Q80 140 100 140 L200 140 Q220 140 230 160 L250 220" fill="#1a1a2e" stroke="#dc2626" strokeWidth="1" opacity="0.9" />
      <rect x="100" y="155" width="90" height="45" rx="4" fill="#0d0d1a" stroke="#dc2626" strokeWidth="0.5" opacity="0.6" />

      {/* Body panels */}
      <rect x="260" y="160" width="250" height="60" rx="4" fill="#1a1a2e" stroke="#dc2626" strokeWidth="0.5" opacity="0.7" />
      <line x1="330" y1="160" x2="330" y2="220" stroke="#dc2626" strokeWidth="0.3" opacity="0.4" />
      <line x1="400" y1="160" x2="400" y2="220" stroke="#dc2626" strokeWidth="0.3" opacity="0.4" />
      <line x1="470" y1="160" x2="470" y2="220" stroke="#dc2626" strokeWidth="0.3" opacity="0.4" />

      {/* Wheels */}
      <circle cx="160" cy="300" r="35" fill="#0d0d1a" stroke="#333" strokeWidth="2" />
      <circle cx="160" cy="300" r="22" fill="#0d0d1a" stroke="#dc2626" strokeWidth="1" opacity="0.5" />
      <circle cx="160" cy="300" r="6" fill="#dc2626" opacity="0.3" />

      <circle cx="430" cy="300" r="35" fill="#0d0d1a" stroke="#333" strokeWidth="2" />
      <circle cx="430" cy="300" r="22" fill="#0d0d1a" stroke="#dc2626" strokeWidth="1" opacity="0.5" />
      <circle cx="430" cy="300" r="6" fill="#dc2626" opacity="0.3" />

      {/* Light bar */}
      <rect x="110" y="128" width="100" height="14" rx="7" fill="#0d0d1a" stroke="#dc2626" strokeWidth="0.5" />
      <circle cx="135" cy="135" r="4" fill="#dc2626" opacity="0.8">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="185" cy="135" r="4" fill="#3b82f6" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
      </circle>

      {/* Ladder on top */}
      <rect x="270" y="145" width="220" height="6" rx="1" fill="none" stroke="#dc2626" strokeWidth="0.5" opacity="0.4" />
      <rect x="270" y="155" width="220" height="6" rx="1" fill="none" stroke="#dc2626" strokeWidth="0.5" opacity="0.3" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={285 + i * 28} y1="145" x2={285 + i * 28} y2="161" stroke="#dc2626" strokeWidth="0.4" opacity="0.3" />
      ))}

      {/* Hose connection */}
      <circle cx="520" cy="250" r="15" fill="#0d0d1a" stroke="#dc2626" strokeWidth="0.5" opacity="0.5" />
      <circle cx="520" cy="250" r="8" fill="none" stroke="#dc2626" strokeWidth="0.3" opacity="0.4" />

      <defs>
        <linearGradient id="truckGrad" x1="80" y1="220" x2="80" y2="300">
          <stop offset="0%" stopColor="rgba(220,38,38,0.08)" />
          <stop offset="100%" stopColor="rgba(220,38,38,0.02)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LoginNightWatch() {
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
        error instanceof Error ? error.message : "Erro ao autenticar",
      );
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@200;300;400;500;600;700&family=Libre+Baskerville:wght@400;700&display=swap');

        .nw-input {
          background: #fafafa;
          border: 1px solid #e8e8e8;
          border-radius: 6px;
          color: #1a1a1a;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 400;
          padding: 13px 16px;
          width: 100%;
          outline: none;
          transition: all 0.25s ease;
        }
        .nw-input::placeholder {
          color: #c0c0c0;
          font-weight: 300;
        }
        .nw-input:focus {
          border-color: #1a1a1a;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.04);
        }

        .nw-btn {
          background: #1a1a1a;
          border: none;
          border-radius: 6px;
          color: white;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 500;
          padding: 14px 28px;
          cursor: pointer;
          transition: all 0.25s ease;
          width: 100%;
        }
        .nw-btn:hover {
          background: #dc2626;
          box-shadow: 0 4px 24px rgba(220,38,38,0.25);
        }

        @keyframes nw-fade {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .nw-animate { animation: nw-fade 0.7s cubic-bezier(0.16, 1, 0.3, 1); }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .nw-float { animation: float-slow 6s ease-in-out infinite; }

        @keyframes ambient-pulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.12; }
        }
      `}</style>

      <div
        className="min-h-screen flex"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        {/* Left side - dark atmospheric */}
        <div
          className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at 30% 70%, #1a0508 0%, #0a0a14 50%, #050510 100%)",
          }}
        >
          {/* Ambient red glow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[60%]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 100%, rgba(220,38,38,0.08) 0%, transparent 70%)",
              animation: "ambient-pulse 4s ease-in-out infinite",
            }}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(220,38,38,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.5) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-16 text-center">
            <div className="nw-float mb-12">
              <FireTruckSVG />
            </div>

            <div className="space-y-4">
              <h2
                className="text-5xl text-white/90 font-normal tracking-tight"
                style={{ fontFamily: "'Libre Baskerville', serif" }}
              >
                Giro
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-8 bg-red-600/30" />
                <p className="text-[11px] text-red-400/40 tracking-[0.25em] uppercase">
                  Controle de Frota
                </p>
                <div className="h-px w-8 bg-red-600/30" />
              </div>
            </div>

            {/* Corner accents */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-red-900/20" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-red-900/20" />
          </div>

          {/* Bottom text */}
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-[9px] text-white/10 tracking-[0.4em] uppercase">
              Corpo de Bombeiros Militar de Goiás
            </p>
          </div>
        </div>

        {/* Right side - clean form */}
        <div
          className="flex-1 flex items-center justify-center p-8"
          style={{ background: "#fff" }}
        >
          <div className="w-full max-w-sm nw-animate">
            {/* Mobile branding */}
            <div className="lg:hidden mb-10 flex items-center gap-3">
              <Siren size={24} className="text-red-600" strokeWidth={1.5} />
              <div>
                <h1
                  className="text-2xl text-[#1a1a1a] font-normal"
                  style={{ fontFamily: "'Libre Baskerville', serif" }}
                >
                  Giro
                </h1>
                <p className="text-[10px] text-[#999] tracking-[0.15em] uppercase">
                  Gestão de Frota
                </p>
              </div>
            </div>

            {/* Welcome */}
            <div className="mb-8">
              <p className="text-[10px] text-[#999] tracking-[0.2em] uppercase mb-2">
                {flow === "signIn" ? "Bem-vindo de volta" : "Junte-se a nós"}
              </p>
              <h2
                className="text-[28px] text-[#1a1a1a] font-normal leading-tight"
                style={{ fontFamily: "'Libre Baskerville', serif" }}
              >
                {flow === "signIn" ? "Fazer login" : "Criar conta"}
              </h2>
            </div>

            <form
              key={flow}
              onSubmit={currentForm.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <Controller
                name="email"
                control={currentForm.control}
                render={({ field, fieldState }) => (
                  <div>
                    <label className="block text-xs text-[#666] mb-1.5 font-medium">
                      Email
                    </label>
                    <input
                      {...field}
                      type="email"
                      placeholder="nome@cbmgo.gov.br"
                      className="nw-input"
                      autoComplete="email"
                    />
                    {fieldState.invalid && fieldState.error && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="password"
                control={currentForm.control}
                render={({ field, fieldState }) => (
                  <div>
                    <label className="block text-xs text-[#666] mb-1.5 font-medium">
                      Senha
                    </label>
                    <input
                      {...field}
                      type="password"
                      className="nw-input"
                      autoComplete={
                        flow === "signIn" ? "current-password" : "new-password"
                      }
                    />
                    {fieldState.invalid && fieldState.error && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldState.error.message}
                      </p>
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
                      <label className="block text-xs text-[#666] mb-1.5 font-medium">
                        Confirmar Senha
                      </label>
                      <input
                        {...field}
                        type="password"
                        className="nw-input"
                        autoComplete="new-password"
                      />
                      {fieldState.invalid && fieldState.error && (
                        <p className="text-xs text-red-500 mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              )}

              {authError && (
                <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                  <p className="text-sm text-red-600">{authError}</p>
                </div>
              )}

              <div className="pt-1">
                <button type="submit" className="nw-btn">
                  {flow === "signIn" ? "Entrar" : "Criar Conta"}
                </button>
              </div>
            </form>

            {/* Separator */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-[#eee]" />
              <span className="text-[10px] text-[#ccc] uppercase tracking-[0.2em]">
                ou
              </span>
              <div className="flex-1 h-px bg-[#eee]" />
            </div>

            {/* Toggle */}
            <button
              type="button"
              className="w-full py-3 border border-[#e8e8e8] rounded-lg text-sm text-[#666] font-medium hover:border-[#999] hover:text-[#333] transition-all cursor-pointer"
              onClick={() => {
                setFlow(flow === "signIn" ? "signUp" : "signIn");
                setAuthError(null);
                signInForm.reset();
                signUpForm.reset();
              }}
            >
              {flow === "signIn" ? "Criar uma conta" : "Já tenho conta"}
            </button>

            {/* Footer */}
            <div className="mt-12 text-center">
              <p className="text-[10px] text-[#ccc] tracking-[0.15em]">
                8° BBM · CBMGO
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

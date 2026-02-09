"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Zap } from "lucide-react";
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

export function LoginVelocity() {
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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;500;600;700&display=swap');

        .vel-input {
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.08);
          color: #fff;
          font-family: 'Barlow', sans-serif;
          font-size: 15px;
          font-weight: 400;
          padding: 13px 16px;
          width: 100%;
          outline: none;
          transition: all 0.2s ease;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
        }
        .vel-input::placeholder {
          color: rgba(255,255,255,0.15);
          font-weight: 300;
        }
        .vel-input:focus {
          border-color: #dc2626;
          background: rgba(220,38,38,0.05);
          box-shadow: 0 0 20px rgba(220,38,38,0.1);
        }

        .vel-btn {
          background: #dc2626;
          border: none;
          color: white;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 15px 32px;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          position: relative;
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
        }
        .vel-btn:hover {
          background: #ef4444;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(220,38,38,0.4);
        }
        .vel-btn:active {
          transform: translateY(0);
        }

        @keyframes speed-line {
          0% { transform: translateX(-100%); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateX(200vw); opacity: 0; }
        }

        @keyframes vel-slide {
          from { opacity: 0; transform: translateX(40px) skewX(-2deg); }
          to { opacity: 1; transform: translateX(0) skewX(0); }
        }
        .vel-animate-1 { animation: vel-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
        .vel-animate-2 { animation: vel-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }
        .vel-animate-3 { animation: vel-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }

        @keyframes dash-move {
          to { stroke-dashoffset: -20; }
        }
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{
          background: "#0a0a0a",
          fontFamily: "'Barlow', sans-serif",
        }}
      >
        {/* Diagonal speed stripes background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Main diagonal */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(-45deg, transparent, transparent 80px, rgba(220,38,38,0.02) 80px, rgba(220,38,38,0.02) 82px)",
            }}
          />

          {/* Speed lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-px"
              style={{
                top: `${15 + i * 18}%`,
                left: 0,
                width: "200px",
                background:
                  "linear-gradient(90deg, transparent, rgba(220,38,38,0.3), transparent)",
                animation: `speed-line ${3 + i * 0.5}s linear infinite`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}

          {/* Corner geometric */}
          <svg
            className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.04]"
            viewBox="0 0 500 500"
          >
            <line
              x1="500" y1="0" x2="0" y2="500"
              stroke="#dc2626" strokeWidth="1"
              strokeDasharray="6 6"
              style={{ animation: "dash-move 1s linear infinite" }}
            />
            <line
              x1="500" y1="100" x2="100" y2="500"
              stroke="#dc2626" strokeWidth="0.5"
              strokeDasharray="4 8"
            />
            <line
              x1="500" y1="200" x2="200" y2="500"
              stroke="#dc2626" strokeWidth="0.5"
            />
          </svg>

          <svg
            className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-[0.03]"
            viewBox="0 0 400 400"
          >
            <polygon
              points="0,400 0,200 200,400"
              fill="none" stroke="#dc2626" strokeWidth="1"
            />
            <polygon
              points="0,400 0,300 100,400"
              fill="rgba(220,38,38,0.3)" stroke="none"
            />
          </svg>
        </div>

        {/* Large angled GIRO text */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(200px, 25vw, 400px)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(220,38,38,0.04)",
            transform: "translate(-50%, -50%) rotate(-8deg)",
            letterSpacing: "0.1em",
            lineHeight: 0.85,
          }}
        >
          GIRO
        </div>

        {/* Main content */}
        <div className="w-full max-w-[400px] relative z-10">
          {/* Brand header */}
          <div className="mb-10 vel-animate-1">
            <div className="flex items-end gap-4 mb-3">
              <div className="relative">
                <Zap
                  className="text-red-500"
                  size={32}
                  strokeWidth={2}
                  fill="rgba(220,38,38,0.2)"
                />
              </div>
              <h1
                className="text-5xl text-white leading-none tracking-wider"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                GIRO
              </h1>
              <div
                className="h-1 flex-1 mb-2"
                style={{
                  background:
                    "linear-gradient(90deg, #dc2626, transparent)",
                  clipPath: "polygon(0 0, 100% 0, calc(100% - 4px) 100%, 0 100%)",
                }}
              />
            </div>
            <div className="flex items-center gap-3">
              <div
                className="text-[10px] text-red-500/70 tracking-[0.35em] uppercase font-semibold"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Gestão de Frota
              </div>
              <div className="h-3 w-px bg-red-900/30" />
              <div
                className="text-[10px] text-white/20 tracking-[0.2em] uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                CBMGO · 8°BBM
              </div>
            </div>
          </div>

          {/* Form panel */}
          <div className="vel-animate-2">
            {/* Panel with cut corners */}
            <div
              className="relative p-7 mb-6"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
                clipPath:
                  "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
              }}
            >
              {/* Top-right corner mark */}
              <div
                className="absolute top-0 right-0 w-4 h-4"
                style={{
                  background:
                    "linear-gradient(225deg, rgba(220,38,38,0.3) 50%, transparent 50%)",
                }}
              />

              {/* Heading */}
              <div className="mb-6">
                <h2
                  className="text-2xl text-white tracking-[0.1em] uppercase"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
                >
                  {flow === "signIn" ? "Acessar" : "Registrar"}
                </h2>
                <div
                  className="h-0.5 w-12 mt-2"
                  style={{ background: "#dc2626" }}
                />
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
                      <label
                        className="block text-[10px] text-white/30 tracking-[0.2em] uppercase mb-2 font-semibold"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        Email
                      </label>
                      <input
                        {...field}
                        type="email"
                        placeholder="operador@cbmgo.gov.br"
                        className="vel-input"
                        autoComplete="email"
                      />
                      {fieldState.invalid && fieldState.error && (
                        <p className="text-xs text-red-400 mt-1">
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
                      <label
                        className="block text-[10px] text-white/30 tracking-[0.2em] uppercase mb-2 font-semibold"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        Senha
                      </label>
                      <input
                        {...field}
                        type="password"
                        className="vel-input"
                        autoComplete={
                          flow === "signIn"
                            ? "current-password"
                            : "new-password"
                        }
                      />
                      {fieldState.invalid && fieldState.error && (
                        <p className="text-xs text-red-400 mt-1">
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
                        <label
                          className="block text-[10px] text-white/30 tracking-[0.2em] uppercase mb-2 font-semibold"
                          style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                          }}
                        >
                          Confirmar Senha
                        </label>
                        <input
                          {...field}
                          type="password"
                          className="vel-input"
                          autoComplete="new-password"
                        />
                        {fieldState.invalid && fieldState.error && (
                          <p className="text-xs text-red-400 mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                )}

                {authError && (
                  <div
                    className="px-4 py-3"
                    style={{
                      background: "rgba(220,38,38,0.08)",
                      borderLeft: "2px solid #dc2626",
                    }}
                  >
                    <p className="text-sm text-red-400">{authError}</p>
                  </div>
                )}

                <div className="pt-1">
                  <button type="submit" className="vel-btn">
                    {flow === "signIn" ? "Acessar Sistema" : "Criar Conta"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Toggle */}
          <div className="vel-animate-3 flex items-center justify-between">
            <span className="text-xs text-white/20">
              {flow === "signIn" ? "Novo aqui?" : "Já tem acesso?"}
            </span>
            <button
              type="button"
              className="text-xs text-red-500/70 tracking-wider uppercase hover:text-red-400 transition-colors cursor-pointer relative group"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
              }}
              onClick={() => {
                setFlow(flow === "signIn" ? "signUp" : "signIn");
                setAuthError(null);
                signInForm.reset();
                signUpForm.reset();
              }}
            >
              {flow === "signIn" ? "Criar conta" : "Fazer login"}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-red-500 group-hover:w-full transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

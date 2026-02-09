"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flame, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const signInSchema = z.object({
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

const signUpSchema = z
  .object({
    email: z.string().email("Digite um email válido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

function EmberParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            left: `${Math.random() * 100}%`,
            bottom: `-5%`,
            background: `radial-gradient(circle, ${
              ["#ff6b35", "#ffa726", "#ffcc02", "#ff4444"][
                Math.floor(Math.random() * 4)
              ]
            }, transparent)`,
            animation: `ember-rise ${8 + Math.random() * 12}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`,
            opacity: Math.random() * 0.6 + 0.2,
          }}
        />
      ))}
    </div>
  );
}

export function LoginEmberGlow() {
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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        @keyframes ember-rise {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.1;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? "" : "-"}${Math.random() * 80}px) scale(0);
            opacity: 0;
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 40px rgba(255, 107, 53, 0.15), 0 0 80px rgba(255, 107, 53, 0.05);
          }
          50% {
            box-shadow: 0 0 60px rgba(255, 107, 53, 0.25), 0 0 120px rgba(255, 107, 53, 0.1);
          }
        }

        @keyframes ember-border {
          0%, 100% { border-color: rgba(255,107,53,0.2); }
          33% { border-color: rgba(255,167,38,0.3); }
          66% { border-color: rgba(255,204,2,0.2); }
        }

        .ember-input {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          padding: 14px 16px;
          width: 100%;
          outline: none;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }
        .ember-input::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }
        .ember-input:focus {
          border-color: rgba(255, 167, 38, 0.5);
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 24px rgba(255, 107, 53, 0.12);
        }

        .ember-btn {
          background: linear-gradient(135deg, #c62828, #e65100, #ff8f00);
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
          border: none;
          border-radius: 8px;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.05em;
          padding: 14px 28px;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          position: relative;
        }
        .ember-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(255, 107, 53, 0.35);
        }
        .ember-btn:active {
          transform: translateY(0);
        }

        .ember-card {
          animation: glow-pulse 4s ease-in-out infinite;
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ember-animate {
          animation: slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 30% 80%, #4a0000 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, #4a1a00 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, #1a0a00 0%, #0d0000 100%)",
        }}
      >
        <EmberParticles />

        {/* Ambient glow */}
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-[40vh] opacity-30"
          style={{
            background:
              "linear-gradient(to top, rgba(255,107,53,0.2), rgba(255,60,0,0.05), transparent)",
          }}
        />

        <div className="w-full max-w-[420px] relative z-10 ember-animate">
          {/* Brand */}
          <div className="text-center mb-10">
            <div className="relative inline-flex items-center justify-center mb-4">
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-40"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,107,53,0.6), transparent)",
                  transform: "scale(2.5)",
                }}
              />
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full border border-orange-500/20" style={{ background: "rgba(255,107,53,0.08)" }}>
                <Flame className="text-orange-400" size={36} strokeWidth={1.5} />
              </div>
            </div>
            <h1
              className="text-4xl text-white font-bold tracking-tight mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Giro
            </h1>
            <p
              className="text-orange-200/40 text-sm tracking-[0.1em] uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Gestão de Frota · CBMGO
            </p>
          </div>

          {/* Form card */}
          <div
            className="ember-card rounded-2xl p-8 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              animation: "ember-border 6s ease-in-out infinite, glow-pulse 4s ease-in-out infinite",
            }}
          >
            {/* Inner glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,167,38,0.4), transparent)",
              }}
            />

            {/* Flow tabs */}
            <div className="flex mb-8 relative">
              <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />
              <button
                type="button"
                className="flex-1 pb-3 text-sm tracking-wide transition-all relative cursor-pointer"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: flow === "signIn" ? 600 : 400,
                  color:
                    flow === "signIn"
                      ? "rgba(255,167,38,0.9)"
                      : "rgba(255,255,255,0.3)",
                }}
                onClick={() => {
                  setFlow("signIn");
                  setAuthError(null);
                  signUpForm.reset();
                }}
              >
                Entrar
                {flow === "signIn" && (
                  <div
                    className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, #ff6b35, transparent)",
                    }}
                  />
                )}
              </button>
              <button
                type="button"
                className="flex-1 pb-3 text-sm tracking-wide transition-all relative cursor-pointer"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: flow === "signUp" ? 600 : 400,
                  color:
                    flow === "signUp"
                      ? "rgba(255,167,38,0.9)"
                      : "rgba(255,255,255,0.3)",
                }}
                onClick={() => {
                  setFlow("signUp");
                  setAuthError(null);
                  signInForm.reset();
                }}
              >
                Criar Conta
                {flow === "signUp" && (
                  <div
                    className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, #ff6b35, transparent)",
                    }}
                  />
                )}
              </button>
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
                      className="block text-xs text-white/40 mb-2 tracking-wide uppercase"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Email
                    </label>
                    <input
                      {...field}
                      type="email"
                      placeholder="seu@email.com"
                      className="ember-input"
                      autoComplete="email"
                    />
                    {fieldState.invalid && fieldState.error && (
                      <p className="text-xs text-orange-400/80 mt-1.5">
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
                      className="block text-xs text-white/40 mb-2 tracking-wide uppercase"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Senha
                    </label>
                    <input
                      {...field}
                      type="password"
                      className="ember-input"
                      autoComplete={
                        flow === "signIn" ? "current-password" : "new-password"
                      }
                    />
                    {fieldState.invalid && fieldState.error && (
                      <p className="text-xs text-orange-400/80 mt-1.5">
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
                        className="block text-xs text-white/40 mb-2 tracking-wide uppercase"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Confirmar Senha
                      </label>
                      <input
                        {...field}
                        type="password"
                        className="ember-input"
                        autoComplete="new-password"
                      />
                      {fieldState.invalid && fieldState.error && (
                        <p className="text-xs text-orange-400/80 mt-1.5">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              )}

              {authError && (
                <div
                  className="rounded-lg px-4 py-3"
                  style={{
                    background: "rgba(255,50,50,0.1)",
                    border: "1px solid rgba(255,50,50,0.2)",
                  }}
                >
                  <p className="text-sm text-red-400">{authError}</p>
                </div>
              )}

              <button type="submit" className="ember-btn">
                {flow === "signIn" ? "Entrar" : "Criar Conta"}
              </button>
            </form>
          </div>

          {/* Footer badge */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <ShieldCheck
              size={14}
              className="text-orange-400/30"
            />
            <span
              className="text-[11px] text-orange-200/20 tracking-[0.08em]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              8° Batalhão de Bombeiros Militar
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

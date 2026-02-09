"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
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

export function LoginCleanAuthority() {
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
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Geist+Mono:wght@400;500&family=Geist:wght@300;400;500;600&display=swap');

        .swiss-input {
          background: transparent;
          border: none;
          border-bottom: 1.5px solid #d4d4d4;
          color: #1a1a1a;
          font-family: 'Geist', sans-serif;
          font-size: 16px;
          font-weight: 400;
          padding: 12px 0;
          width: 100%;
          outline: none;
          transition: border-color 0.3s ease;
          border-radius: 0;
        }
        .swiss-input::placeholder {
          color: #c5c5c5;
          font-weight: 300;
        }
        .swiss-input:focus {
          border-bottom-color: #c62828;
        }

        .swiss-btn {
          background: #1a1a1a;
          border: none;
          color: white;
          font-family: 'Geist', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.03em;
          padding: 16px 32px;
          cursor: pointer;
          transition: all 0.25s ease;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .swiss-btn:hover {
          background: #c62828;
        }

        @keyframes reveal-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes reveal-line {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes reveal-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .swiss-reveal-1 { animation: reveal-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
        .swiss-reveal-2 { animation: reveal-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }
        .swiss-reveal-3 { animation: reveal-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both; }
        .swiss-reveal-4 { animation: reveal-fade 1s ease 0.5s both; }
      `}</style>

      <div
        className="min-h-screen flex relative overflow-hidden"
        style={{
          background: "#faf9f7",
          fontFamily: "'Geist', sans-serif",
        }}
      >
        {/* Left side - branding */}
        <div className="hidden lg:flex w-[45%] relative items-end p-16">
          {/* Geometric accent */}
          <div
            className="absolute top-0 right-0 w-px h-full"
            style={{ background: "linear-gradient(to bottom, transparent, #e5e5e5 20%, #e5e5e5 80%, transparent)" }}
          />

          {/* Large typographic element */}
          <div
            className="absolute top-16 left-16 right-16 swiss-reveal-1"
          >
            <div
              className="text-[11px] tracking-[0.4em] uppercase mb-6"
              style={{ color: "#c62828", fontFamily: "'Geist Mono', monospace" }}
            >
              Sistema de Gestão
            </div>
            <h1
              className="text-[120px] leading-[0.85] font-normal text-[#1a1a1a] tracking-tight"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Gi
              <br />
              ro
            </h1>
          </div>

          {/* Red accent line */}
          <div
            className="absolute top-[320px] left-16 w-12 h-1"
            style={{
              background: "#c62828",
              animation: "reveal-line 0.6s ease 0.4s both",
              transformOrigin: "left",
            }}
          />

          {/* Bottom info */}
          <div className="swiss-reveal-4">
            <div
              className="text-[10px] tracking-[0.3em] uppercase text-[#999] mb-3"
              style={{ fontFamily: "'Geist Mono', monospace" }}
            >
              Corpo de Bombeiros Militar
            </div>
            <div
              className="text-[10px] tracking-[0.3em] uppercase text-[#bbb]"
              style={{ fontFamily: "'Geist Mono', monospace" }}
            >
              8° Batalhão · Estado de Goiás
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-12 right-12 w-4 h-4 border-t border-r border-[#ddd]" />
          <div className="absolute bottom-12 left-12 w-4 h-4 border-b border-l border-[#ddd]" />
        </div>

        {/* Right side - form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-sm">
            {/* Mobile brand */}
            <div className="lg:hidden mb-12 swiss-reveal-1">
              <div
                className="text-[10px] tracking-[0.4em] uppercase mb-4"
                style={{ color: "#c62828", fontFamily: "'Geist Mono', monospace" }}
              >
                Sistema de Gestão
              </div>
              <h1
                className="text-6xl font-normal text-[#1a1a1a] tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Giro
              </h1>
            </div>

            {/* Form title */}
            <div className="mb-10 swiss-reveal-2">
              <h2
                className="text-2xl font-normal text-[#1a1a1a] mb-2"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {flow === "signIn" ? "Acesso" : "Novo registro"}
              </h2>
              <p className="text-[13px] text-[#999] font-light">
                {flow === "signIn"
                  ? "Entre com suas credenciais"
                  : "Crie sua conta de acesso"}
              </p>
            </div>

            {/* Form */}
            <form
              key={flow}
              onSubmit={currentForm.handleSubmit(onSubmit)}
              className="space-y-6 swiss-reveal-3"
            >
              <Controller
                name="email"
                control={currentForm.control}
                render={({ field, fieldState }) => (
                  <div>
                    <label
                      className="block text-[10px] tracking-[0.25em] uppercase text-[#999] mb-1"
                      style={{ fontFamily: "'Geist Mono', monospace" }}
                    >
                      Email
                    </label>
                    <input
                      {...field}
                      type="email"
                      placeholder="nome@cbmgo.gov.br"
                      className="swiss-input"
                      autoComplete="email"
                    />
                    {fieldState.invalid && fieldState.error && (
                      <p className="text-xs text-[#c62828] mt-1.5 font-light">
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
                      className="block text-[10px] tracking-[0.25em] uppercase text-[#999] mb-1"
                      style={{ fontFamily: "'Geist Mono', monospace" }}
                    >
                      Senha
                    </label>
                    <input
                      {...field}
                      type="password"
                      className="swiss-input"
                      autoComplete={
                        flow === "signIn" ? "current-password" : "new-password"
                      }
                    />
                    {fieldState.invalid && fieldState.error && (
                      <p className="text-xs text-[#c62828] mt-1.5 font-light">
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
                        className="block text-[10px] tracking-[0.25em] uppercase text-[#999] mb-1"
                        style={{ fontFamily: "'Geist Mono', monospace" }}
                      >
                        Confirmar Senha
                      </label>
                      <input
                        {...field}
                        type="password"
                        className="swiss-input"
                        autoComplete="new-password"
                      />
                      {fieldState.invalid && fieldState.error && (
                        <p className="text-xs text-[#c62828] mt-1.5 font-light">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              )}

              {authError && (
                <div className="border-l-2 border-[#c62828] pl-3 py-1">
                  <p className="text-sm text-[#c62828] font-light">{authError}</p>
                </div>
              )}

              <div className="pt-2">
                <button type="submit" className="swiss-btn">
                  <span>
                    {flow === "signIn" ? "Entrar" : "Criar Conta"}
                  </span>
                  <ArrowRight size={16} strokeWidth={1.5} />
                </button>
              </div>
            </form>

            {/* Toggle */}
            <div className="mt-10 swiss-reveal-4">
              <div className="h-px bg-[#e5e5e5] mb-6" />
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[#999] font-light">
                  {flow === "signIn"
                    ? "Ainda não tem acesso?"
                    : "Já possui uma conta?"}
                </span>
                <button
                  type="button"
                  className="text-[12px] text-[#1a1a1a] font-medium hover:text-[#c62828] transition-colors underline underline-offset-4 decoration-[#ddd] hover:decoration-[#c62828] cursor-pointer"
                  onClick={() => {
                    setFlow(flow === "signIn" ? "signUp" : "signIn");
                    setAuthError(null);
                    signInForm.reset();
                    signUpForm.reset();
                  }}
                >
                  {flow === "signIn" ? "Criar conta" : "Fazer login"}
                </button>
              </div>
            </div>

            {/* Micro detail */}
            <div className="mt-16 swiss-reveal-4">
              <div
                className="text-[9px] tracking-[0.3em] uppercase text-[#ccc]"
                style={{ fontFamily: "'Geist Mono', monospace" }}
              >
                Gestão de Frota · CBMGO
              </div>
            </div>
          </div>
        </div>

        {/* Grid line accents */}
        <div className="absolute top-0 left-[45%] w-px h-24 bg-gradient-to-b from-[#c62828]/20 to-transparent hidden lg:block" />
      </div>
    </>
  );
}

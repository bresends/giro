"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Layout } from "./components/layout/Layout";
import { GuaritaLayout } from "./components/layout/GuaritaLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { VehiclesPage } from "./pages/VehiclesPage";
import { VehicleDetailPage } from "./pages/VehicleDetailPage";
import { VehicleFormPage } from "./pages/VehicleFormPage";
import { MaintenancesPage } from "./pages/MaintenancesPage";
import { MaintenanceDetailPage } from "./pages/MaintenanceDetailPage";
import { MaintenanceFormPage } from "./pages/MaintenanceFormPage";
import { IssuesPage } from "./pages/IssuesPage";
import { IssueDetailPage } from "./pages/IssueDetailPage";
import { IssueFormPage } from "./pages/IssueFormPage";
import { GuaritaPage } from "./pages/GuaritaPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Truck } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Authenticated>
        <Routes>
          <Route path="/" element={<Navigate to="/guarita" replace />} />

          {/* Rotas do Guarita - Sistema separado sem sidebar */}
          <Route path="/guarita" element={
            <GuaritaLayout>
              <GuaritaPage />
            </GuaritaLayout>
          } />

          {/* Rotas do Admin - Com sidebar e layout padrão */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="/admin" element={<DashboardPage />} />

                {/* Rotas de Viaturas */}
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/vehicles/new" element={<VehicleFormPage />} />
                <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
                <Route path="/vehicles/:id/edit" element={<VehicleFormPage />} />

                {/* Rotas de Manutenções */}
                <Route path="/maintenance" element={<MaintenancesPage />} />
                <Route path="/maintenance/new" element={<MaintenanceFormPage />} />
                <Route path="/maintenance/:id" element={<MaintenanceDetailPage />} />
                <Route path="/maintenance/:id/edit" element={<MaintenanceFormPage />} />

                {/* Rotas de Problemas */}
                <Route path="/issues" element={<IssuesPage />} />
                <Route path="/issues/new" element={<IssueFormPage />} />
                <Route path="/issues/:id" element={<IssueDetailPage />} />
                <Route path="/issues/:id/edit" element={<IssueFormPage />} />

                <Route path="/settings" element={<div className="text-2xl font-bold">Configurações - Em construção</div>} />

                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Authenticated>
      <Unauthenticated>
        <Routes>
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Unauthenticated>
    </BrowserRouter>
  );
}

// Schemas de validação
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

// Página de Login - usando React Hook Form e Zod
function LoginPage() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [authError, setAuthError] = useState<string | null>(null);

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: any) {
    setAuthError(null);
    try {
      const formData = new FormData();
      formData.set("email", data.email);
      formData.set("password", data.password);
      formData.set("flow", flow);
      await signIn("password", formData);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Erro ao autenticar");
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Truck className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Giro</h1>
          <p className="text-muted-foreground">Gestão de Frota CBMGO</p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-8 border">
          {flow === "signIn" ? (
            <form key="signin-form" onSubmit={signInForm.handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="email"
                control={signInForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      aria-invalid={fieldState.invalid}
                      className="bg-white dark:bg-input border-2 border-border hover:border-ring/50 transition-colors"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={signInForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      className="bg-white dark:bg-input border-2 border-border hover:border-ring/50 transition-colors"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Button className="w-full mt-2" type="submit">
                Entrar
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Não tem uma conta?</span>{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => {
                    setFlow("signUp");
                    setAuthError(null);
                    signInForm.reset();
                  }}
                >
                  Criar conta
                </Button>
              </div>

              {authError && (
                <div className="bg-destructive/10 border border-destructive rounded-md p-3">
                  <p className="text-sm text-destructive">{authError}</p>
                </div>
              )}
            </form>
          ) : (
            <form key="signup-form" onSubmit={signUpForm.handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="email"
                control={signUpForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email-signup">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email-signup"
                      type="email"
                      placeholder="seu@email.com"
                      aria-invalid={fieldState.invalid}
                      className="bg-white dark:bg-input border-2 border-border hover:border-ring/50 transition-colors"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={signUpForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password-signup">Senha</FieldLabel>
                    <Input
                      {...field}
                      id="password-signup"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      className="bg-white dark:bg-input border-2 border-border hover:border-ring/50 transition-colors"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="confirmPassword"
                control={signUpForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirmar Senha
                    </FieldLabel>
                    <Input
                      {...field}
                      id="confirmPassword"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      className="bg-white dark:bg-input border-2 border-border hover:border-ring/50 transition-colors"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Button className="w-full mt-2" type="submit">
                Criar Conta
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Já tem uma conta?</span>{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => {
                    setFlow("signIn");
                    setAuthError(null);
                    signUpForm.reset();
                  }}
                >
                  Fazer login
                </Button>
              </div>

              {authError && (
                <div className="bg-destructive/10 border border-destructive rounded-md p-3">
                  <p className="text-sm text-destructive">{authError}</p>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


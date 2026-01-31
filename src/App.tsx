"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";

export default function App() {
  return (
    <BrowserRouter>
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

// Página de Login - usando componentes do Convex Auth
function LoginPage() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Truck className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Giro
          </h1>
          <p className="text-muted-foreground">
            Gestão de Frota CBMGO
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-8 border">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              formData.set("flow", flow);
              void signIn("password", formData).catch((error) => {
                setError(error.message);
              });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>

            <Button className="w-full mt-2" type="submit">
              {flow === "signIn" ? "Entrar" : "Criar Conta"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {flow === "signIn" ? "Não tem uma conta?" : "Já tem uma conta?"}
              </span>{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto"
                onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              >
                {flow === "signIn" ? "Criar conta" : "Fazer login"}
              </Button>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive rounded-md p-3">
                <p className="text-sm text-destructive">
                  {error}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}


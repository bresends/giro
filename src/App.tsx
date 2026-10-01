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
import { MovementsPage } from "./pages/MovementsPage";
import { ChecklistPage } from "./pages/ChecklistPage";
import { AdminChecklistsPage } from "./pages/AdminChecklistsPage";
import { Button } from "@/components/ui/button";
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

          {/* Rota do Checklist - Sistema separado para militares */}
          <Route path="/checklist" element={
            <GuaritaLayout>
              <ChecklistPage />
            </GuaritaLayout>
          } />

          {/* Rotas do Admin - Com sidebar e layout padrão */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="/admin" element={<DashboardPage />} />

                {/* Rotas de Checklists */}
                <Route path="/admin/checklists" element={<AdminChecklistsPage />} />

                {/* Rotas de Viaturas */}
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/vehicles/new" element={<VehicleFormPage />} />
                <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
                <Route path="/vehicles/:id/edit" element={<VehicleFormPage />} />

                {/* Rotas de Movimentações */}
                <Route path="/movements" element={<MovementsPage />} />

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

// Página de Login - autenticação via Google
function LoginPage() {
  const { signIn } = useAuthActions();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  async function onGoogleSignIn() {
    setAuthError(null);
    setIsRedirecting(true);
    try {
      await signIn("google");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Erro ao autenticar");
      setIsRedirecting(false);
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

        <div className="bg-card rounded-lg shadow-lg p-8 border space-y-4">
          <Button
            className="w-full"
            variant="outline"
            type="button"
            disabled={isRedirecting}
            onClick={() => void onGoogleSignIn()}
          >
            <GoogleIcon />
            {isRedirecting ? "Redirecionando..." : "Entrar com Google"}
          </Button>

          {authError && (
            <div className="bg-destructive/10 border border-destructive rounded-md p-3">
              <p className="text-sm text-destructive">{authError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
      />
    </svg>
  );
}

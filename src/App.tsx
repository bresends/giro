"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import { ShiftReportPage } from "./pages/ShiftReportPage";
import { DesignReviewPage } from "./pages/design-review/DesignReviewPage";
import { AdminChecklistsPage } from "./pages/AdminChecklistsPage";
import { DesignSystemPage } from "./pages/DesignSystemPage";
import { DesignSystemButtonPage } from "./pages/DesignSystemButtonPage";
import { LoginPage } from "./pages/LoginPage";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <ReviewGate>
      <Authenticated>
        <Routes>
          {import.meta.env.DEV && (
            <>
              <Route path="/design-system" element={<DesignSystemPage />} />
              <Route
                path="/design-system/button"
                element={<DesignSystemButtonPage />}
              />
            </>
          )}
          <Route path="/" element={<Navigate to="/guarita" replace />} />

          {/* Rotas do Guarita - Sistema separado sem sidebar */}
          <Route
            path="/guarita"
            element={
              <GuaritaLayout>
                <GuaritaPage />
              </GuaritaLayout>
            }
          />

          <Route
            path="/guarita/relatorio"
            element={
              <GuaritaLayout>
                <ShiftReportPage />
              </GuaritaLayout>
            }
          />

          {/* Rota do Checklist - Sistema separado para militares */}
          <Route
            path="/checklist"
            element={
              <GuaritaLayout>
                <ChecklistPage />
              </GuaritaLayout>
            }
          />

          {/* Rotas do Admin - Com sidebar e layout padrão */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/admin" replace />} />
                  <Route path="/admin" element={<DashboardPage />} />

                  {/* Rotas de Checklists */}
                  <Route
                    path="/admin/checklists"
                    element={<AdminChecklistsPage />}
                  />

                  {/* Rotas de Viaturas */}
                  <Route path="/vehicles" element={<VehiclesPage />} />
                  <Route path="/vehicles/new" element={<VehicleFormPage />} />
                  <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
                  <Route
                    path="/vehicles/:id/edit"
                    element={<VehicleFormPage />}
                  />

                  {/* Rotas de Movimentações */}
                  <Route path="/movements" element={<MovementsPage />} />

                  {/* Rotas de Manutenções */}
                  <Route path="/maintenance" element={<MaintenancesPage />} />
                  <Route
                    path="/maintenance/new"
                    element={<MaintenanceFormPage />}
                  />
                  <Route
                    path="/maintenance/:id"
                    element={<MaintenanceDetailPage />}
                  />
                  <Route
                    path="/maintenance/:id/edit"
                    element={<MaintenanceFormPage />}
                  />

                  {/* Rotas de Problemas */}
                  <Route path="/issues" element={<IssuesPage />} />
                  <Route path="/issues/new" element={<IssueFormPage />} />
                  <Route path="/issues/:id" element={<IssueDetailPage />} />
                  <Route path="/issues/:id/edit" element={<IssueFormPage />} />

                  <Route
                    path="/settings"
                    element={
                      <section className="space-y-4">
                        <h1 className="text-giro-heading font-bold tracking-tight">Configurações</h1>
                        <p className="rounded-2xl border bg-card p-6 text-muted-foreground">Em construção</p>
                      </section>
                    }
                  />

                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Authenticated>
      <Unauthenticated>
        <Routes>
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Unauthenticated>
      </ReviewGate>
    </BrowserRouter>
  );
}

/**
 * Em desenvolvimento, `/design-review/*` mostra só as telas de revisão visual contra
 * `design/hero.pen`, sem login; nas demais rotas segue o app normal.
 */
function ReviewGate({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (import.meta.env.DEV && location.pathname.startsWith("/design-review")) {
    return (
      <Routes>
        <Route path="/design-review/:screen?" element={<DesignReviewPage />} />
      </Routes>
    );
  }
  return <>{children}</>;
}

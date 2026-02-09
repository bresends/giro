"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { GuaritaLayout } from "./components/layout/GuaritaLayout";
import { Layout } from "./components/layout/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { GuaritaPage } from "./pages/GuaritaPage";
import { IssueDetailPage } from "./pages/IssueDetailPage";
import { IssueFormPage } from "./pages/IssueFormPage";
import { IssuesPage } from "./pages/IssuesPage";
import { MaintenanceDetailPage } from "./pages/MaintenanceDetailPage";
import { MaintenanceFormPage } from "./pages/MaintenanceFormPage";
import { MaintenancesPage } from "./pages/MaintenancesPage";
import { VehicleDetailPage } from "./pages/VehicleDetailPage";
import { VehicleFormPage } from "./pages/VehicleFormPage";
import { VehiclesPage } from "./pages/VehiclesPage";
import { LoginCommandCenter } from "./pages/login/LoginCommandCenter";
import { LoginEmberGlow } from "./pages/login/LoginEmberGlow";
import { LoginCleanAuthority } from "./pages/login/LoginCleanAuthority";
import { LoginNightWatch } from "./pages/login/LoginNightWatch";
import { LoginVelocity } from "./pages/login/LoginVelocity";
import { LoginVelocityLight } from "./pages/login/LoginVelocityLight";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Authenticated>
        <Routes>
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

          {/* Rotas do Admin - Com sidebar e layout padrão */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/admin" replace />} />
                  <Route path="/admin" element={<DashboardPage />} />

                  {/* Rotas de Viaturas */}
                  <Route path="/vehicles" element={<VehiclesPage />} />
                  <Route path="/vehicles/new" element={<VehicleFormPage />} />
                  <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
                  <Route
                    path="/vehicles/:id/edit"
                    element={<VehicleFormPage />}
                  />

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
                      <div>
                        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#1a1a1a", letterSpacing: "0.04em" }}>
                          CONFIGURAÇÕES
                        </h1>
                        <div className="h-0.5 w-6 mt-1" style={{ background: "#dc2626" }} />
                        <p className="mt-2 text-xs text-[#999]" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          Em construção
                        </p>
                      </div>
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
          <Route path="/1" element={<LoginCommandCenter />} />
          <Route path="/2" element={<LoginEmberGlow />} />
          <Route path="/3" element={<LoginCleanAuthority />} />
          <Route path="/4" element={<LoginNightWatch />} />
          <Route path="/5" element={<LoginVelocity />} />
          <Route path="/5light" element={<LoginVelocityLight />} />
          <Route path="*" element={<LoginVelocityLight />} />
        </Routes>
      </Unauthenticated>
    </BrowserRouter>
  );
}


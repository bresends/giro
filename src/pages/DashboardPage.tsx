import "./admin.css";
import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { StatCard } from "../components/dashboard/StatCard";
import { VehicleList } from "../components/vehicles/VehicleList";
import { AlertsSection } from "../components/alerts/AlertsSection";
import { Loading } from "../components/common/Loading";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, CheckCircle, Wrench, Briefcase, AlertTriangle, ShieldCheck, ExternalLink } from "lucide-react";

export function DashboardPage() {
  const navigate = useNavigate();
  const stats = useQuery(api.vehicles.getStats);
  const allVehicles = useQuery(api.vehicles.list, {});
  const alerts = useQuery(api.alerts.getMaintenanceAlerts);
  const alertsSummary = useQuery(api.alerts.getAlertsSummary);

  if (stats === undefined || allVehicles === undefined || alerts === undefined || alertsSummary === undefined) {
    return <Loading text="Carregando dashboard..." />;
  }

  return (
    <div className="admin-page space-y-6">
      <div>
        <h1 className="text-giro-heading leading-tight font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral da frota
        </p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total de Viaturas"
          value={stats.total}
          icon={Truck}
          iconColor="text-muted-foreground"
        />
        <StatCard
          title="Ativas"
          value={stats.active}
          subtitle={`${stats.activePercentage}% da frota`}
          icon={CheckCircle}
          iconColor="text-green-500"
        />
        <StatCard
          title="Em Manutenção"
          value={stats.inMaintenance}
          subtitle={`${stats.inMaintenancePercentage}% da frota`}
          icon={Wrench}
          iconColor="text-orange-500"
        />
        <StatCard
          title="Operacionais"
          value={stats.operational}
          subtitle={`${stats.backup} em backup`}
          icon={Briefcase}
          iconColor="text-muted-foreground"
        />
        <StatCard
          title="Alertas"
          value={alertsSummary.total}
          subtitle={alertsSummary.critical > 0 ? `${alertsSummary.critical} críticos` : "Tudo em ordem"}
          icon={AlertTriangle}
          iconColor={alertsSummary.critical > 0 ? "text-red-500" : alertsSummary.high > 0 ? "text-orange-500" : "text-green-500"}
        />
      </div>

      {/* Acesso ao Sistema Guarita */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  Sistema Guarita
                  <ExternalLink className="w-4 h-4" />
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Controle de saídas e chegadas de viaturas
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => navigate("/guarita")}
            >
              <ShieldCheck className="w-5 h-5 mr-2" />
              Acessar Guarita
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alertas */}
      {alertsSummary.hasAlerts && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Alertas de Manutenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AlertsSection alerts={alerts} />
          </CardContent>
        </Card>
      )}

      {/* Lista de viaturas */}
      <Card>
        <CardHeader>
          <CardTitle>Todas as Viaturas</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleList vehicles={allVehicles as any} />
        </CardContent>
      </Card>
    </div>
  );
}

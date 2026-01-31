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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
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
          iconColor="text-blue-500"
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
          iconColor="text-blue-600"
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
      <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                  Sistema Guarita
                  <ExternalLink className="w-4 h-4" />
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Controle de saídas e chegadas de viaturas
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => navigate("/guarita")}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
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

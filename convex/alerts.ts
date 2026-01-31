import { query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

// Helper function to calculate alerts
async function calculateMaintenanceAlerts(ctx: QueryCtx) {
  const vehicles = await ctx.db.query("vehicles").collect();
  const alerts: Array<{
    vehicleId: any;
    vehiclePrefix: string;
    vehiclePlate: string;
    type:
      | "maintenance_overdue"
      | "maintenance_soon"
      | "in_maintenance_too_long";
    severity: "critical" | "high" | "medium" | "low";
    message: string;
    details: string;
    currentKm?: number;
    nextMaintenanceKm?: number;
    daysInMaintenance?: number;
  }> = [];

  for (const vehicle of vehicles) {
    // Check if vehicle has active maintenance
    const activeMaintenance = await ctx.db
      .query("maintenanceRecords")
      .withIndex("by_vehicle", (q: any) => q.eq("vehicleId", vehicle._id))
      .filter((q: any) =>
        q.or(
          q.eq(q.field("status"), "awaiting_ceman"),
          q.eq(q.field("status"), "in_progress"),
        ),
      )
      .first();

    // Alert: Vehicle in maintenance for too long
    if (activeMaintenance && activeMaintenance.sentDate) {
      const daysSinceSent = Math.floor(
        (Date.now() - activeMaintenance.sentDate) / (1000 * 60 * 60 * 24),
      );

      if (daysSinceSent > 30) {
        alerts.push({
          vehicleId: vehicle._id,
          vehiclePrefix: vehicle.operationalPrefix,
          vehiclePlate: vehicle.plate,
          type: "in_maintenance_too_long",
          severity: "high",
          message: "Viatura em manutenção há muito tempo",
          details: `Em manutenção há ${daysSinceSent} dias`,
          daysInMaintenance: daysSinceSent,
        });
      }
    }

    // Alert: Preventive maintenance based on manual nextMaintenanceKm
    if (vehicle.nextMaintenanceKm) {
      // Get current KM from latest reading
      const latestReading = await ctx.db
        .query("vehicleReadings")
        .withIndex("by_vehicle", (q: any) => q.eq("vehicleId", vehicle._id))
        .order("desc")
        .first();

      if (latestReading) {
        const currentKm = latestReading.kmReading;
        const nextMaintenanceKm = vehicle.nextMaintenanceKm;
        const kmUntilMaintenance = nextMaintenanceKm - currentKm;

        // Critical: Overdue
        if (kmUntilMaintenance < -1000) {
          alerts.push({
            vehicleId: vehicle._id,
            vehiclePrefix: vehicle.operationalPrefix,
            vehiclePlate: vehicle.plate,
            type: "maintenance_overdue",
            severity: "critical",
            message: "Manutenção preventiva muito atrasada",
            details: `${Math.abs(kmUntilMaintenance)} km acima da próxima revisão`,
            currentKm,
            nextMaintenanceKm,
          });
        }
        // High: Recently overdue
        else if (kmUntilMaintenance < 0) {
          alerts.push({
            vehicleId: vehicle._id,
            vehiclePrefix: vehicle.operationalPrefix,
            vehiclePlate: vehicle.plate,
            type: "maintenance_overdue",
            severity: "high",
            message: "Manutenção preventiva vencida",
            details: `${Math.abs(kmUntilMaintenance)} km acima da próxima revisão`,
            currentKm,
            nextMaintenanceKm,
          });
        }
        // Medium: Close to due (within 1000 km)
        else if (kmUntilMaintenance <= 1000) {
          alerts.push({
            vehicleId: vehicle._id,
            vehiclePrefix: vehicle.operationalPrefix,
            vehiclePlate: vehicle.plate,
            type: "maintenance_soon",
            severity: "medium",
            message: "Manutenção preventiva próxima",
            details: `Faltam ${kmUntilMaintenance} km para a próxima revisão`,
            currentKm,
            nextMaintenanceKm,
          });
        }
      }
    }
  }

  // Sort by severity
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return alerts;
}

export const getMaintenanceAlerts = query({
  args: {},
  handler: async (ctx) => {
    return await calculateMaintenanceAlerts(ctx);
  },
});

export const getAlertsSummary = query({
  args: {},
  handler: async (ctx) => {
    const alerts = await calculateMaintenanceAlerts(ctx);

    const critical = alerts.filter(
      (a: any) => a.severity === "critical",
    ).length;
    const high = alerts.filter((a: any) => a.severity === "high").length;
    const medium = alerts.filter((a: any) => a.severity === "medium").length;

    return {
      total: alerts.length,
      critical,
      high,
      medium,
      hasAlerts: alerts.length > 0,
    };
  },
});

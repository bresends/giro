import { v } from "convex/values";
import { query, mutation, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Helper function to check if vehicle has active maintenance
// Only vehicles "in_progress" are considered unavailable
// Vehicles "awaiting_ceman" are still available for use
async function hasActiveMaintenance(ctx: QueryCtx, vehicleId: Id<"vehicles">) {
  const activeMaintenance = await ctx.db
    .query("maintenanceRecords")
    .withIndex("by_vehicle", (q: any) => q.eq("vehicleId", vehicleId))
    .filter((q: any) => q.eq(q.field("status"), "in_progress"))
    .first();

  return activeMaintenance !== null;
}

// Helper function to get active maintenance for vehicle
async function getActiveMaintenance(ctx: QueryCtx, vehicleId: Id<"vehicles">) {
  return await ctx.db
    .query("maintenanceRecords")
    .withIndex("by_vehicle", (q: any) => q.eq("vehicleId", vehicleId))
    .filter((q: any) => q.eq(q.field("status"), "in_progress"))
    .first();
}

// Query: Listar todas as viaturas com filtros opcionais
export const list = query({
  args: {
    serviceType: v.optional(v.union(
      v.literal("operational"),
      v.literal("backup")
    )),
    inMaintenance: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let vehicles = await ctx.db.query("vehicles").collect();

    // Busca os tipos e status de manutenção de cada viatura
    const vehiclesWithDetails = await Promise.all(
      vehicles.map(async (vehicle) => {
        const type = await ctx.db.get(vehicle.typeId);
        const inMaintenance = await hasActiveMaintenance(ctx, vehicle._id);
        const activeMaintenance = inMaintenance ? await getActiveMaintenance(ctx, vehicle._id) : null;

        // Get current KM from latest reading
        const latestReading = await ctx.db
          .query("vehicleReadings")
          .withIndex("by_vehicle", (q: any) => q.eq("vehicleId", vehicle._id))
          .order("desc")
          .first();

        const currentKm = latestReading?.kmReading || 0;

        return {
          ...vehicle,
          type,
          inMaintenance,
          maintenanceLocation: activeMaintenance?.location,
          currentKm,
        };
      })
    );

    // Aplica filtro de serviceType se fornecido
    const filtered = args.serviceType !== undefined
      ? vehiclesWithDetails.filter(v => v.serviceType === args.serviceType)
      : vehiclesWithDetails;

    // Aplica filtro de manutenção se fornecido
    if (args.inMaintenance !== undefined) {
      return filtered.filter(v => v.inMaintenance === args.inMaintenance);
    }

    return filtered;
  },
});

// Query: Buscar viatura por ID
export const get = query({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    const vehicle = await ctx.db.get(args.id);
    if (!vehicle) return null;

    const type = await ctx.db.get(vehicle.typeId);
    const inMaintenance = await hasActiveMaintenance(ctx, args.id);
    const activeMaintenance = inMaintenance ? await getActiveMaintenance(ctx, args.id) : null;

    // Get current KM from latest reading
    const latestReading = await ctx.db
      .query("vehicleReadings")
      .withIndex("by_vehicle", (q: any) => q.eq("vehicleId", args.id))
      .order("desc")
      .first();

    const currentKm = latestReading?.kmReading || 0;

    // Calculate KM until maintenance if nextMaintenanceKm is set
    let kmUntilMaintenance = null;
    if (vehicle.nextMaintenanceKm) {
      kmUntilMaintenance = vehicle.nextMaintenanceKm - currentKm;
    }

    return {
      ...vehicle,
      type,
      inMaintenance,
      maintenanceLocation: activeMaintenance?.location,
      currentKm,
      kmUntilMaintenance,
    };
  },
});

// Query: Buscar viatura por placa
export const getByPlate = query({
  args: { plate: v.string() },
  handler: async (ctx, args) => {
    const vehicle = await ctx.db
      .query("vehicles")
      .withIndex("by_plate", (q) => q.eq("plate", args.plate))
      .first();

    if (!vehicle) return null;

    const type = await ctx.db.get(vehicle.typeId);
    const inMaintenance = await hasActiveMaintenance(ctx, vehicle._id);
    const activeMaintenance = inMaintenance ? await getActiveMaintenance(ctx, vehicle._id) : null;

    return {
      ...vehicle,
      type,
      inMaintenance,
      maintenanceLocation: activeMaintenance?.location,
    };
  },
});

// Query: Buscar viatura por prefixo operacional
export const getByPrefix = query({
  args: { prefix: v.string() },
  handler: async (ctx, args) => {
    const vehicle = await ctx.db
      .query("vehicles")
      .withIndex("by_prefix", (q) => q.eq("operationalPrefix", args.prefix))
      .first();

    if (!vehicle) return null;

    const type = await ctx.db.get(vehicle.typeId);
    const inMaintenance = await hasActiveMaintenance(ctx, vehicle._id);
    const activeMaintenance = inMaintenance ? await getActiveMaintenance(ctx, vehicle._id) : null;

    return {
      ...vehicle,
      type,
      inMaintenance,
      maintenanceLocation: activeMaintenance?.location,
    };
  },
});

// Query: Estatísticas da frota
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const vehicles = await ctx.db.query("vehicles").collect();
    const total = vehicles.length;

    // Count vehicles with active maintenance
    let inMaintenance = 0;
    for (const vehicle of vehicles) {
      if (await hasActiveMaintenance(ctx, vehicle._id)) {
        inMaintenance++;
      }
    }

    const active = total - inMaintenance;
    const operational = vehicles.filter((v) => v.serviceType === "operational").length;
    const backup = vehicles.filter((v) => v.serviceType === "backup").length;

    return {
      total,
      active,
      inMaintenance,
      operational,
      backup,
      activePercentage: total > 0 ? Math.round((active / total) * 100) : 0,
      inMaintenancePercentage: total > 0 ? Math.round((inMaintenance / total) * 100) : 0,
    };
  },
});

// Mutation: Criar nova viatura
export const create = mutation({
  args: {
    plate: v.string(),
    brand: v.string(),
    model: v.string(),
    year: v.number(),
    chassisNumber: v.string(),
    renavam: v.string(),
    operationalPrefix: v.string(),
    typeId: v.id("vehicleTypes"),
    nextMaintenanceKm: v.optional(v.number()),
    color: v.optional(v.string()),
    ownershipType: v.union(
      v.literal("propria"),
      v.literal("locada")
    ),
    serviceType: v.union(
      v.literal("operational"),
      v.literal("backup")
    ),
  },
  handler: async (ctx, args) => {
    // Verifica se já existe viatura com esta placa
    const existingPlate = await ctx.db
      .query("vehicles")
      .withIndex("by_plate", (q) => q.eq("plate", args.plate))
      .first();

    if (existingPlate) {
      throw new Error(`Já existe uma viatura com a placa "${args.plate}"`);
    }

    // Verifica se já existe viatura com este chassi
    const existingChassis = await ctx.db
      .query("vehicles")
      .withIndex("by_chassis", (q) => q.eq("chassisNumber", args.chassisNumber))
      .first();

    if (existingChassis) {
      throw new Error(`Já existe uma viatura com o chassi "${args.chassisNumber}"`);
    }

    // Verifica se já existe viatura com este renavam
    const existingRenavam = await ctx.db
      .query("vehicles")
      .withIndex("by_renavam", (q) => q.eq("renavam", args.renavam))
      .first();

    if (existingRenavam) {
      throw new Error(`Já existe uma viatura com o renavam "${args.renavam}"`);
    }

    // Verifica se já existe viatura com este prefixo
    const existingPrefix = await ctx.db
      .query("vehicles")
      .withIndex("by_prefix", (q) => q.eq("operationalPrefix", args.operationalPrefix))
      .first();

    if (existingPrefix) {
      throw new Error(`Já existe uma viatura com o prefixo "${args.operationalPrefix}"`);
    }

    // Verifica se o tipo existe
    const type = await ctx.db.get(args.typeId);
    if (!type) {
      throw new Error("Tipo de viatura não encontrado");
    }

    const now = Date.now();
    return await ctx.db.insert("vehicles", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation: Atualizar viatura
export const update = mutation({
  args: {
    id: v.id("vehicles"),
    plate: v.string(),
    brand: v.string(),
    model: v.string(),
    year: v.number(),
    chassisNumber: v.string(),
    renavam: v.string(),
    operationalPrefix: v.string(),
    typeId: v.id("vehicleTypes"),
    nextMaintenanceKm: v.optional(v.number()),
    color: v.optional(v.string()),
    ownershipType: v.union(
      v.literal("propria"),
      v.literal("locada")
    ),
    serviceType: v.union(
      v.literal("operational"),
      v.literal("backup")
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;

    // Verifica se existe outra viatura com a mesma placa
    const existingPlate = await ctx.db
      .query("vehicles")
      .withIndex("by_plate", (q) => q.eq("plate", data.plate))
      .first();

    if (existingPlate && existingPlate._id !== id) {
      throw new Error(`Já existe uma viatura com a placa "${data.plate}"`);
    }

    // Verifica se existe outra viatura com o mesmo chassi
    const existingChassis = await ctx.db
      .query("vehicles")
      .withIndex("by_chassis", (q) => q.eq("chassisNumber", data.chassisNumber))
      .first();

    if (existingChassis && existingChassis._id !== id) {
      throw new Error(`Já existe uma viatura com o chassi "${data.chassisNumber}"`);
    }

    // Verifica se existe outra viatura com o mesmo renavam
    const existingRenavam = await ctx.db
      .query("vehicles")
      .withIndex("by_renavam", (q) => q.eq("renavam", data.renavam))
      .first();

    if (existingRenavam && existingRenavam._id !== id) {
      throw new Error(`Já existe uma viatura com o renavam "${data.renavam}"`);
    }

    // Verifica se existe outra viatura com o mesmo prefixo
    const existingPrefix = await ctx.db
      .query("vehicles")
      .withIndex("by_prefix", (q) => q.eq("operationalPrefix", data.operationalPrefix))
      .first();

    if (existingPrefix && existingPrefix._id !== id) {
      throw new Error(`Já existe uma viatura com o prefixo "${data.operationalPrefix}"`);
    }

    // Verifica se o tipo existe
    const type = await ctx.db.get(data.typeId);
    if (!type) {
      throw new Error("Tipo de viatura não encontrado");
    }

    await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Mutation: Deletar viatura
export const remove = mutation({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    // Verifica se existem manutenções associadas
    const maintenanceRecords = await ctx.db
      .query("maintenanceRecords")
      .withIndex("by_vehicle", (q) => q.eq("vehicleId", args.id))
      .first();

    if (maintenanceRecords) {
      throw new Error(
        "Não é possível deletar esta viatura pois existem registros de manutenção associados"
      );
    }

    // Verifica se existem problemas associados
    const issues = await ctx.db
      .query("vehicleIssues")
      .withIndex("by_vehicle", (q) => q.eq("vehicleId", args.id))
      .first();

    if (issues) {
      throw new Error(
        "Não é possível deletar esta viatura pois existem problemas associados"
      );
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

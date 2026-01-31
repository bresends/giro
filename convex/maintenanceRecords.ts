import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    vehicleId: v.optional(v.id("vehicles")),
    status: v.optional(
      v.union(
        v.literal("awaiting_ceman"),
        v.literal("in_progress"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
    type: v.optional(v.union(v.literal("preventive"), v.literal("corrective"))),
  },
  handler: async (ctx, args) => {
    let records;

    // Filter by vehicle and status if both provided
    if (args.vehicleId !== undefined && args.status !== undefined) {
      const vehicleValue = args.vehicleId;
      const statusValue = args.status;
      records = await ctx.db
        .query("maintenanceRecords")
        .withIndex("by_vehicle_and_status", (q) =>
          q.eq("vehicleId", vehicleValue).eq("status", statusValue)
        )
        .collect();
    }
    // Filter by vehicle only
    else if (args.vehicleId !== undefined) {
      const vehicleValue = args.vehicleId;
      records = await ctx.db
        .query("maintenanceRecords")
        .withIndex("by_vehicle", (q) => q.eq("vehicleId", vehicleValue))
        .collect();
    }
    // Filter by status only
    else if (args.status !== undefined) {
      const statusValue = args.status;
      records = await ctx.db
        .query("maintenanceRecords")
        .withIndex("by_status", (q) => q.eq("status", statusValue))
        .collect();
    }
    // No filters
    else {
      records = await ctx.db.query("maintenanceRecords").collect();
    }

    // Filter by type if provided (post-query filter)
    if (args.type !== undefined) {
      records = records.filter((r) => r.type === args.type);
    }

    // Get vehicle info for each record
    const recordsWithVehicles = await Promise.all(
      records.map(async (record) => {
        const vehicle = await ctx.db.get(record.vehicleId);
        if (!vehicle) return null;

        const vehicleType = await ctx.db.get(vehicle.typeId);

        return {
          ...record,
          vehicle: {
            _id: vehicle._id,
            operationalPrefix: vehicle.operationalPrefix,
            plate: vehicle.plate,
            brand: vehicle.brand,
            model: vehicle.model,
            type: vehicleType
              ? { name: vehicleType.name, description: vehicleType.description }
              : undefined,
          },
        };
      })
    );

    // Filter out null values (vehicles that don't exist)
    return recordsWithVehicles.filter((r) => r !== null);
  },
});

export const get = query({
  args: { id: v.id("maintenanceRecords") },
  handler: async (ctx, args) => {
    const record = await ctx.db.get(args.id);
    if (!record) return null;

    const vehicle = await ctx.db.get(record.vehicleId);
    if (!vehicle) return null;

    const vehicleType = await ctx.db.get(vehicle.typeId);

    return {
      ...record,
      vehicle: {
        _id: vehicle._id,
        operationalPrefix: vehicle.operationalPrefix,
        plate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
        type: vehicleType
          ? { name: vehicleType.name, description: vehicleType.description }
          : undefined,
      },
    };
  },
});

export const create = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    type: v.union(v.literal("preventive"), v.literal("corrective")),
    status: v.union(
      v.literal("awaiting_ceman"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    seiProcessNumber: v.optional(v.string()),
    sentDate: v.optional(v.number()),
    returnDate: v.optional(v.number()),
    location: v.optional(v.string()),
    kmAtMaintenance: v.number(),
    description: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const recordId = await ctx.db.insert("maintenanceRecords", {
      vehicleId: args.vehicleId,
      type: args.type,
      status: args.status,
      seiProcessNumber: args.seiProcessNumber,
      sentDate: args.sentDate,
      returnDate: args.returnDate,
      location: args.location,
      kmAtMaintenance: args.kmAtMaintenance,
      description: args.description,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    return recordId;
  },
});

export const update = mutation({
  args: {
    id: v.id("maintenanceRecords"),
    type: v.optional(v.union(v.literal("preventive"), v.literal("corrective"))),
    status: v.optional(
      v.union(
        v.literal("awaiting_ceman"),
        v.literal("in_progress"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
    seiProcessNumber: v.optional(v.string()),
    sentDate: v.optional(v.number()),
    returnDate: v.optional(v.number()),
    location: v.optional(v.string()),
    kmAtMaintenance: v.optional(v.number()),
    description: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;

    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Registro de manutenção não encontrado");
    }

    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("maintenanceRecords"),
    status: v.union(
      v.literal("awaiting_ceman"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Registro de manutenção não encontrado");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("maintenanceRecords") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Registro de manutenção não encontrado");
    }

    await ctx.db.delete(args.id);
  },
});

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Query: Get latest reading for a vehicle
export const getLatest = query({
  args: { vehicleId: v.id("vehicles") },
  handler: async (ctx, args) => {
    const reading = await ctx.db
      .query("vehicleReadings")
      .withIndex("by_vehicle", (q) => q.eq("vehicleId", args.vehicleId))
      .order("desc")
      .first();

    return reading;
  },
});

// Query: List all readings for a vehicle
export const listByVehicle = query({
  args: {
    vehicleId: v.id("vehicles"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("vehicleReadings")
      .withIndex("by_vehicle", (q) => q.eq("vehicleId", args.vehicleId))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
});

// Query: List recent readings (for guarita page)
export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const readings = await ctx.db
      .query("vehicleReadings")
      .withIndex("by_date")
      .order("desc")
      .take(limit);

    // Get vehicle info for each reading
    const readingsWithVehicle = await Promise.all(
      readings.map(async (reading) => {
        const vehicle = await ctx.db.get(reading.vehicleId);
        return {
          ...reading,
          vehicle: vehicle
            ? {
                _id: vehicle._id,
                operationalPrefix: vehicle.operationalPrefix,
                plate: vehicle.plate,
              }
            : null,
        };
      })
    );

    return readingsWithVehicle;
  },
});

// Mutation: Create new reading
export const create = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    kmReading: v.number(),
    readingDate: v.optional(v.number()),
    recordedBy: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle) {
      throw new Error("Viatura não encontrada");
    }

    // Validate KM is not negative
    if (args.kmReading < 0) {
      throw new Error("Quilometragem não pode ser negativa");
    }

    // Get last reading to validate
    const lastReading = await ctx.db
      .query("vehicleReadings")
      .withIndex("by_vehicle", (q) => q.eq("vehicleId", args.vehicleId))
      .order("desc")
      .first();

    if (lastReading && args.kmReading < lastReading.kmReading) {
      throw new Error(
        `Quilometragem não pode ser menor que a última leitura (${lastReading.kmReading} km)`
      );
    }

    const now = Date.now();
    return await ctx.db.insert("vehicleReadings", {
      vehicleId: args.vehicleId,
      kmReading: args.kmReading,
      readingDate: args.readingDate || now,
      recordedBy: args.recordedBy,
      notes: args.notes,
      createdAt: now,
    });
  },
});

// Mutation: Delete reading
export const remove = mutation({
  args: { id: v.id("vehicleReadings") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Query: Get current KM for vehicle (latest reading)
export const getCurrentKm = query({
  args: { vehicleId: v.id("vehicles") },
  handler: async (ctx, args) => {
    const reading = await ctx.db
      .query("vehicleReadings")
      .withIndex("by_vehicle", (q) => q.eq("vehicleId", args.vehicleId))
      .order("desc")
      .first();

    return reading?.kmReading || 0;
  },
});

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Query: List today's movements (for guarita)
export const listToday = query({
  args: {},
  handler: async (ctx) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startTimestamp = startOfDay.getTime();

    const movements = await ctx.db
      .query("vehicleMovements")
      .withIndex("by_date")
      .filter((q) => q.gte(q.field("departureTime"), startTimestamp))
      .collect();

    // Get vehicle and personnel info
    return await Promise.all(
      movements.map(async (movement) => {
        const vehicle = await ctx.db.get(movement.vehicleId);
        const personnel = await ctx.db.get(movement.personnelId);

        return {
          ...movement,
          vehicle: vehicle
            ? {
                _id: vehicle._id,
                operationalPrefix: vehicle.operationalPrefix,
                plate: vehicle.plate,
                color: vehicle.color,
              }
            : null,
          personnel: personnel
            ? {
                _id: personnel._id,
                rank: personnel.rank,
                rg: personnel.rg,
                name: personnel.name,
              }
            : null,
        };
      })
    );
  },
});

// Query: List recent movements (last 50, descending order)
export const listRecent = query({
  args: {},
  handler: async (ctx) => {
    const movements = await ctx.db
      .query("vehicleMovements")
      .withIndex("by_date")
      .order("desc")
      .take(50);

    // Get vehicle and personnel info
    return await Promise.all(
      movements.map(async (movement) => {
        const vehicle = await ctx.db.get(movement.vehicleId);
        const personnel = await ctx.db.get(movement.personnelId);

        return {
          ...movement,
          vehicle: vehicle
            ? {
                _id: vehicle._id,
                operationalPrefix: vehicle.operationalPrefix,
                plate: vehicle.plate,
                color: vehicle.color,
              }
            : null,
          personnel: personnel
            ? {
                _id: personnel._id,
                rank: personnel.rank,
                rg: personnel.rg,
                name: personnel.name,
              }
            : null,
        };
      })
    );
  },
});

// Query: List vehicles in transit (out but not returned)
export const listInTransit = query({
  args: {},
  handler: async (ctx) => {
    const movements = await ctx.db
      .query("vehicleMovements")
      .withIndex("by_status", (q) => q.eq("status", "em_transito"))
      .collect();

    return await Promise.all(
      movements.map(async (movement) => {
        const vehicle = await ctx.db.get(movement.vehicleId);
        const personnel = await ctx.db.get(movement.personnelId);

        return {
          ...movement,
          vehicle: vehicle
            ? {
                _id: vehicle._id,
                operationalPrefix: vehicle.operationalPrefix,
                plate: vehicle.plate,
                color: vehicle.color,
              }
            : null,
          personnel: personnel
            ? {
                _id: personnel._id,
                rank: personnel.rank,
                rg: personnel.rg,
                name: personnel.name,
              }
            : null,
        };
      })
    );
  },
});

// Query: List movements by vehicle
export const listByVehicle = query({
  args: {
    vehicleId: v.id("vehicles"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("vehicleMovements")
      .withIndex("by_vehicle", (q) => q.eq("vehicleId", args.vehicleId))
      .order("desc");

    const movements = args.limit
      ? await query.take(args.limit)
      : await query.collect();

    return await Promise.all(
      movements.map(async (movement) => {
        const personnel = await ctx.db.get(movement.personnelId);

        return {
          ...movement,
          personnel: personnel
            ? {
                _id: personnel._id,
                rank: personnel.rank,
                rg: personnel.rg,
                name: personnel.name,
              }
            : null,
        };
      })
    );
  },
});

// Query: Get latest movement for vehicle
export const getLatest = query({
  args: { vehicleId: v.id("vehicles") },
  handler: async (ctx, args) => {
    const movement = await ctx.db
      .query("vehicleMovements")
      .withIndex("by_vehicle", (q) => q.eq("vehicleId", args.vehicleId))
      .order("desc")
      .first();

    if (!movement) return null;

    const personnel = await ctx.db.get(movement.personnelId);

    return {
      ...movement,
      personnel: personnel
        ? {
            _id: personnel._id,
            rank: personnel.rank,
            rg: personnel.rg,
            name: personnel.name,
          }
        : null,
    };
  },
});

// Query: Get movement by ID
export const get = query({
  args: { id: v.id("vehicleMovements") },
  handler: async (ctx, args) => {
    const movement = await ctx.db.get(args.id);
    if (!movement) return null;

    const vehicle = await ctx.db.get(movement.vehicleId);
    const personnel = await ctx.db.get(movement.personnelId);

    return {
      ...movement,
      vehicle: vehicle
        ? {
            _id: vehicle._id,
            operationalPrefix: vehicle.operationalPrefix,
            plate: vehicle.plate,
            color: vehicle.color,
          }
        : null,
      personnel: personnel
        ? {
            _id: personnel._id,
            rank: personnel.rank,
            rg: personnel.rg,
            name: personnel.name,
          }
        : null,
    };
  },
});

// Mutation: Create new movement (departure)
export const create = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    personnelId: v.id("personnel"),
    destination: v.string(),
    destinationType: v.optional(
      v.union(
        v.literal("ocorrencia"),
        v.literal("qrf"),
        v.literal("ceman"),
        v.literal("cal"),
        v.literal("outro")
      )
    ),
    departureKm: v.number(),
    departureTime: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if vehicle exists
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle) {
      throw new Error("Viatura não encontrada");
    }

    // Check if personnel exists
    const personnel = await ctx.db.get(args.personnelId);
    if (!personnel) {
      throw new Error("Militar não encontrado");
    }

    // Check if vehicle is already in transit
    const existingTransit = await ctx.db
      .query("vehicleMovements")
      .withIndex("by_vehicle_and_status", (q) =>
        q.eq("vehicleId", args.vehicleId).eq("status", "em_transito")
      )
      .first();

    if (existingTransit) {
      throw new Error(
        "Esta viatura já possui uma saída pendente. Registre a chegada antes de uma nova saída."
      );
    }

    // Validate KM
    if (args.departureKm < 0) {
      throw new Error("Quilometragem não pode ser negativa");
    }

    const now = Date.now();
    return await ctx.db.insert("vehicleMovements", {
      vehicleId: args.vehicleId,
      personnelId: args.personnelId,
      destination: args.destination,
      destinationType: args.destinationType,
      departureKm: args.departureKm,
      departureTime: args.departureTime || now,
      status: "em_transito",
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation: Register arrival
export const registerArrival = mutation({
  args: {
    id: v.id("vehicleMovements"),
    arrivalKm: v.number(),
    arrivalTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const movement = await ctx.db.get(args.id);
    if (!movement) {
      throw new Error("Movimento não encontrado");
    }

    if (movement.status === "concluido") {
      throw new Error("Este movimento já foi concluído");
    }

    // Validate arrival KM
    if (args.arrivalKm < movement.departureKm) {
      throw new Error(
        `KM de chegada (${args.arrivalKm}) não pode ser menor que KM de saída (${movement.departureKm})`
      );
    }

    const now = Date.now();
    const arrivalTime = args.arrivalTime || now;

    // Update movement
    await ctx.db.patch(args.id, {
      arrivalKm: args.arrivalKm,
      arrivalTime,
      status: "concluido",
      updatedAt: now,
    });

    // Create vehicle reading automatically
    await ctx.db.insert("vehicleReadings", {
      vehicleId: movement.vehicleId,
      kmReading: args.arrivalKm,
      readingDate: arrivalTime,
      recordedBy: "Sistema - Guarita",
      notes: `Movimento finalizado: ${movement.destination}`,
      createdAt: now,
    });

    return args.id;
  },
});

// Mutation: Delete movement
export const remove = mutation({
  args: { id: v.id("vehicleMovements") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

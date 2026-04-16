import { v } from "convex/values";
import { query, mutation, QueryCtx } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

// Shared helper: enrich movements with vehicle and personnel info, returning only needed fields
async function enrichMovements(ctx: QueryCtx, movements: Doc<"vehicleMovements">[]) {
  return await Promise.all(
    movements.map(async (movement) => {
      const vehicle = await ctx.db.get(movement.vehicleId);
      const personnel = await ctx.db.get(movement.personnelId);

      let vehicleTypeName = "N/A";
      if (vehicle) {
        const vehicleType = await ctx.db.get(vehicle.typeId);
        if (vehicleType) vehicleTypeName = vehicleType.name;
      }

      const registeredByUser = movement.registeredByDeparture
        ? await ctx.db.get(movement.registeredByDeparture)
        : null;

      return {
        _id: movement._id,
        vehicleId: movement.vehicleId,
        personnelId: movement.personnelId,
        destination: movement.destination,
        destinationType: movement.destinationType,
        departureKm: movement.departureKm,
        departureTime: movement.departureTime,
        arrivalKm: movement.arrivalKm,
        arrivalTime: movement.arrivalTime,
        status: movement.status,
        notes: movement.notes,
        registeredByDepartureName: registeredByUser?.name ?? registeredByUser?.email ?? null,
        vehicle: vehicle
          ? {
              _id: vehicle._id,
              operationalPrefix: vehicle.operationalPrefix,
              plate: vehicle.plate,
              type: vehicleTypeName,
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
}

// Query: List today's movements (for guarita)
export const listToday = query({
  args: {},
  handler: async (ctx) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startTimestamp = startOfDay.getTime();

    const movements = await ctx.db
      .query("vehicleMovements")
      .withIndex("by_date", (q) => q.gte("departureTime", startTimestamp))
      .collect();

    return await enrichMovements(ctx, movements);
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

    return await enrichMovements(ctx, movements);
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

    return await enrichMovements(ctx, movements);
  },
});

// Query: List shift movements (7am yesterday to 7am today OR 7am today to now)
export const listShiftMovements = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const currentHour = now.getHours();

    // Calculate 7am today
    const today7am = new Date();
    today7am.setHours(7, 0, 0, 0);

    // Calculate 7am yesterday
    const yesterday7am = new Date(today7am);
    yesterday7am.setDate(yesterday7am.getDate() - 1);

    // Calculate 7am tomorrow
    const tomorrow7am = new Date(today7am);
    tomorrow7am.setDate(tomorrow7am.getDate() + 1);

    let startTimestamp: number;
    let endTimestamp: number;

    // If current time is before 7am, get movements from yesterday 7am to today 7am
    // If current time is after 7am, get movements from today 7am to tomorrow 7am
    if (currentHour < 7) {
      startTimestamp = yesterday7am.getTime();
      endTimestamp = today7am.getTime();
    } else {
      startTimestamp = today7am.getTime();
      endTimestamp = tomorrow7am.getTime();
    }

    // Query with index range bounds (not .filter()) so Convex only scans the relevant range
    const movements = await ctx.db
      .query("vehicleMovements")
      .withIndex("by_date", (q) =>
        q.gte("departureTime", startTimestamp).lt("departureTime", endTimestamp)
      )
      .collect();

    return await enrichMovements(ctx, movements);
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
    // Get logged in user
    const userId = await getAuthUserId(ctx);

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
      registeredByDeparture: userId ?? undefined,
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
    // Get logged in user
    const userId = await getAuthUserId(ctx);

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
      registeredByArrival: userId ?? undefined,
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

// Mutation: Update movement
export const update = mutation({
  args: {
    id: v.id("vehicleMovements"),
    vehicleId: v.optional(v.id("vehicles")),
    personnelId: v.optional(v.id("personnel")),
    destination: v.optional(v.string()),
    destinationType: v.optional(
      v.union(
        v.literal("ocorrencia"),
        v.literal("qrf"),
        v.literal("ceman"),
        v.literal("cal"),
        v.literal("outro")
      )
    ),
    departureKm: v.optional(v.number()),
    departureTime: v.optional(v.number()),
    arrivalKm: v.optional(v.number()),
    arrivalTime: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;

    const movement = await ctx.db.get(id);
    if (!movement) {
      throw new Error("Movimento não encontrado");
    }

    // Allow editing all movements (including completed ones)

    // Validate vehicle if changed
    if (updateData.vehicleId) {
      const vehicle = await ctx.db.get(updateData.vehicleId);
      if (!vehicle) {
        throw new Error("Viatura não encontrada");
      }
    }

    // Validate personnel if changed
    if (updateData.personnelId) {
      const personnel = await ctx.db.get(updateData.personnelId);
      if (!personnel) {
        throw new Error("Militar não encontrado");
      }
    }

    // Validate KM if changed
    if (updateData.departureKm !== undefined && updateData.departureKm < 0) {
      throw new Error("Quilometragem de saída não pode ser negativa");
    }

    if (updateData.arrivalKm !== undefined && updateData.arrivalKm < 0) {
      throw new Error("Quilometragem de chegada não pode ser negativa");
    }

    // Validate arrival KM is greater than departure KM
    const finalDepartureKm = updateData.departureKm ?? movement.departureKm;
    if (updateData.arrivalKm !== undefined && updateData.arrivalKm < finalDepartureKm) {
      throw new Error(
        `KM de chegada (${updateData.arrivalKm}) não pode ser menor que KM de saída (${finalDepartureKm})`
      );
    }

    const now = Date.now();
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: now,
    });

    return id;
  },
});

// Query: List movements with optional filters (for admin page)
export const listFiltered = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    vehicleId: v.optional(v.id("vehicles")),
    status: v.optional(
      v.union(v.literal("em_transito"), v.literal("concluido"))
    ),
  },
  handler: async (ctx, args) => {
    let movements: Doc<"vehicleMovements">[];

    if (args.startDate !== undefined && args.endDate !== undefined) {
      movements = await ctx.db
        .query("vehicleMovements")
        .withIndex("by_date", (q) =>
          q.gte("departureTime", args.startDate!).lt("departureTime", args.endDate!)
        )
        .order("desc")
        .take(200);
    } else if (args.startDate !== undefined) {
      movements = await ctx.db
        .query("vehicleMovements")
        .withIndex("by_date", (q) => q.gte("departureTime", args.startDate!))
        .order("desc")
        .take(200);
    } else if (args.endDate !== undefined) {
      movements = await ctx.db
        .query("vehicleMovements")
        .withIndex("by_date", (q) => q.lt("departureTime", args.endDate!))
        .order("desc")
        .take(200);
    } else if (args.vehicleId !== undefined) {
      movements = await ctx.db
        .query("vehicleMovements")
        .withIndex("by_vehicle", (q) => q.eq("vehicleId", args.vehicleId!))
        .order("desc")
        .take(200);

      if (args.status) {
        movements = movements.filter((m) => m.status === args.status);
      }
    } else if (args.status) {
      movements = await ctx.db
        .query("vehicleMovements")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(200);
    } else {
      // No filters: return last 100
      movements = await ctx.db
        .query("vehicleMovements")
        .withIndex("by_date")
        .order("desc")
        .take(100);
    }

    // Apply secondary filters for date-range queries
    if (args.startDate !== undefined || args.endDate !== undefined) {
      if (args.vehicleId) {
        movements = movements.filter((m) => m.vehicleId === args.vehicleId);
      }
      if (args.status) {
        movements = movements.filter((m) => m.status === args.status);
      }
    }

    return await enrichMovements(ctx, movements);
  },
});

// Mutation: Delete movement
export const remove = mutation({
  args: { id: v.id("vehicleMovements") },
  handler: async (ctx, args) => {
    const movement = await ctx.db.get(args.id);
    if (!movement) {
      throw new Error("Movimento não encontrado");
    }

    // Allow deleting all movements (including completed ones)
    await ctx.db.delete(args.id);
    return args.id;
  },
});

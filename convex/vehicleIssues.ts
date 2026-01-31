import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Query: Listar todos os problemas com filtros opcionais
export const list = query({
  args: {
    vehicleId: v.optional(v.id("vehicles")),
    status: v.optional(
      v.union(
        v.literal("open"),
        v.literal("in_progress"),
        v.literal("resolved"),
        v.literal("closed")
      )
    ),
    severity: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("critical")
      )
    ),
  },
  handler: async (ctx, args) => {
    // Buscar problemas com filtros
    let issuesQuery = ctx.db.query("vehicleIssues");

    let issues;
    if (args.vehicleId) {
      issues = await issuesQuery
        .withIndex("by_vehicle", (q) => q.eq("vehicleId", args.vehicleId!))
        .collect();
    } else {
      issues = await issuesQuery.collect();
    }

    // Aplicar filtros
    let filtered = issues;
    if (args.status) {
      filtered = filtered.filter((i) => i.status === args.status);
    }
    if (args.severity) {
      filtered = filtered.filter((i) => i.severity === args.severity);
    }

    // Buscar dados da viatura para cada problema
    const issuesWithVehicle = await Promise.all(
      filtered.map(async (issue) => {
        const vehicle = await ctx.db.get(issue.vehicleId);
        if (!vehicle) {
          return { ...issue, vehicle: null };
        }
        return {
          ...issue,
          vehicle: {
            _id: vehicle._id as Id<"vehicles">,
            operationalPrefix: vehicle.operationalPrefix as string,
            plate: vehicle.plate as string,
            brand: vehicle.brand as string,
            model: vehicle.model as string,
          },
        };
      })
    );

    return issuesWithVehicle;
  },
});

// Query: Buscar problema por ID
export const get = query({
  args: { id: v.id("vehicleIssues") },
  handler: async (ctx, args) => {
    const issue = await ctx.db.get(args.id);
    if (!issue) return null;

    const vehicle = await ctx.db.get(issue.vehicleId);

    let maintenanceRecord = null;
    if (issue.maintenanceRecordId) {
      maintenanceRecord = await ctx.db.get(issue.maintenanceRecordId);
    }

    return {
      ...issue,
      vehicle: vehicle
        ? {
            _id: vehicle._id as Id<"vehicles">,
            operationalPrefix: vehicle.operationalPrefix as string,
            plate: vehicle.plate as string,
            brand: vehicle.brand as string,
            model: vehicle.model as string,
          }
        : null,
      maintenanceRecord,
    };
  },
});

// Mutation: Criar novo problema
export const create = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    title: v.string(),
    description: v.string(),
    severity: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
  },
  handler: async (ctx, args) => {
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle) {
      throw new Error("Viatura não encontrada");
    }

    const now = Date.now();
    return await ctx.db.insert("vehicleIssues", {
      ...args,
      status: "open",
      reportedDate: now,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation: Atualizar problema
export const update = mutation({
  args: {
    id: v.id("vehicleIssues"),
    title: v.string(),
    description: v.string(),
    severity: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("closed")
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;

    const issue = await ctx.db.get(id);
    if (!issue) {
      throw new Error("Problema não encontrado");
    }

    await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Mutation: Atualizar status do problema
export const updateStatus = mutation({
  args: {
    id: v.id("vehicleIssues"),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("closed")
    ),
  },
  handler: async (ctx, args) => {
    const issue = await ctx.db.get(args.id);
    if (!issue) {
      throw new Error("Problema não encontrado");
    }

    const updates: any = {
      status: args.status,
      updatedAt: Date.now(),
    };

    // Se estiver marcando como resolvido, adicionar data de resolução
    if (args.status === "resolved" || args.status === "closed") {
      updates.resolvedDate = Date.now();
    }

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

// Mutation: Vincular problema a uma manutenção
export const linkToMaintenance = mutation({
  args: {
    id: v.id("vehicleIssues"),
    maintenanceRecordId: v.id("maintenanceRecords"),
  },
  handler: async (ctx, args) => {
    const issue = await ctx.db.get(args.id);
    if (!issue) {
      throw new Error("Problema não encontrado");
    }

    const maintenance = await ctx.db.get(args.maintenanceRecordId);
    if (!maintenance) {
      throw new Error("Registro de manutenção não encontrado");
    }

    await ctx.db.patch(args.id, {
      maintenanceRecordId: args.maintenanceRecordId,
      status: "in_progress",
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

// Mutation: Deletar problema
export const remove = mutation({
  args: { id: v.id("vehicleIssues") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Query: Estatísticas de problemas
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const issues = await ctx.db.query("vehicleIssues").collect();
    const total = issues.length;

    const open = issues.filter((i) => i.status === "open").length;
    const inProgress = issues.filter((i) => i.status === "in_progress").length;
    const resolved = issues.filter((i) => i.status === "resolved").length;
    const closed = issues.filter((i) => i.status === "closed").length;

    const critical = issues.filter(
      (i) => i.severity === "critical" && (i.status === "open" || i.status === "in_progress")
    ).length;
    const high = issues.filter(
      (i) => i.severity === "high" && (i.status === "open" || i.status === "in_progress")
    ).length;

    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
      critical,
      high,
    };
  },
});

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Query: Get checklist template for a specific vehicle and role
export const getTemplate = query({
  args: {
    vehicleId: v.id("vehicles"),
    role: v.union(v.literal("motorista"), v.literal("comandante")),
  },
  handler: async (ctx, args) => {
    const template = await ctx.db
      .query("vehicleChecklistTemplates")
      .withIndex("by_vehicle_and_role", (q) =>
        q.eq("vehicleId", args.vehicleId).eq("role", args.role)
      )
      .first();

    if (!template) return null;

    // Enrich with editor info
    const editor = await ctx.db.get(template.updatedBy);
    return {
      ...template,
      editorName: editor?.name || editor?.email || "Administrador",
    };
  },
});

// Mutation: Save checklist template (Admin only)
export const saveTemplate = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    role: v.union(v.literal("motorista"), v.literal("comandante")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Não autorizado. Usuário não autenticado.");
    }

    const existing = await ctx.db
      .query("vehicleChecklistTemplates")
      .withIndex("by_vehicle_and_role", (q) =>
        q.eq("vehicleId", args.vehicleId).eq("role", args.role)
      )
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        updatedAt: now,
        updatedBy: userId,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("vehicleChecklistTemplates", {
        vehicleId: args.vehicleId,
        role: args.role,
        content: args.content,
        updatedAt: now,
        updatedBy: userId,
      });
    }
  },
});

// Mutation: Submit a checklist (Militar)
export const submitChecklist = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    role: v.union(v.literal("motorista"), v.literal("comandante")),
    hasAlterations: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Não autorizado. Usuário não autenticado.");
    }

    // Verify if vehicle exists
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle) {
      throw new Error("Viatura não encontrada.");
    }

    const now = Date.now();

    return await ctx.db.insert("vehicleChecklistSubmissions", {
      vehicleId: args.vehicleId,
      userId: userId,
      role: args.role,
      hasAlterations: args.hasAlterations,
      createdAt: now,
      seiStatus: args.hasAlterations ? "pending" : undefined,
    });
  },
});

// Query: List daily checklist status for all vehicles
export const listDailyStatus = query({
  args: {
    startMs: v.number(), // Shift start epoch ms
    endMs: v.number(),   // Shift end epoch ms
  },
  handler: async (ctx, args) => {
    const vehicles = await ctx.db.query("vehicles").collect();

    // Fetch all submissions within the shift time range
    const submissions = await ctx.db
      .query("vehicleChecklistSubmissions")
      .withIndex("by_date")
      .filter((q) =>
        q.and(
          q.gte(q.field("createdAt"), args.startMs),
          q.lt(q.field("createdAt"), args.endMs)
        )
      )
      .collect();

    // Enrich submissions with user info (email/name)
    const enrichedSubmissions = await Promise.all(
      submissions.map(async (sub) => {
        const user = await ctx.db.get(sub.userId);
        return {
          ...sub,
          userName: user?.name || user?.email || "Usuário",
          userEmail: user?.email,
        };
      })
    );

    // Map status per vehicle
    return vehicles.map((v) => {
      const vehicleSubmissions = enrichedSubmissions.filter(
        (sub) => sub.vehicleId === v._id
      );

      const motoristaSub = vehicleSubmissions.find(
        (sub) => sub.role === "motorista"
      );
      const comandanteSub = vehicleSubmissions.find(
        (sub) => sub.role === "comandante"
      );

      return {
        vehicleId: v._id,
        operationalPrefix: v.operationalPrefix,
        plate: v.plate,
        model: v.model,
        motorista: motoristaSub || null,
        comandante: comandanteSub || null,
      };
    }).sort((a, b) => a.operationalPrefix.localeCompare(b.operationalPrefix));
  },
});

// Mutation: Update SEI details of a submission (Admin only)
export const updateSeiDetails = mutation({
  args: {
    submissionId: v.id("vehicleChecklistSubmissions"),
    seiProcessNumber: v.optional(v.string()),
    seiStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("in_progress"),
        v.literal("resolved"),
        v.literal("no_action_needed")
      )
    ),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Não autorizado. Usuário não autenticado.");
    }

    const submission = await ctx.db.get(args.submissionId);
    if (!submission) {
      throw new Error("Submissão de checklist não encontrada.");
    }

    await ctx.db.patch(args.submissionId, {
      seiProcessNumber: args.seiProcessNumber,
      seiStatus: args.seiStatus,
      adminNotes: args.adminNotes,
    });

    return args.submissionId;
  },
});

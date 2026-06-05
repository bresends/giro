import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

// Query: List all operational functions (enriched with current vehicle details)
export const listOperationalFunctions = query({
  args: {
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let functions = await ctx.db.query("operationalFunctions").collect();

    if (args.activeOnly) {
      functions = functions.filter((f) => f.active);
    }

    return await Promise.all(
      functions.map(async (f) => {
        const vehicle = f.currentVehicleId
          ? await ctx.db.get(f.currentVehicleId)
          : null;
        return {
          ...f,
          vehicle: vehicle
            ? {
                _id: vehicle._id,
                operationalPrefix: vehicle.operationalPrefix,
                plate: vehicle.plate,
                model: vehicle.model,
              }
            : null,
        };
      })
    );
  },
});

// Mutation: Save or update an operational function (Admin only)
export const saveOperationalFunction = mutation({
  args: {
    id: v.optional(v.id("operationalFunctions")),
    name: v.string(),
    description: v.optional(v.string()),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Não autorizado. Usuário não autenticado.");
    }

    const now = Date.now();

    if (args.id) {
      await ctx.db.patch(args.id, {
        name: args.name,
        description: args.description,
        active: args.active,
      });
      return args.id;
    } else {
      return await ctx.db.insert("operationalFunctions", {
        name: args.name,
        description: args.description,
        active: args.active,
        createdAt: now,
      });
    }
  },
});

// Mutation: Assign a physical vehicle to an operational function (Admin only)
export const assignVehicle = mutation({
  args: {
    operationalFunctionId: v.id("operationalFunctions"),
    vehicleId: v.optional(v.id("vehicles")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Não autorizado. Usuário não autenticado.");
    }

    const opFunction = await ctx.db.get(args.operationalFunctionId);
    if (!opFunction) {
      throw new Error("Função operacional não encontrada.");
    }

    await ctx.db.patch(args.operationalFunctionId, {
      currentVehicleId: args.vehicleId || undefined,
    });

    return args.operationalFunctionId;
  },
});

// Query: Get checklist template for a specific operational function and role
export const getTemplate = query({
  args: {
    operationalFunctionId: v.id("operationalFunctions"),
    role: v.union(v.literal("motorista"), v.literal("comandante")),
  },
  handler: async (ctx, args) => {
    const template = await ctx.db
      .query("vehicleChecklistTemplates")
      .withIndex("by_function_and_role", (q) =>
        q.eq("operationalFunctionId", args.operationalFunctionId).eq("role", args.role)
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
    operationalFunctionId: v.id("operationalFunctions"),
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
      .withIndex("by_function_and_role", (q) =>
        q.eq("operationalFunctionId", args.operationalFunctionId).eq("role", args.role)
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
        operationalFunctionId: args.operationalFunctionId,
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
    operationalFunctionId: v.id("operationalFunctions"),
    role: v.union(v.literal("motorista"), v.literal("comandante")),
    hasAlterations: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Não autorizado. Usuário não autenticado.");
    }

    // Verify operational function exists
    const opFunction = await ctx.db.get(args.operationalFunctionId);
    if (!opFunction) {
      throw new Error("Função operacional não encontrada.");
    }

    // Check if the admin linked a physical vehicle to this function for this shift
    if (!opFunction.currentVehicleId) {
      throw new Error(
        `Esta função (${opFunction.name}) não possui nenhuma viatura física vinculada pelo Comando para este turno.`
      );
    }

    // Verify if vehicle exists
    const vehicle = await ctx.db.get(opFunction.currentVehicleId);
    if (!vehicle) {
      throw new Error("Viatura física vinculada não encontrada no sistema.");
    }

    const now = Date.now();

    return await ctx.db.insert("vehicleChecklistSubmissions", {
      operationalFunctionId: args.operationalFunctionId,
      vehicleId: opFunction.currentVehicleId,
      userId: userId,
      role: args.role,
      hasAlterations: args.hasAlterations,
      createdAt: now,
      seiStatus: args.hasAlterations ? "pending" : undefined,
    });
  },
});

// Query: List daily checklist status for all operational functions
export const listDailyStatus = query({
  args: {
    startMs: v.number(), // Shift start epoch ms
    endMs: v.number(),   // Shift end epoch ms
  },
  handler: async (ctx, args) => {
    let functions = await ctx.db.query("operationalFunctions").collect();
    functions = functions.filter((f) => f.active);

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

    // Enrich submissions with user and vehicle info
    const enrichedSubmissions = await Promise.all(
      submissions.map(async (sub) => {
        const user = await ctx.db.get(sub.userId);
        const vehicle = await ctx.db.get(sub.vehicleId);
        return {
          ...sub,
          userName: user?.name || user?.email || "Usuário",
          userEmail: user?.email,
          vehiclePrefix: vehicle?.operationalPrefix || "N/A",
          vehiclePlate: vehicle?.plate || "N/A",
        };
      })
    );

    // Map status per operational function
    return await Promise.all(
      functions.map(async (f) => {
        const functionSubmissions = enrichedSubmissions.filter(
          (sub) => sub.operationalFunctionId === f._id
        );

        const motoristaSub = functionSubmissions.find(
          (sub) => sub.role === "motorista"
        );
        const comandanteSub = functionSubmissions.find(
          (sub) => sub.role === "comandante"
        );

        // Get details of the vehicle assigned currently
        const currentVehicle = f.currentVehicleId
          ? await ctx.db.get(f.currentVehicleId)
          : null;

        return {
          operationalFunctionId: f._id,
          name: f.name,
          active: f.active,
          currentVehicle: currentVehicle
            ? {
                _id: currentVehicle._id,
                operationalPrefix: currentVehicle.operationalPrefix,
                plate: currentVehicle.plate,
                model: currentVehicle.model,
              }
            : null,
          motorista: motoristaSub || null,
          comandante: comandanteSub || null,
        };
      })
    ).then((list) =>
      list.sort((a, b) => a.name.localeCompare(b.name))
    );
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

// Mutation: Seed operational functions if empty
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("operationalFunctions").collect();
    if (existing.length > 0) return;

    const baseFunctions = [
      "ARCA-01",
      "UR-8°BBM ORDINÁRIA",
      "UR-DBM JARDIM SANTO ANTÔNIO",
      "UR-8°BBM EXTRA",
      "ABTS-12",
      "ABT-32",
      "ASA-AREA",
      "ASA-OCV",
      "ASA-OPERAÇÃO TEMPESTADE"
    ];

    const now = Date.now();
    for (const name of baseFunctions) {
      await ctx.db.insert("operationalFunctions", {
        name,
        active: true,
        createdAt: now,
      });
    }
  },
});

// Mutation: Migrate legacy checklist templates and submissions to use operational functions
export const migrateToOperationalFunctions = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Ensure operational functions are seeded
    const existingFunctions = await ctx.db.query("operationalFunctions").collect();
    let seededFunctions: { _id: Id<"operationalFunctions">; name: string }[] = existingFunctions;
    if (existingFunctions.length === 0) {
      const baseFunctions = [
        "ARCA-01",
        "UR-8°BBM ORDINÁRIA",
        "UR-DBM JARDIM SANTO ANTÔNIO",
        "UR-8°BBM EXTRA",
        "ABTS-12",
        "ABT-32",
        "ASA-AREA",
        "ASA-OCV",
        "ASA-OPERAÇÃO TEMPESTADE"
      ];
      const now = Date.now();
      const newFunctions = [];
      for (const name of baseFunctions) {
        const id = await ctx.db.insert("operationalFunctions", {
          name,
          active: true,
          createdAt: now,
        });
        newFunctions.push({ _id: id, name });
      }
      seededFunctions = newFunctions;
    }

    // Helper: find closest operational function based on vehicle details
    const findOpFunctionForVehicle = (prefix: string) => {
      const upperPrefix = prefix.toUpperCase();
      if (upperPrefix.includes("ASA")) {
        return seededFunctions.find((f) => f.name.includes("ASA-AREA"))?._id || seededFunctions[0]._id;
      }
      if (upperPrefix.includes("ARCA")) {
        return seededFunctions.find((f) => f.name.includes("ARCA-01"))?._id || seededFunctions[0]._id;
      }
      if (upperPrefix.includes("ABTS")) {
        return seededFunctions.find((f) => f.name.includes("ABTS-12"))?._id || seededFunctions[0]._id;
      }
      if (upperPrefix.includes("ABT")) {
        return seededFunctions.find((f) => f.name.includes("ABT-32"))?._id || seededFunctions[0]._id;
      }
      if (upperPrefix.includes("UR")) {
        if (upperPrefix.includes("JARDIM") || upperPrefix.includes("SANTO")) {
          return seededFunctions.find((f) => f.name.includes("JARDIM SANTO"))?._id || seededFunctions[0]._id;
        }
        if (upperPrefix.includes("EXTRA")) {
          return seededFunctions.find((f) => f.name.includes("EXTRA"))?._id || seededFunctions[0]._id;
        }
        return seededFunctions.find((f) => f.name.includes("ORDINÁRIA"))?._id || seededFunctions[0]._id;
      }
      return seededFunctions[0]._id; // Fallback to first function
    };

    // 2. Migrate Templates
    const templates = await ctx.db.query("vehicleChecklistTemplates").collect();
    for (const template of templates) {
      const legacyTemplate = template as any;
      if (!legacyTemplate.operationalFunctionId && legacyTemplate.vehicleId) {
        const vehicle = (await ctx.db.get(legacyTemplate.vehicleId)) as any;
        const opFunctionId = findOpFunctionForVehicle(vehicle?.operationalPrefix || "ASA");
        
        await ctx.db.patch(template._id, {
          operationalFunctionId: opFunctionId,
          vehicleId: undefined, // Remove legacy field
        } as any);
      }
    }

    // 3. Migrate Submissions
    const submissions = await ctx.db.query("vehicleChecklistSubmissions").collect();
    for (const sub of submissions) {
      const legacySub = sub as any;
      if (!legacySub.operationalFunctionId) {
        const vehicle = (await ctx.db.get(legacySub.vehicleId)) as any;
        const opFunctionId = findOpFunctionForVehicle(vehicle?.operationalPrefix || "ASA");
        
        await ctx.db.patch(sub._id, {
          operationalFunctionId: opFunctionId,
        } as any);
      }
    }
  },
});


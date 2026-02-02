import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Query: List all personnel
export const list = query({
  args: {
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let personnel = await ctx.db.query("personnel").collect();

    if (args.activeOnly) {
      personnel = personnel.filter((p) => p.active);
    }

    return personnel.sort((a, b) => a.name.localeCompare(b.name));
  },
});

// Query: Get personnel by ID
export const get = query({
  args: { id: v.id("personnel") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Query: Get personnel by RG
export const getByRG = query({
  args: { rg: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("personnel")
      .withIndex("by_rg", (q) => q.eq("rg", args.rg))
      .first();
  },
});

// Query: Search personnel by name
export const searchByName = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const allPersonnel = await ctx.db.query("personnel").collect();
    const searchLower = args.query.toLowerCase();

    return allPersonnel
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.rg.toString().includes(args.query)
      )
      .slice(0, 20);
  },
});

// Mutation: Create new personnel
export const create = mutation({
  args: {
    rank: v.string(),
    rg: v.number(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if RG already exists
    const existing = await ctx.db
      .query("personnel")
      .withIndex("by_rg", (q) => q.eq("rg", args.rg))
      .first();

    if (existing) {
      throw new Error(
        `RG ${args.rg} já cadastrado para ${existing.rank} ${existing.name}`
      );
    }

    const now = Date.now();
    return await ctx.db.insert("personnel", {
      ...args,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation: Update personnel
export const update = mutation({
  args: {
    id: v.id("personnel"),
    rank: v.string(),
    rg: v.number(),
    name: v.string(),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;

    // Check if RG is being changed and if it's already in use
    const existing = await ctx.db
      .query("personnel")
      .withIndex("by_rg", (q) => q.eq("rg", data.rg))
      .first();

    if (existing && existing._id !== id) {
      throw new Error(
        `RG ${data.rg} já cadastrado para ${existing.rank} ${existing.name}`
      );
    }

    await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Mutation: Delete personnel
export const remove = mutation({
  args: { id: v.id("personnel") },
  handler: async (ctx, args) => {
    // Check if personnel has movements
    const movements = await ctx.db
      .query("vehicleMovements")
      .filter((q) => q.eq(q.field("personnelId"), args.id))
      .first();

    if (movements) {
      throw new Error(
        "Não é possível deletar este militar pois existem movimentos associados"
      );
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

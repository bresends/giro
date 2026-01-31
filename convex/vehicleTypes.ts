import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Query: Listar todos os tipos de viaturas
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("vehicleTypes").collect();
  },
});

// Query: Buscar tipo de viatura por ID
export const get = query({
  args: { id: v.id("vehicleTypes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutation: Criar novo tipo de viatura
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    maintenanceRules: v.object({
      kmInterval: v.optional(v.number()),
      timeInterval: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    // Verifica se já existe um tipo com esse nome
    const existing = await ctx.db
      .query("vehicleTypes")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existing) {
      throw new Error(`Já existe um tipo de viatura com o nome "${args.name}"`);
    }

    return await ctx.db.insert("vehicleTypes", args);
  },
});

// Mutation: Atualizar tipo de viatura
export const update = mutation({
  args: {
    id: v.id("vehicleTypes"),
    name: v.string(),
    description: v.string(),
    maintenanceRules: v.object({
      kmInterval: v.optional(v.number()),
      timeInterval: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;

    // Verifica se existe outro tipo com o mesmo nome
    const existing = await ctx.db
      .query("vehicleTypes")
      .withIndex("by_name", (q) => q.eq("name", data.name))
      .first();

    if (existing && existing._id !== id) {
      throw new Error(`Já existe um tipo de viatura com o nome "${data.name}"`);
    }

    await ctx.db.patch(id, data);
    return id;
  },
});

// Mutation: Deletar tipo de viatura
export const remove = mutation({
  args: { id: v.id("vehicleTypes") },
  handler: async (ctx, args) => {
    // Verifica se existem viaturas usando este tipo
    const vehiclesUsingType = await ctx.db
      .query("vehicles")
      .withIndex("by_type", (q) => q.eq("typeId", args.id))
      .first();

    if (vehiclesUsingType) {
      throw new Error(
        "Não é possível deletar este tipo pois existem viaturas cadastradas com ele"
      );
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

import { mutation } from "./_generated/server";

// Script para popular tipos de viaturas iniciais do CBMGO
// Execute com: npx convex run seedVehicleTypes:seedInitialTypes

export const seedInitialTypes = mutation({
  args: {},
  handler: async (ctx) => {
    // Limpa todos os tipos existentes para re-popular
    const existingTypes = await ctx.db.query("vehicleTypes").collect();
    for (const type of existingTypes) {
      await ctx.db.delete(type._id);
    }

    // Tipos de viaturas padrão fornecidos pelo usuário
    const vehicleTypes = [
      {
        name: "ABT",
        description: "Auto Bomba Tanque",
        maintenanceRules: {
          kmInterval: 5000,
          timeInterval: 180,
        },
      },
      {
        name: "ABTS",
        description: "Auto Bomba Tanque e Salvamento",
        maintenanceRules: {
          kmInterval: 5000,
          timeInterval: 180,
        },
      },
      {
        name: "ASA",
        description: "Auto Salvamento Aquático",
        maintenanceRules: {
          kmInterval: 5000,
          timeInterval: 180,
        },
      },
      {
        name: "AV",
        description: "Auto Vistoria",
        maintenanceRules: {
          kmInterval: 5000,
          timeInterval: 180,
        },
      },
      {
        name: "UR",
        description: "Unidade de Resgate",
        maintenanceRules: {
          kmInterval: 5000,
          timeInterval: 180,
        },
      },
    ];

    // Insere os tipos no banco de dados
    const ids = [];
    for (const type of vehicleTypes) {
      const id = await ctx.db.insert("vehicleTypes", type);
      ids.push(id);
    }

    return {
      success: true,
      message: `${ids.length} tipos de viaturas criados com sucesso`,
      ids,
    };
  },
});

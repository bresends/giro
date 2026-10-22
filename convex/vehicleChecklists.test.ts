import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = {
  "./_generated/server.js": () => import("./_generated/server.js"),
  "./vehicleChecklists.ts": () => import("./vehicleChecklists"),
};

async function setup({ template = true, submission = true, active = true } = {}) {
  const t = convexTest(schema, modules);
  const ids = await t.run(async (ctx) => {
    const userId = await ctx.db.insert("users", { name: "Administrador" });
    const typeId = await ctx.db.insert("vehicleTypes", {
      name: "Resgate",
      description: "Resgate",
      maintenanceRules: {},
    });
    const vehicleId = await ctx.db.insert("vehicles", {
      plate: "ABC1D23",
      brand: "Ford",
      model: "Transit",
      year: 2026,
      chassisNumber: "123",
      renavam: "123",
      operationalPrefix: "UR-01",
      typeId,
      ownershipType: "propria",
      serviceType: "operational",
      createdAt: 1,
      updatedAt: 1,
    });
    const functionId = await ctx.db.insert("operationalFunctions", {
      name: "Resgate",
      active,
      currentVehicleId: vehicleId,
      createdAt: 1,
    });
    if (template) {
      await ctx.db.insert("vehicleChecklistTemplates", {
        operationalFunctionId: functionId,
        role: "comandante",
        content: "<p>Materiais de resgate</p>",
        updatedAt: 1,
        updatedBy: userId,
      });
    }
    if (submission) {
      await ctx.db.insert("vehicleChecklistSubmissions", {
        operationalFunctionId: functionId,
        vehicleId,
        userId,
        role: "motorista",
        hasAlterations: false,
        createdAt: 1,
      });
    }
    return { userId, functionId };
  });
  const authenticated = t.withIdentity({ subject: `${ids.userId}|session` });
  const readRecords = () => t.run(async (ctx) => ({
    functions: await ctx.db.query("operationalFunctions").collect(),
    templates: await ctx.db.query("vehicleChecklistTemplates").collect(),
    submissions: await ctx.db.query("vehicleChecklistSubmissions").collect(),
  }));
  return { t, authenticated, readRecords, ...ids };
}

test.each([
  { template: true, submission: false, active: true },
  { template: false, submission: true, active: true },
  { template: true, submission: true, active: true },
  { template: true, submission: true, active: false },
])("preserva todos os registros ao tentar excluir função vinculada: %o", async (options) => {
  const { authenticated, functionId, readRecords } = await setup(options);
  const before = await readRecords();

  await expect(authenticated.mutation(
    api.vehicleChecklists.removeOperationalFunction,
    { id: functionId }
  )).rejects.toThrow("desative-a para preservar os dados");

  expect(await readRecords()).toEqual(before);
});

test("permite excluir função sem vínculos e preserva os dados de outras funções", async () => {
  const { authenticated, readRecords } = await setup();
  const before = await readRecords();
  const emptyId = await authenticated.mutation(api.vehicleChecklists.saveOperationalFunction, {
    name: "Resgate",
    active: true,
  });

  await authenticated.mutation(api.vehicleChecklists.removeOperationalFunction, { id: emptyId });

  expect(await readRecords()).toEqual(before);
});

test("renomear e desativar preserva modelos, conferências e viatura vinculada", async () => {
  const { authenticated, functionId, readRecords } = await setup();
  const before = await readRecords();

  const savedId = await authenticated.mutation(api.vehicleChecklists.saveOperationalFunction, {
    id: functionId,
    name: "Unidade de Resgate Serviço Ordinário I",
    active: false,
  });

  expect(savedId).toBe(functionId);
  expect(await readRecords()).toEqual({
    ...before,
    functions: [{ ...before.functions[0], name: "Unidade de Resgate Serviço Ordinário I", active: false }],
  });
  expect(await authenticated.query(api.vehicleChecklists.listOperationalFunctions, {
    activeOnly: true,
  })).toEqual([]);
  expect(await authenticated.query(api.vehicleChecklists.getTemplate, {
    operationalFunctionId: functionId,
    role: "comandante",
  })).toMatchObject({ content: "<p>Materiais de resgate</p>" });
});

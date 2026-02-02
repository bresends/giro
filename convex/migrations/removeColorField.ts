import { internalMutation } from "../_generated/server";

// Migration to remove the color field from all vehicles
// According to Convex docs: db.patch with undefined removes the field
export const removeColorFromVehicles = internalMutation({
  args: {},
  handler: async (ctx) => {
    const vehicles = await ctx.db.query("vehicles").collect();

    let count = 0;
    for (const vehicle of vehicles) {
      // @ts-ignore - accessing field that may not be in schema
      if (vehicle.color !== undefined) {
        // db.patch with undefined removes the field from the document
        await ctx.db.patch(vehicle._id, {
          // @ts-ignore - setting field to undefined to remove it
          color: undefined,
        });
        count++;
      }
    }

    return {
      success: true,
      message: `Removed color field from ${count} vehicles`,
      totalVehicles: vehicles.length,
      vehiclesUpdated: count,
    };
  },
});

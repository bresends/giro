import { internalMutation } from "../_generated/server";

// Migration to convert RG from string to number
export const convertRgToNumber = internalMutation({
  args: {},
  handler: async (ctx) => {
    const personnel = await ctx.db.query("personnel").collect();

    let converted = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const person of personnel) {
      // @ts-ignore - accessing field that may be string or number
      if (typeof person.rg === "string") {
        // Remove any non-numeric characters and convert to number
        // @ts-ignore - person.rg is string here
        const numericRg = person.rg.replace(/\D/g, "");
        const rgNumber = parseInt(numericRg, 10);

        if (isNaN(rgNumber)) {
          errors.push(`Person ${person._id} has invalid RG: ${person.rg}`);
          skipped++;
          continue;
        }

        await ctx.db.patch(person._id, {
          // @ts-ignore - setting rg as number
          rg: rgNumber,
        });
        converted++;
      } else {
        skipped++;
      }
    }

    return {
      success: errors.length === 0,
      message: `Converted ${converted} RGs to number, skipped ${skipped}`,
      totalPersonnel: personnel.length,
      converted,
      skipped,
      errors,
    };
  },
});

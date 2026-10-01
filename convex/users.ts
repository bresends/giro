import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Dados do usuário logado para exibição (nome, email e foto do Google)
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const user = await ctx.db.get("users", userId);
    if (user === null) return null;
    return {
      name: user.name ?? null,
      email: user.email ?? null,
      image: user.image ?? null,
    };
  },
});

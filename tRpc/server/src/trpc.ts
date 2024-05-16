import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import { createContext } from "./context";

export const trpc = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>()
  .create();

const isAdminMiddleware = trpc.middleware(({ ctx, next }) => {
  if (ctx.isAdmin) {
    return next({ ctx: { user: { id: "Secret ID 1 via context" } } });
  }
  throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "You are not authorized to access this resource",
  });
});

export const adminProcedures = trpc.procedure.use(isAdminMiddleware);

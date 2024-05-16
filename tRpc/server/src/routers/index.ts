import { adminProcedures, trpc } from "../trpc";
import { UserRouter } from "./users";

export const appRouter = trpc.router({
  sayHi: trpc.procedure.query(() => {
    return "Hello from server!";
  }),

  logHiToserver: trpc.procedure
    .input((v) => {
      if (typeof v === "string") return v;

      throw new Error("Invalid input : must be a string");
    })
    .mutation((req) => {
      console.log(`Client Says, ${req.input} `);
      return true;
    }),

  secretData: adminProcedures.query(({ ctx }) => {
    console.log(ctx.user);
    return "Secret Data";
  }),

  users: UserRouter,
});

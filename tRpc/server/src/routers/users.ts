import { observable } from "@trpc/server/observable";
import { trpc } from "../trpc";
import { z } from "zod";
import { EventEmitter } from "stream";

const userProcedures = trpc.procedure.input(
  z.object({
    userId: z.string(),
  })
);

const eventEmitter = new EventEmitter();
export const UserRouter = trpc.router({
  getUserName: userProcedures.query(({ input }) => {
    return { id: input.userId };
  }),
  update: userProcedures
    .input(z.object({ name: z.string() }))
    .output(
      z.object({
        name: z.string(),
        id: z.string(),
      })
    )
    .mutation((req) => {
      console.log("IsAdmin: ", req.ctx.isAdmin);
      console.log(
        `Updating user ${req.input.userId} with name ${req.input.name}`
      );
      eventEmitter.emit("update", req.input.userId);
      return { id: req.input.userId, name: req.input.name };
    }),

  onUpdate: trpc.procedure.subscription(() => {
    return observable<string>((emit) => {
      eventEmitter.on("update", emit.next);

      return () => {
        eventEmitter.off("update", emit.next);
      };
    });
  }),
});

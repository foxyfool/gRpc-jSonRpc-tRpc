import express from "express";
const cors = require("cors");
import { appRouter } from "./routers/index";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { createContext } from "./context";
import ws from "ws";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
  })
);

const server = app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

applyWSSHandler({
  wss: new ws.Server({ server }),
  router: appRouter,
  createContext,
});

export type AppRouter = typeof appRouter;

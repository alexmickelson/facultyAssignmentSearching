import { filesRouter } from "../routers/files";
import { greetingRouter } from "../routers/greetings";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  greeting: greetingRouter,
  files: filesRouter,
});

export type AppRouter = typeof appRouter;

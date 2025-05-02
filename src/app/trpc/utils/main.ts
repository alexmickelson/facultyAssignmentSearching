import { assignmentGenerationRouter } from "../routers/assignmentGeneration";
import { filesRouter } from "../routers/files";
import { greetingRouter } from "../routers/greetings";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  greeting: greetingRouter,
  assignmetnGeneration: assignmentGenerationRouter,
  files: filesRouter,
});

export type AppRouter = typeof appRouter;

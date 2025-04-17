import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc";

export const greetingRouter = {
  hello: publicProcedure.query(() => {
    return "hello world";
  }),
} satisfies TRPCRouterRecord;

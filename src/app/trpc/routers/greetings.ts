import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../utils/trpc";

export const greetingRouter = {
  hello: publicProcedure.query(() => {
    return "hello world";
  }),
} satisfies TRPCRouterRecord;

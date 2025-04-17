import { greetingRouter } from './routers/greetings'
import { createTRPCRouter } from './trpc'


export const appRouter = createTRPCRouter({
  greeting: greetingRouter
})

export type AppRouter = typeof appRouter
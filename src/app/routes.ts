import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("features/home.tsx"),
  route('/api/trpc/*', 'features/api/trpc.ts'),
  route('/tts', "./features/tts/TextToSpeechPage.tsx")
] satisfies RouteConfig;

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/home.tsx"),
  route('/api/trpc/*', 'pages/api/trpc.ts'),
] satisfies RouteConfig;

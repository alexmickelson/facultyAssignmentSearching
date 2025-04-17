import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { useTRPC } from "~/trpc/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useQuery(trpc.greeting.hello.queryOptions());
  console.log("trpc greeting", data);
  return (
    <>
      <button
        className="
          bg-emerald-800
          hover:bg-emerald-900
          text-emerald-50
          font-bold
          py-2
          px-4
          rounded
        "
        onClick={() =>
          queryClient.invalidateQueries({
            queryKey: trpc.greeting.hello.queryKey(),
          })
        }
      >
        invalidate query
      </button>
      <Welcome />
    </>
  );
}

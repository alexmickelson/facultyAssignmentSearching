import type { Route } from "../+types/root";
import { useTRPC } from "~/trpc/trpcClient";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import IndexFiles from "./indexing/IndexFiles";
import SearchInput from "./search/SearchInput";
import SearchForm from "./search/SearchForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const trpc = useTRPC();
  const [searchValue, setSearchValue] = useState("");

  const { data } = useQuery(trpc.greeting.hello.queryOptions());
  console.log("trpc greeting", data);

  return (
    <>
      <div
        className="flex 
          flex-col 
          items-center 
          justify-center 
          min-h-screen 
          space-y-4
        "
      >
        <SearchForm />
        <IndexFiles />
      </div>
    </>
  );
}

import type { Route } from "./+types/home";
import { useTRPC } from "~/trpc/trpcClient";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const trpc = useTRPC();
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data } = useQuery(trpc.greeting.hello.queryOptions());
  console.log("trpc greeting", data);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <input
          ref={searchInputRef}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search... (Ctrl+K to focus)"
          className="
            w-1/2
            px-4
            py-2
            border
            border-emerald-700
            rounded
            focus:outline-none
            focus:border-emerald-300
          "
        />
      </div>
    </>
  );
}

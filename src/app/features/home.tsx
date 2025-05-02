import type { Route } from "../+types/root";
import IndexFiles from "./indexing/IndexFiles";
import SearchForm from "./search/SearchForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
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

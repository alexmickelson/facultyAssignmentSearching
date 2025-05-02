import React, { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import { SearchResults } from "./SearchResults";

export default function SearchForm() {
  const [searchValue, setSearchValue] = useState("");
  const [storedValue, setStoredValue] = useState("");

  return (
    <div className="">
      <form
        className="flex flex-row space-x-4 w-200"
        onSubmit={(e) => {
          e.preventDefault();
          setStoredValue(searchValue);
        }}
      >
        <SearchInput value={searchValue} onChange={setSearchValue} />
        <button
          type="submit"
          className="
            bg-gray-800 
            text-white 
            px-4 
            py-2 
            rounded-md 
            hover:bg-gray-700 
            focus:outline-none 
            focus:ring-2 
            focus:ring-gray-600
          "
        >
          Submit
        </button>
      </form>
      {storedValue && <SearchResults searchValue={storedValue} />}
    </div>
  );
}

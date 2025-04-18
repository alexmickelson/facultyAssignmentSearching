import React, { useState } from "react";
import SearchInput from "./SearchInput";

export default function SearchForm() {
  const [searchValue, setSearchValue] = useState("");
  return (
    <div>
      <form>

      <SearchInput value={searchValue} onChange={setSearchValue} />
      <button
        type="submit"
        className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
      >
        Submit
      </button>
      </form>
    </div>
  );
}

import { type FC } from "react";

const SearchResults: FC<{
  files: { name: string; similarityScore: number }[];
}> = ({ files }) => {
  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <strong>{file.name}</strong> - Similarity Score:{" "}
            {file.similarityScore.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;

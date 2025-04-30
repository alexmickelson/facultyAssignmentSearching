import { useEffect, useState, type FC } from "react";
import { getEmbeddings } from "../indexing/embeddingUtils";
import { Spinner } from "../indexing/SingleFile";
import { DisplayEmbeddingResults } from "./DisplayEmbeddingResults";

export const SearchResults: FC<{
  searchValue: string;
}> = ({ searchValue }) => {
  const [embedding, setEmbedding] = useState<null | number[]>();

  useEffect(() => {
    if (searchValue.trim()) {
      (async () => {
        const embeddingResult = await getEmbeddings({ content: searchValue });
        setEmbedding(embeddingResult);
      })();
    }
  }, [searchValue]);

  return (
    <div>
      <h2>Search Results</h2>
      {embedding && <DisplayEmbeddingResults embedding={embedding} />}
      {!embedding && <Spinner />}
    </div>
  );
};

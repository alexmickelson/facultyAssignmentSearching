import { useEffect, useState, type FC } from "react";
import { getEmbeddings } from "../indexing/embeddingHook";
import { Spinner } from "../indexing/SingleFile";
import { useTRPC } from "~/trpc/trpcClient";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

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

function useGetSimilarFilesQuery({ embedding }: { embedding: number[] }) {
  // force to user post request for large embeddings
  // even though this is gross
  const trpc = useTRPC();
  const mutation = useMutation(trpc.files.getSimilarFiles.mutationOptions());
  return useQuery({
    queryKey: ["query", trpc.files.getSimilarFiles.mutationKey()],
    queryFn: async () => {
      return await mutation.mutateAsync({ embedding });
    },
  });
}

const DisplayEmbeddingResults: FC<{
  embedding: number[];
}> = ({ embedding }) => {
  const similarFilesQuery = useGetSimilarFilesQuery({ embedding });
  return (
    <div>
      {similarFilesQuery.isLoading && <Spinner />}
      {similarFilesQuery.data && (
        <div>
          {similarFilesQuery.data.map((file) => (
            <div key={file.fileName} className="flex flex-row">
              <span className="w-50">{file.similarity}</span>
              <span className="flex-1">{file.fileName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

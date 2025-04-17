import { useQueries, useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/trpcClient";
import { pipeline } from '@huggingface/transformers';
import { useState, useEffect } from "react";

export function Spinner() {
  return (
    <div
      className="
        animate-spin 
        rounded-full 
        h-5 
        w-5 
        border-t-2 
        border-b-2 
        border-gray-200"
    ></div>
  );
}

export function SingleFile({ fileName }: { fileName: string }) {
  const trpc = useTRPC();
  const embeddingQuery = useQuery(
    trpc.files.getEmbedding.queryOptions(fileName)
  );

  return (
    <li className="mb-2 flex items-center">
      {embeddingQuery.isLoading ? (
        <Spinner />
      ) : embeddingQuery.data === null ? (
        <span className="mr-2 text-yellow-700">●</span>
      ) : (
        <span className="mr-2 text-green-500">●</span>
      )}
      {fileName}
    </li>
  );
}


function useCreateEmbedding(filePath: string, isEmbeddingNull: boolean) {
  const [embedding, setEmbedding] = useState<number[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEmbeddingNull) return;

    async function generateEmbedding() {
      setIsLoading(true);
      setError(null);

      try {
        const pipelineModel = await pipeline("feature-extraction");
        const result = await pipelineModel(filePath);
        // setEmbedding(result[0]); // Assuming the first result is the embedding
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    }

    generateEmbedding();
  }, [filePath, isEmbeddingNull]);

  return { embedding, isLoading, error };
}
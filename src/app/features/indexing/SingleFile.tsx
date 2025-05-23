import { useQueries, useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/trpcClient";
import { pipeline, Tensor } from "@huggingface/transformers";
import { useState, useEffect } from "react";
import { useMakeEmbeddingMutation } from "./embeddingHook";

export function Spinner() {
  return (
    <div className=" animate-spin  rounded-full  h-5  w-5  border-t-2  border-b-2  border-gray-200"></div>
  );
}

export function SingleFile({ fileName }: { fileName: string }) {
  const trpc = useTRPC();
  // const fileContentsQuery = useQuery(
  //   trpc.files.getFileContents.queryOptions(fileName)
  // );
  const embeddingQuery = useQuery(
    trpc.files.getEmbedding.queryOptions(fileName)
  );

  const makeEmbeddingMutation = useMakeEmbeddingMutation();

  return (
    <div className="mb-2 flex items-center">
      {embeddingQuery.isLoading ? (
        <Spinner />
      ) : embeddingQuery.data !== null ? (
        <div className="h-3 w-3 rounded-full bg-green-700"></div>
      ) : (
        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
      )}
      {fileName}

      {!embeddingQuery.data && (
        <button
          onClick={() => {
          
            makeEmbeddingMutation.mutate({
              fileName,
            });
          }}
          className="ml-2 px-3 py-1 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
  
        >
          Run Embedding
        </button>
      )}
      {embeddingQuery.data && (
        <div
          className="ml-2 
               px-3 
               py-1 
               text-sm 
               font-medium 
               text-gray-200 
               bg-green-900 
               border-2 
               border-green-800 
               rounded-full 
               dark:bg-green-950 
               dark:text-gray-300"
        >
          embeddings processed
        </div>
      )}

      {embeddingQuery.isLoading && <Spinner />}
      {makeEmbeddingMutation.isPending && <Spinner />}
    </div>
  );
}

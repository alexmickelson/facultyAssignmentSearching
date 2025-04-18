import { useQueries, useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/trpcClient";
import { pipeline, Tensor } from "@huggingface/transformers";
import { useState, useEffect } from "react";

export function Spinner() {
  return (
    <div
      className=" animate-spin  rounded-full  h-5  w-5  border-t-2  border-b-2  border-gray-200"
    ></div>
  );
}

export function SingleFile({ fileName }: { fileName: string }) {
  const trpc = useTRPC();
  const embeddingQuery = useQuery(
    trpc.files.getEmbedding.queryOptions(fileName)
  );
  const embeddingStatus = useCreateEmbedding(
    fileName,
    embeddingQuery.data === null
  );

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
      <div>{embeddingStatus.message}</div>
    </div>
  );
}

function useCreateEmbedding(filePath: string, embeddingIsProcessed: boolean) {
  const [embedding, setEmbedding] = useState<number[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<number[]>();

  const trpc = useTRPC();
  const { data: contentObject } = useQuery(
    trpc.files.getFileContents.queryOptions(filePath)
  );

  useEffect(() => {
    async function generateEmbedding() {
      // if (embeddingIsProcessed) return;
      if (result) return;
      if (isLoading) return;
      if (!contentObject) return;
      console.log("starting embedding");
      setIsLoading(true);
      setError(null);

      try {
        const model = "Xenova/all-MiniLM-L6-v2";
        const pipelineModel = await pipeline("feature-extraction", model  , {
          // device: "webgpu",
        });
        const pipelineResult = await pipelineModel(contentObject.content);
        console.log("feature extraction result", pipelineResult.data);
        setResult(pipelineResult.data);
        // setEmbedding(result[0]); // Assuming the first result is the embedding
      } catch (err) {
        setError((err as Error).message);
        console.error("Error generating embedding:", err);
      } finally {
        setIsLoading(false);
      }
    }

    generateEmbedding();
  }, [filePath, embeddingIsProcessed, contentObject, isLoading]);

  return { embedding, isLoading, error, message };
}

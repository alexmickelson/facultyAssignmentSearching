import { pipeline } from "@huggingface/transformers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/trpcClient";

export const useMakeEmbeddingMutation = () => {
  const trpc = useTRPC();
  const storeMutation = useMutation(
    trpc.files.storeEmbedding.mutationOptions()
  );
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileName,
      fileContents,
    }: {
      fileName: string;
      fileContents: string;
    }) => {
      const embedding = await getEmbeddings({ content: fileContents });
      console.log("got embedding", embedding);
      await storeMutation.mutateAsync({
        fileName,
        fileContents,
        embedding,
      });
    },
    onSuccess: (_, { fileName }) => {
      queryClient.invalidateQueries({
        queryKey: trpc.files.getEmbedding.queryKey(fileName),
      });
    },
  });
};

async function getEmbeddings(contentObject: {
  content: string;
}): Promise<number[]> {
  const model = "Xenova/all-MiniLM-L6-v2";
  const startTime = performance.now();
  const pipelineModel = await pipeline("feature-extraction", model, {
    device: "auto",
  });
  const pipelineResult = await pipelineModel(contentObject.content);
  const endTime = performance.now();
  console.log(
    "feature extraction result",
    pipelineResult.data,
    pipelineResult.dims
  );
  console.log(`Model processing time: ${(endTime - startTime).toFixed(2)} ms`);
  return pipelineResult.data;
}

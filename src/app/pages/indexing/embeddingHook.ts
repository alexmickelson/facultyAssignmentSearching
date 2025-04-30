import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/trpcClient";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { getEmbeddings } from "./embeddingUtils";

export const useMakeEmbeddingMutation = () => {
  const trpc = useTRPC();
  const storeMutation = useMutation(
    trpc.files.storeEmbedding.mutationOptions()
  );
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fileName }: { fileName: string }) => {
      // const embedding = await getEmbeddings({ content: fileContents });
      // console.log("got embedding", embedding, embedding.length);
      await storeMutation.mutateAsync({
        fileName,
      });
    },
    onSuccess: (_, { fileName }) => {
      queryClient.invalidateQueries({
        queryKey: trpc.files.getEmbedding.queryKey(fileName),
      });
    },
  });
};

export const useMakeManyEmbeddingsMutation = () => {
  const trpc = useTRPC();
  const storeMutation = useMutation(
    trpc.files.storeEmbedding.mutationOptions()
  );
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ files }: { files: { fileName: string }[] }) => {
      // for (const { fileName } of files) {
      //   // const embedding = await getEmbeddings({ content: fileContents });
      //   // console.log("got embedding for", fileName, embedding, embedding.length);
      //   await storeMutation.mutateAsync({
      //     fileName,
      //   });

      //   queryClient.invalidateQueries({
      //     queryKey: trpc.files.getEmbedding.queryKey(fileName),
      //     refetchType: "all",
      //   });
      // }
      await Promise.all(
        files.map(async ({ fileName }) => {
          await storeMutation.mutateAsync({
            fileName,
          });
          queryClient.invalidateQueries({
            queryKey: trpc.files.getEmbedding.queryKey(fileName),
            refetchType: "all",
          });
        })
      );
    },
  });
};

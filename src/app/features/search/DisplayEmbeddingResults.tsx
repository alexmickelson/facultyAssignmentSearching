import { useState, type FC } from "react";
import { Spinner } from "../indexing/SingleFile";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/trpcClient";
import { GenerationLayout } from "./assignmentGeneration/GenerationLayout";

export const DisplayEmbeddingResults: FC<{
  embedding: number[];
}> = ({ embedding }) => {
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
  const similarFilesQuery = useGetSimilarFilesQuery({ embedding });

  const toggleFileContent = (fileName: string) => {
    setExpandedFile((prev) => (prev === fileName ? null : fileName));
  };

  return (
    <div className="bg-gray-900 text-white">
      {similarFilesQuery.isLoading && <Spinner />}
      {similarFilesQuery.data && (
        <div>
          {similarFilesQuery.data
            // .sort((a, b) => a.similarity - b.similarity)
            .map((file) => (
              <div
                key={file.fileName}
                className="flex flex-col mb-4 bg-gray-800 text-gray-200 p-4 rounded"
              >
                <div className="flex flex-row items-center">
                  <span className="w-50">{file.similarity}</span>
                  <span className="flex-1">{file.fileName}</span>
                  <button
                    className="ml-2 p-1 bg-blue-700 text-white rounded hover:bg-blue-600"
                    onClick={() => toggleFileContent(file.fileName)}
                  >
                    {expandedFile === file.fileName ? "Hide" : "View"} Contents
                  </button>
                </div>
                {expandedFile === file.fileName && (
                  <div className="mt-2 p-2 border border-gray-600 rounded bg-gray-700 text-gray-300">
                    <pre className="whitespace-pre-wrap">
                      {file.fileContents}
                    </pre>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
      {similarFilesQuery.data && <GenerationLayout similarFiles={similarFilesQuery.data} />}
    </div>
  );
};

export function useGetSimilarFilesQuery({
  embedding,
}: {
  embedding: number[];
}) {
  // force to user post request for large embeddings
  // even though this is gross
  const trpc = useTRPC();
  const mutation = useMutation(trpc.files.getSimilarFiles.mutationOptions());
  return useQuery({
    queryKey: ["query", embedding, trpc.files.getSimilarFiles.mutationKey()],
    queryFn: async () => {
      return await mutation.mutateAsync({ embedding });
    },
  });
}

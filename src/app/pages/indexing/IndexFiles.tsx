import { useQueries, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/trpcClient";
import { SingleFile } from "./SingleFile";
import { useMakeManyEmbeddingsMutation } from "./embeddingHook";

export default function IndexFiles() {
  const trpc = useTRPC();
  const { data: fileNames } = useSuspenseQuery(
    trpc.files.filesList.queryOptions()
  );

  const allFilesQuery = useQueries({
    queries: fileNames.map((fileName) =>
      trpc.files.getFileContents.queryOptions(fileName)
    ),
  });

  const allEmbeddingsMutation = useMakeManyEmbeddingsMutation();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Index Files</h1>
      {allFilesQuery.every((query) => query.isSuccess) && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={() => {
            const fileContents = allFilesQuery.map((query) => query.data);
            allEmbeddingsMutation.mutate({ files: fileContents });
          }}
        >
          Generate All Embeddings
        </button>
      )}
      <section className="list-disc pl-5">
        {fileNames?.map((fileName) => (
          <SingleFile fileName={fileName} key={fileName} />
        ))}
      </section>
      {!fileNames && <div>no files returned</div>}
    </div>
  );
}

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/trpcClient";
import { SingleFile } from "./SingleFile";

export default function IndexFiles() {
  const trpc = useTRPC();
  const { data: fileNames } = useSuspenseQuery(
    trpc.files.filesList.queryOptions()
  );
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Index Files</h1>
      <ul className="list-disc pl-5">
        {fileNames?.map((fileName) => (
          <SingleFile fileName={fileName} key={fileName} />
        ))}
      </ul>
      {!fileNames && <div>no files returned</div>}
    </div>
  );
}



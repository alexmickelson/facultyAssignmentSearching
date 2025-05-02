import { useMutation } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { Spinner } from "~/features/indexing/SingleFile";
import { useTRPC } from "~/trpc/trpcClient";

export const GenerationLayout: FC<{
  similarFiles: {
    fileName: string;
    fileContents: string;
    embedding: number[];
    similarity: number;
  }[];
}> = ({ similarFiles }) => {
  const [prompt, setPrompt] = useState("");
  const [assignmentResult, setAssignmentResult] = useState("");
  const trpc = useTRPC();
  const assignmentMutation = useMutation(
    trpc.assignmetnGeneration.generateAssignment.mutationOptions()
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Generate an assignment with previous files as context
      </h2>
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter your prompt here..."
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        className="mt-4 
           px-4 
           py-2 
           bg-emerald-500 
           text-emerald-50 
           font-semibold 
           rounded-md 
           shadow-md 
           hover:bg-emerald-600 
           focus:outline-none 
           focus:ring-2 
           focus:ring-emerald-400 
           dark:bg-emerald-700 
           dark:hover:bg-emerald-800 
           dark:focus:ring-emerald-600
          "
        onClick={() => {
          assignmentMutation
            .mutateAsync({
              fileNames: similarFiles.map((file) => file.fileName),
              prompt,
            })
            .then((result) => {
              setAssignmentResult(result);
            });
        }}
        disabled={assignmentMutation.isPending}
      >
        Generate Assignment
      </button>
      {assignmentMutation.isPending && <Spinner />}
      {assignmentResult && <pre className="whitespace-pre-wrap break-words">{assignmentResult}</pre>}
    </div>
  );
};

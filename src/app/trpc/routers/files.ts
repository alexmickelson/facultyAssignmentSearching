import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../utils/trpc";
import { readdirSync } from "fs";
import { join } from "path";
import { z } from "zod";
import { readFileSync } from "fs";
import {
  EmbeddingSchema,
  getFileByName,
  insertEmbedding,
} from "~/db/dbService";
export const filesRouter = {
  filesList: publicProcedure.query(() => {
    const directoryPath = "../files";
    const files = getDirectoryStructure(directoryPath);
    return files.filter((f) => f.includes("2024-fall-alex")).splice(0, 1);
  }),
  getFileContents: publicProcedure.input(z.string()).query(({ input }) => {
    try {
      const fileContents = readFileSync(input, "utf-8");
      // console.log("file contents", fileContents);
      return { content: fileContents };
    } catch (error) {
      console.log(error);
      throw new Error(
        `Unable to read file: ${error instanceof Error ? error.message : error}`
      );
    }
  }),
  getEmbedding: publicProcedure.input(z.string()).query(async ({ input }) => {
    const embedding = await getFileByName(input);
    return embedding;
  }),
  storeEmbedding: publicProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileContents: z.string(),
        embedding: z.array(z.number()),
      })
    )
    .mutation(async ({ input: { fileName, fileContents, embedding } }) => {
      await insertEmbedding(fileName, fileContents, embedding);
    }),
} satisfies TRPCRouterRecord;

function getDirectoryStructure(dirPath: string): string[] {
  const entries = readdirSync(dirPath, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = join(dirPath, entry.name);
    if (entry.name === ".git") {
      return []; // Ignore .git folder
    }
    if (entry.isDirectory()) {
      return getDirectoryStructure(fullPath);
    } else {
      return fullPath;
    }
  });
}

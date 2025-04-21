import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../utils/trpc";
import { readdirSync } from "fs";
import { join } from "path";
import { z } from "zod";
import { readFileSync } from "fs";
import {
  EmbeddingSchema,
  getEmbeddingsBySimilarity,
  getFileByName,
  insertEmbedding,
} from "~/db/dbService";
import { getEmbeddings } from "~/pages/indexing/embeeddingUtils";

export const filesRouter = {
  filesList: publicProcedure.query(() => {
    const directoryPath = "../files";
    const files = getDirectoryStructure(directoryPath);
    return files
      .filter(
      (f) =>
        !f.includes("/bin/") &&
        !f.includes("/obj/") &&
        // f.includes("2024-fall-alex") &&
        f.endsWith(".md")
      );
  }),
  getFileContents: publicProcedure.input(z.string()).query(({ input }) => {
    try {
      const fileContents = readFileSync(input, "utf-8");
      // console.log("file contents", fileContents);
      return { fileContents: fileContents, fileName: input };
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
      })
    )
    .mutation(async ({ input: { fileName } }) => {
      const fileContents = readFileSync(fileName, "utf-8");
      const existingEmbedding = await getFileByName(fileName);
      if (existingEmbedding) {
        console.log(`Embedding for file "${fileName}" already exists.`);
        return;
      }
      const embedding = await getEmbeddings({ content: fileContents });
      
      console.log("got embedding", embedding, embedding.length);
      await insertEmbedding(fileName, fileContents, embedding);
    }),
  getSimilarFiles: publicProcedure
    .input(
      z.object({
        embedding: z.array(z.number()),
        limit: z.number().optional(),
      })
    )
    .mutation(async ({ input: { embedding, limit } }) => {
      const embeddings = await getEmbeddingsBySimilarity(embedding, limit);
      return embeddings;
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

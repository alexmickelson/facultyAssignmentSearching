import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../utils/trpc";
import { readdirSync } from "fs";
import { join } from "path";
import { z } from "zod";
import {
  EmbeddingSchema,
  getEmbeddingsBySimilarity,
  getFileByName,
  insertEmbedding,
} from "~/db/dbService";
import { getEmbeddings } from "~/aiUtils";
import { promises as fsPromises } from "fs";

export async function readFileContentsServerOnly(filePath: string): Promise<{
  fileContents: string;
  fileName: string;
}> {
  try {
    const fileContents = await fsPromises.readFile(filePath, "utf-8");
    return { fileContents, fileName: filePath };
  } catch (error) {
    console.log(error);
    throw new Error(
      `Unable to read file: ${error instanceof Error ? error.message : error}`
    );
  }
}

export const filesRouter = {
  filesList: publicProcedure.query(() => {
    const directoryPath = "../files";
    const files = getDirectoryStructure(directoryPath);
    const allFiles = files.filter(
      (f) =>
        !f.includes("/bin/") &&
        !f.includes("/obj/") &&
        !f.includes("node_modules") &&
        // f.includes("2024-fall-alex") &&
        f.endsWith(".md")
    );

    return allFiles.slice(0, 30);
  }),
  getFileContents: publicProcedure.input(z.string()).query(({ input }) => {
    return readFileContentsServerOnly(input);
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
      const { fileContents } = await readFileContentsServerOnly(fileName);

      if (!fileContents) {
        console.log("file contents empty", fileName);
        return;
      }

      const existingEmbedding = await getFileByName(fileName);
      if (existingEmbedding) {
        console.log(`Embedding for file "${fileName}" already exists.`);
        return;
      }
      const embedding = await getEmbeddings({ content: fileContents });

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

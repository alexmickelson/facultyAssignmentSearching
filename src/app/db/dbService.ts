import pgpromise from "pg-promise";
import pgvector from "pgvector/pg-promise";
import { z } from "zod";

// https://github.com/pgvector/pgvector-node?tab=readme-ov-file#pg-promise

const pgp = pgpromise({
  async connect(e) {
    await pgvector.registerTypes(e.client);
  },
});
const db = pgp("postgres://siteuser:postgresewvraer@db:5432/my_db");
// await db.none('CREATE EXTENSION IF NOT EXISTS vector');

// SCHEMA
// CREATE TABLE embeddings (
//   file_name text primary key,
//   file_contents text,
//   embedding vector(768)
// );

export const EmbeddingSchema = z.object({
  fileName: z.string(),
  fileContents: z.string(),
  embedding: z.array(z.number()), // Representing the vector as an array of numbers
});

export type Embedding = z.infer<typeof EmbeddingSchema>;

export async function getFileByName(
  fileName: string
): Promise<Embedding | null> {
  const result = await db.oneOrNone(
    `
    SELECT 
      file_name AS "fileName", 
      file_contents AS "fileContents", 
      embedding AS "embedding" 
    FROM 
      embeddings 
    WHERE 
      file_name = $<fileName>
    `,
    { fileName }
  );

  if (result) {
    return {
      fileName: result.fileName,
      fileContents: result.fileContents,
      embedding: result.embedding,
    };
  }

  return null;
}
export async function insertEmbedding(
  fileName: string,
  fileContents: string,
  embedding: number[]
): Promise<void> {
  console.log("embedding", embedding);
  await db.none(
    `
      INSERT INTO embeddings (file_name, file_contents, embedding)
      VALUES ($<fileName>, $<fileContents>, $<embedding>)
      ON CONFLICT (file_name) 
      DO UPDATE SET 
        file_contents = EXCLUDED.file_contents,
        embedding = EXCLUDED.embedding
    `,
    {
      fileName,
      fileContents,
      embedding,
    }
  );
}

export async function getEmbeddingsBySimilarity(
  queryEmbedding: number[],
  limit: number = 60
): Promise<
  {
    fileName: string;
    fileContents: string;
    embedding: number[];
    similarity: number;
  }[]
> {
  const results = await db.manyOrNone(
    `
    SELECT 
      file_name AS "fileName", 
      file_contents AS "fileContents", 
      embedding AS "embedding",
      1 - (embedding <=> $<queryEmbedding>::vector) AS similarity
    FROM 
      embeddings
    ORDER BY 
      embedding <=> $<queryEmbedding>::vector asc
    LIMIT $<limit>
    `,
    { queryEmbedding, limit }
  );
  return results;
}

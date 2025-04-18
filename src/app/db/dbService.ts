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
//   id bigserial primary key,
//   file_name text,
//   file_contents text,
//   embedding vector(768) --tutorial had (1536) for chatpt
// );
export const EmbeddingSchema = z.object({
  id: z.number(),
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
      id, 
      file_name AS fileName, 
      file_contents AS fileContents, 
      embedding 
    FROM 
      embeddings 
    WHERE 
      file_name = $<fileName>
    `,
    { fileName }
  );

  if (result) {
    return {
      id: result.id,
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
  await db.none(
    `
      INSERT INTO embeddings (file_name, file_contents, embedding)
      VALUES ($<fileName>, $<fileContents>, $<embedding>)
    `,
    {
      fileName,
      fileContents,
      embedding,
    }
  );
}

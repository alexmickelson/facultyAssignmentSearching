import pgpromise from "pg-promise";
import pgvector from "pgvector/pg-promise";

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
export interface Embedding {
  id: number;
  fileName: string;
  fileContents: string;
  embedding: number[]; // Representing the vector as an array of numbers
}
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

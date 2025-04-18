-- psql -U siteuser my_db
Create extension vector;
CREATE EXTENSION IF NOT EXISTS vectorscale CASCADE;

CREATE TABLE embeddings (
  file_name text primary key,
  file_contents text,
  embedding vector(768)
);

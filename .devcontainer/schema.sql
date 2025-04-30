-- psql -U siteuser my_db
Create extension vector;
CREATE EXTENSION IF NOT EXISTS vectorscale CASCADE;


-- in restore
-- CREATE TABLE embeddings (
--   file_name text primary key,
--   file_contents text,
--   embedding vector(768)
-- );

CREATE TABLE embeddings (
  file_name text primary key,
  file_contents text,
  embedding vector(1024)
);

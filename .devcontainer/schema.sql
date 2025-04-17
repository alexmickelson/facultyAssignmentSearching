-- psql -U siteuser my_db
Create extension vector;
CREATE EXTENSION IF NOT EXISTS vectorscale CASCADE;

CREATE TABLE embeddings (
  id bigserial primary key, 
  file_name text,
  file_contents text,
  embedding vector(768) --tutorial had (1536) for chatpt
);

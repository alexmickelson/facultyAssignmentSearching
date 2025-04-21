import { pipeline } from "@huggingface/transformers";

export async function getEmbeddings(contentObject: {
  content: string;
}): Promise<number[]> {
  // const splitter = new CharacterTextSplitter({
  //   chunkSize: 500,
  //   chunkOverlap: 0,
  // });
  // // not needed for chunk size 500
  // const chunks = await splitter.splitText(contentObject.content);
  // console.log("chunks", chunks);
  // const model = "Xenova/all-MiniLM-L6-v2";
  // const model = "Xenova/bert-base-uncased";
  const model = "Xenova/bge-base-en-v1.5"; // 768 dim

  // const model =  'Xenova/all-MiniLM-L6-v2' // very fast
  // const model = "mixedbread-ai/mxbai-embed-large-v1";
  const startTime = performance.now();
  const extractor = await pipeline("feature-extraction", model);
  const pipelineResult = await extractor(contentObject.content, {
    pooling: "mean",
    normalize: true,
  });
  const endTime = performance.now();
  const flattenedResult = pipelineResult.data;
  console.log(
    "feature extraction result",
    flattenedResult,
    pipelineResult.dims,
    pipelineResult.size
  );
  console.log(`Model processing time: ${(endTime - startTime).toFixed(2)} ms`);
  return [...pipelineResult.data];
}

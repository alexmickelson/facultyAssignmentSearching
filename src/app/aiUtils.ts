import { pipeline } from "@huggingface/transformers";

// local version
// export async function getEmbeddings(contentObject: {
//   content: string;
// }): Promise<number[]> {
//   // const splitter = new CharacterTextSplitter({
//   //   chunkSize: 500,
//   //   chunkOverlap: 0,
//   // });
//   // // not needed for chunk size 500
//   // const chunks = await splitter.splitText(contentObject.content);
//   // console.log("chunks", chunks);
//   // const model = "Xenova/all-MiniLM-L6-v2";
//   // const model = "Xenova/bert-base-uncased";
//   const model = "Xenova/bge-base-en-v1.5"; // 768 dim

//   // const model =  'Xenova/all-MiniLM-L6-v2' // very fast
//   // const model = "mixedbread-ai/mxbai-embed-large-v1";
//   const startTime = performance.now();
//   const extractor = await pipeline("feature-extraction", model);
//   const pipelineResult = await extractor(contentObject.content, {
//     pooling: "mean",
//     normalize: true,
//   });
//   const endTime = performance.now();
//   const flattenedResult = pipelineResult.data;
//   console.log(
//     "feature extraction result",
//     flattenedResult,
//     pipelineResult.dims,
//     pipelineResult.size
//   );
//   console.log(`Model processing time: ${(endTime - startTime).toFixed(2)} ms`);
//   return [...pipelineResult.data];
// }

// ollama version

const ollamaUrl = "http://nixos-vm:11434";
const ollamaModel = "mxbai-embed-large";

export async function getEmbeddings(contentObject: {
  content: string;
}): Promise<number[]> {
  const apiUrl = ollamaUrl + "/api/embed";
  const requestBody = {
    model: ollamaModel,
    input: contentObject.content,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch embeddings: ${response.statusText}`);
    }

    const responseData = await response.json();

    if (
      !responseData.embeddings ||
      !Array.isArray(responseData.embeddings[0])
    ) {
      console.log(responseData);
      throw new Error("Invalid response format from embedding API");
    }

    // console.log("embedding",responseData.embeddings[0]);

    return responseData.embeddings[0]; // Return the first embedding array
  } catch (error) {
    console.error("Error fetching embeddings:", error);
    throw error;
  }
}

export async function getAiResponse(prompt: string): Promise<string> {
  // const model = "qwen3:14b";
  const model = "gemma3:12b";
  const url = ollamaUrl + "/api/generate";
  const body = {
    model,
    prompt,
    stream: false,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  // console.log("ollama response", await response.text());
  if (!response.ok) {
    console.log(await response.text());
    throw new Error(
      `Error fetching AI response: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();

  return data.response;
}

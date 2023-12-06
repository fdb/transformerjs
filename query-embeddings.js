import { pipeline } from "@xenova/transformers";
import * as fs from "fs";

const json = JSON.parse(fs.readFileSync("embeddings.json", "utf-8"));
const embeddings = json.embeddings;

const extractor = await pipeline(
  "feature-extraction",
  "Xenova/bge-small-en-v1.5"
);

const query = `Which objects are see-through?`;
const embedding = (
  await extractor(query, {
    pooling: "mean",
    normalize: true,
  })
).tolist()[0];
console.log(embedding);

function cosineSimilarity(a, b) {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Do a cosine similarity between the query embedding and the embeddings in the
// JSON file.
const similarities = [];
embeddings.forEach((object) => {
  const similarity = cosineSimilarity(embedding, object.embedding);
  similarities.push({ similarity, name: object.name });
});

// Sort the similarities by the highest similarity.
similarities.sort((a, b) => b.similarity - a.similarity);

// Print the top 5 results.
console.log(similarities.slice(0, 5));

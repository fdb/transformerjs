import { pipeline } from "@xenova/transformers";
import * as fs from "fs/promises";

const extractor = await pipeline(
  "feature-extraction",
  "Xenova/bge-small-en-v1.5"
);

// const texts = ["Hello world.", "Example sentence."];

//console.log(embeddings);

// const arr = embeddings.tolist()[0];
// const sum = arr.reduce((x, y) => x + y);
// console.log(arr);
// console.log(sum);

const objects = (await fs.readFile("objects.txt", "utf-8")).split("\n");
// console.log(objects);

const embeddings = await extractor(objects, {
  pooling: "mean",
  normalize: true,
});
console.log(embeddings.dims);

const json = { embeddings: [] };
embeddings.tolist().forEach((embedding, index) => {
  json.embeddings.push({ embedding, name: objects[index] });
});

await fs.writeFile("embeddings.json", JSON.stringify(json));

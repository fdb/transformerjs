import { pipeline } from "@xenova/transformers";
import * as fs from "fs/promises";

const extractor = await pipeline(
  "feature-extraction",
  "Xenova/bge-small-en-v1.5"
);

const inputFile = process.argv[2]; // Get the input file from command-line arguments
const outputFile = process.argv[3]; // Get the output file from command-line arguments

if (process.argv.length !== 4) {
  console.error(
    "Please provide both the input file and the output file as command-line arguments."
  );
  process.exit(1);
}

const objects = (await fs.readFile(inputFile, "utf-8")).split("\n");

const embeddings = await extractor(objects, {
  pooling: "mean",
  normalize: true,
});
console.log(embeddings.dims);

const json = { embeddings: [] };
embeddings.tolist().forEach((embedding, index) => {
  json.embeddings.push({ embedding, name: objects[index] });
});

await fs.writeFile(outputFile, JSON.stringify(json));

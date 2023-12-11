import {
  AutoTokenizer,
  AutoProcessor,
  CLIPModel,
  CLIPVisionModelWithProjection,
  RawImage,
} from "https://cdn.jsdelivr.net/npm/@xenova/transformers";

// Load tokenizer, processor, and model
// let tokenizer = await AutoTokenizer.from_pretrained(
//   "Xenova/clip-vit-base-patch16"
// );

const processor = await AutoProcessor.from_pretrained(
  "Xenova/clip-vit-base-patch16"
);
let vision_model = await CLIPVisionModelWithProjection.from_pretrained(
  "Xenova/clip-vit-base-patch16"
);

// Run tokenization
// let texts = ["a photo of a car", "a photo of a football match"];
// let text_inputs = tokenizer(texts, { padding: true, truncation: true });

// Read image and run processor
let image = await RawImage.read(
  "https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/football-match.jpg"
);
let image_inputs = await processor(image);

console.log(image_inputs);

// Run model with both text and pixel inputs
let { image_embeds } = await vision_model(image_inputs);

console.log(image_embeds);

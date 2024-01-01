import {
  readText,
  writeText,
} from "https://deno.land/x/copy_paste@v1.1.3/mod.ts";

// Read from clipboard
let input = await readText();

if (!input) {
  console.error("Please input text");
  Deno.exit(1);
}

// Parse input
input = input.trim();

const lines = input
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line !== "");

const latinTexts = [];
const tralationTexts = [];

for (const [index, line] of lines.entries()) {
  if (index % 2 === 0) {
    latinTexts.push(line);
  } else {
    tralationTexts.push(line);
  }
}

// Merge
const latin = latinTexts.join(" ");
const translation = tralationTexts.join("");

// Write to clipboard
const output = `${latin}\n${translation}`;
console.log(output);

await writeText(output);

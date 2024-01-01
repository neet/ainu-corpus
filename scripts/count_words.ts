const baseDir = "./corpora/アイヌ語アーカイブ/";

async function* listFiles() {
  for await (const directory of Deno.readDir(baseDir)) {
    yield baseDir + directory.name + "/content.txt";
  }
}

function filterAinuText(text: string) {
  let result = "";

  text = text.trim();
  const lines = text.split("\n").filter((line) => line !== "");

  for (const [index, line] of lines.entries()) {
    if (index % 2 !== 0) {
      continue;
    }

    result += line;
  }

  return result;
}

async function countWords() {
  let count = 0;

  for await (const file of listFiles()) {
    const text = await Deno.readTextFile(file);
    const ainuText = filterAinuText(text);
    count += ainuText.split(" ").length;
  }

  return count;
}

const count = await countWords();
console.log(`${count} words in total`);

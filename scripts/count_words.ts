async function* listFiles() {
  const ainugo = "./corpora/アイヌ語アーカイブ/";
  for await (const directory of Deno.readDir(ainugo)) {
    yield ainugo + directory.name + "/content.txt";
  }

  const aaKen = "./corpora/AA研アイヌ語資料/";
  for await (const directory of Deno.readDir(aaKen)) {
    yield aaKen + directory.name + "/content.txt";
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

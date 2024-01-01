const affixes = [
  "eci=",
  "ku=",
  "kuy=",
  "ci=",
  "ay=",
  "en=",
  "un=",
  "e=",
  "ey=",
  "ecien=",
  "eciun=",
  "ecii=",
  "i=",
  "aen=",
  "aun=",
  "ae=",
  "a=",
  "=as",
  "=an",
  // 樺太、十勝、静内、石狩川
  "an=",
  "’=an",
  "’=as",
  "'=an",
  "'=as",
];

async function* listFiles() {
  const ainugo = "./corpora/アイヌ語アーカイブ/";
  for await (const directory of Deno.readDir(ainugo)) {
    yield ainugo + directory.name + "/content.txt";
  }

  const aaKen = "./corpora/AA研アイヌ語資料/";
  for await (const directory of Deno.readDir(aaKen)) {
    yield aaKen + directory.name + "/content.txt";
  }

  const corpus = "./corpora/アイヌ語口承文芸コーパス/";
  for await (const directory of Deno.readDir(corpus)) {
    yield corpus + directory.name + "/content.txt";
  }
}

function filterAinuText(text: string) {
  let result = "";

  text = text.trim();
  const lines = text.split("\n").filter((line) => line !== "");

  for (let [index, line] of lines.entries()) {
    if (index % 2 !== 0) {
      continue;
    }

    line = line.replaceAll("”", "");
    line = line.replaceAll("“", "");
    line = line.replaceAll('"', "");
    result += " " + line;
  }

  return result;
}

function normalizeWord(word: string) {
  word = word.replaceAll("_", "");
  word = word.replaceAll(",", "");
  word = word.replaceAll(".", "");
  word = word.replaceAll("?", "");
  word = word.replaceAll("!", "");

  word = word.replaceAll("`", "'");
  word = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  for (const affix of affixes) {
    word = word.replaceAll(affix, "");
    // 人称接辞を消した結果 glottal stop だけ残るとき
    if (word.startsWith("'")) word = word.slice(1);
    if (word.startsWith("‘")) word = word.slice(1);
    if (word.endsWith("'")) word = word.slice(0, -1);
    if (word.endsWith("’")) word = word.slice(0, -1);
  }

  return word;
}

async function countWords() {
  const wordMap = new Map<string, number>();

  for await (const file of listFiles()) {
    const text = await Deno.readTextFile(file);
    const ainuText = filterAinuText(text);
    const words = ainuText.split(" ");

    for (const _word of words) {
      const word = normalizeWord(_word);

      if (wordMap.has(word)) {
        wordMap.set(word, wordMap.get(word)! + 1);
      } else {
        wordMap.set(word, 1);
      }
    }
  }

  return wordMap;
}

const wordMap = await countWords();
const sorted = new Map([...wordMap.entries()].sort((a, b) => b[1] - a[1]));
const record = [...sorted.entries()]
  .filter((entry) => entry[0] !== "")
  .map((entry) => ({ word: entry[0], count: entry[1] }))
  .filter((entry) => entry.count > 30);

console.table(record);

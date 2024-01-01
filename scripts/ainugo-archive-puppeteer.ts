import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

type Asset = {
  type: string;
  source: string;
  id: string;
  title: string;
  url: string;
};

const readData = async () => {
  const data = await Deno.readTextFile("./data.tsv");
  const lines = data.split("\n");
  const assets: Asset[] = [];

  for (const line of lines) {
    const [type, source, id, title, url] = line.split("\t");
    assets.push({ type, source, id, title, url });
  }

  return assets;
};

//

const browser = await puppeteer.launch();
const page = await browser.newPage();
const assets = await readData();

for (const asset of assets) {
  if (asset.source !== "アイヌ語アーカイブ") continue;

  console.log(`Downloading ${asset.id}...`);

  await page.goto(asset.url);
  await page.waitForSelector("#scrollText table tbody");

  const rows = await page.$$("#scrollText table tbody tr");
  let text = "";

  for (const row of rows) {
    const latinChunk = await row
      .$eval(".latin", (el) => el.textContent)
      .catch(() => "");

    const translationChunk = await row
      .$eval(".jap", (el) => el.textContent)
      .catch(() => "");

    if (translationChunk === "") {
      continue;
    }

    text += `${latinChunk}\n${translationChunk}\n\n`;
  }

  await Deno.mkdir(`./corpora/${asset.source}/${asset.title}`, {
    recursive: true,
  });

  await Deno.writeTextFile(
    `./corpora/${asset.source}/${asset.title}/content.txt`,
    text
  );
}

await page.close();
await browser.close();

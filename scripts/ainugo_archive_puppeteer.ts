import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { readData } from "./asset_read.ts";
import { Asset } from "./asset.ts";

const handleAinguoArchive = async (asset: Asset) => {
  await page.goto(asset.url);
  await page.waitForSelector("#scrollText table tbody");

  const rows = await page.$$("#scrollText table tbody tr");
  let text = "";

  for (const row of rows) {
    const latin = await row
      .$eval(".latin", (el) => el.textContent)
      .catch(() => "");

    const translation = await row
      .$eval(".jap", (el) => el.textContent)
      .catch(() => "");

    if (translation === "") {
      continue;
    }

    text += `${latin}\n${translation}\n\n`;
  }

  return text;
};

const handleAAKen = async (asset: Asset) => {
  await page.goto(asset.url);
  await page.waitForSelector("#sctn_app_main .row_block");
  const blocks = await page.$$("#sctn_app_main .row_block");
  let text = "";

  for (const block of blocks) {
    const texts = await block.$$eval("div", (nodes) =>
      nodes.map((node) => node.textContent)
    );
    const ainuIndex = texts.findIndex((text: string) =>
      text.match(/[a-zA-Z]+/)
    );

    if (ainuIndex === -1) {
      continue;
    }

    const latin = texts.at(ainuIndex);
    const translation = texts.at(ainuIndex + 1);

    text += `${latin}\n${translation}\n\n`;
  }

  return text;
};

//

const browser = await puppeteer.launch({
  headless: false,
});
const page = await browser.newPage();
const assets = await readData();

for (const asset of assets) {
  console.log(`Downloading ${asset.id} from ${asset.source}...`);
  if (asset.source === "アイヌ語アーカイブ") continue;

  let text = "";
  switch (asset.source) {
    case "アイヌ語アーカイブ":
      text = await handleAinguoArchive(asset);
      break;
    case "AA研アイヌ語資料":
      try {
        text = await handleAAKen(asset);
        break;
      } catch (e) {
        console.log(e);
        continue;
      }
    default:
      continue;
  }

  await Deno.mkdir(asset.dir, { recursive: true });
  await Deno.writeTextFile(asset.contentPath, text);
}

await page.close();
await browser.close();

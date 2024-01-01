import { Asset } from "./asset.ts";

export const readData = async () => {
  const data = await Deno.readTextFile("./data.tsv");
  const lines = data.split("\n");
  const assets: Asset[] = [];

  for (const line of lines) {
    const [type, source, id, title, url] = line.split("\t");
    assets.push(new Asset({ type, source, id, title, url }));
  }

  return assets;
};

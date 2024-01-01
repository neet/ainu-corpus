import { readData } from "./asset_read.ts";

const data = await readData();

for (const asset of data) {
  if (asset.source !== "アイヌ語口承文芸コーパス") {
    continue;
  }

  await Deno.mkdir(asset.dir, { recursive: true });
  await Deno.writeTextFile(asset.contentPath, "");
}

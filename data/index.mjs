import fs from "fs/promises";

const f = async () => {
  const file = JSON.parse(await fs.readFile("./coins.json", "utf8")).slice(100);

  const result = file.map((c) => ({
    key: c.name.toLocaleLowerCase(),
    value: c.id,
    metadata: c,
  }));

  fs.writeFile("./coins-kv.json", JSON.stringify(result, null, 2));

  for (const coin of result) {
    fs.writeFile(
      `../.wrangler/state/kv/COINS_KV/${encodeURIComponent(coin.key)}`,
      coin.value
    );

    fs.writeFile(
      `../.wrangler/state/kv/COINS_KV/${encodeURIComponent(
        coin.key
      )}.meta.json`,
      JSON.stringify(coin)
    );
  }
};

f();

import { ActionFunction } from "@remix-run/cloudflare";
import { isVs, Price, Prices, Vs } from "app/types";

export const action: ActionFunction = async ({ request, context }) => {
  try {
    const prices = await request.json<Record<string, unknown>>();

    validatePrices(prices);

    const sub = context.JWT.payload.sub;

    await context.PRICES_KV.put(`${sub}-latest`, JSON.stringify(prices));
    return prices;
  } catch (error) {
    if (error instanceof Error) new Response(error.message, { status: 322 });
    return new Response("unknown error", { status: 322 });
  }
};

function validatePrices<T extends Vs>(
  prices: Record<string, unknown>
): asserts prices is Prices<T> {
  if (Object.keys(prices).length !== 2) {
    throw new Error("more keys than expected in prices");
  }

  validateCoinsProperty(prices);
  validateVsProperty(prices);
  validateCoins(prices.coins, prices.vs);
}

function validateCoins(
  obj: Record<string, unknown>,
  vs: Vs
): asserts obj is Prices<Vs>["coins"] {
  if (
    Object.values(obj).every((x) => {
      return isPrice(x, vs);
    })
  )
    throw new Error("coins is in wrong format");
}

function validateCoinsProperty<T extends Record<string, unknown>>(
  obj: T
): asserts obj is T & { coins: Record<string, unknown> } {
  if ("coins" in obj && isRecord(obj["coins"])) {
    return;
  }

  throw new Error(`no coins of type record in object`);
}

function validateVsProperty<T extends Record<string, unknown>>(
  obj: T
): asserts obj is T & { vs: Vs } {
  if ("vs" in obj && typeof obj["vs"] === "string" && isVs(obj["vs"])) {
    return;
  }

  throw new Error(`no vs of type string in object`);
}

const isRecord = (obj: unknown): obj is Record<string, unknown> =>
  typeof obj === "object" && obj !== null;

const isPrice = <T extends Vs>(obj: unknown, vs: T): obj is Price<T> => {
  const marketCap = `${vs}_market_cap`;
  const vol24 = `${vs}_24_vol`;
  const change24 = `${vs}_24_change`;
  const lastUpdated = "last_updated_at";

  const properties = [vs, marketCap, vol24, change24, lastUpdated];

  return (
    isRecord(obj) &&
    properties.every((p) => {
      if (!(p in obj)) return false;
      const value = obj[p];
      return typeof value === "number" && !isNaN(value) && isFinite(value);
    }) &&
    Object.keys(obj).length === properties.length
  );
};

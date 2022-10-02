import { Vs, Prices } from "app/types";
import { SerializedPoint } from "portfolio";

export const sumTotal = <T extends Vs>(
  prices: Prices<T>,
  portfolio: SerializedPoint
) => {
  return portfolio.list.reduce(
    (acc, c) => getValuedAt(prices, c.id) * c.amount + acc,
    0
  );
};

export const getValuedAt = <T extends Vs>(rates: Prices<T>, id: string) =>
  rates.coins[id]?.[rates.vs] ?? 0;

export const getPrice = <T extends Vs>(
  rates: Prices<T>,
  id: string
): {
  value: number;
  change24h: number;
  vol24h: number;
  marketCap: number;
  lastUpdatedAt: number;
} => {
  const price = rates.coins[id];

  return {
    value: price?.[rates.vs] ?? NaN,
    change24h: price?.[`${rates.vs}_24h_change`] ?? NaN,
    vol24h: price?.[`${rates.vs}_24h_vol`] ?? NaN,
    marketCap: price?.[`${rates.vs}_market_cap`] ?? NaN,
    lastUpdatedAt: price?.last_updated_at ?? 0,
  };
};

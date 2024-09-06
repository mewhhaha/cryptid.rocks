import { Vs, Prices } from "app/types";
import { Portfolio } from "./db.server";

export const sumTotal = <T extends Vs>(
  prices: Prices<T>,
  portfolio: Portfolio[],
) => {
  return portfolio.reduce(
    (acc, c) => getValuedAt(prices, c.id) * c.amount + acc,
    0,
  );
};

export const sumChange24h = <T extends Vs>(
  prices: Prices<T>,
  portfolio: Portfolio[],
) => {
  const now = sumTotal(prices, portfolio);
  const before = portfolio.reduce((acc, c) => {
    const { change24h, value } = getPrice(prices, c.id);
    return (value / change24h) * c.amount + acc;
  }, 0);
  return now / before;
};

export const getValuedAt = <T extends Vs>(prices: Prices<T>, id: string) =>
  prices.coins[id]?.[prices.vs] ?? 0;

export const getPrice = <T extends Vs>(
  prices: Prices<T>,
  id: string,
): {
  value: number;
  change24h: number;
  vol24h: number;
  marketCap: number;
  lastUpdatedAt: number;
} => {
  const price = prices.coins[id];

  return {
    value: price?.[prices.vs] ?? NaN,
    change24h: price?.[`${prices.vs}_24h_change`] ?? NaN,
    vol24h: price?.[`${prices.vs}_24h_vol`] ?? NaN,
    marketCap: price?.[`${prices.vs}_market_cap`] ?? NaN,
    lastUpdatedAt: price?.last_updated_at ?? 0,
  };
};

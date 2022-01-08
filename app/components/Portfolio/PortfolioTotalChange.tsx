import React from "react";
import { PortfolioCoin } from "portfolio-worker";
import { PortfolioValueChange } from "./PortfolioValueChange";
import { usePrice } from "~/contexts/price";

type PortfolioTotalChangeProps = {
  portfolio: PortfolioCoin[];
};

export const PortfolioTotalChange: React.VFC<PortfolioTotalChangeProps> = ({
  portfolio: coins,
}) => {
  const price = usePrice();

  const lookupQuantity: Record<string, number> = {};
  coins.forEach((c) => {
    lookupQuantity[c.id] = c.quantity;
  });

  switch (price) {
    case undefined:
      return <div className="w-full h-12 rounded-xl bg-gray animate-pulse" />;
    default: {
      const total = Object.entries(price).reduce(
        (curr, [id, next]) => next.sek * lookupQuantity[id] + curr,
        0
      );
      const yesterdayTotal = Object.entries(price).reduce(
        (curr, [id, next]) =>
          next.sek *
            lookupQuantity[id] *
            (1 - (next.sek_24h_change ?? 0) / 100) +
          curr,
        0
      );
      const change = (total / yesterdayTotal) * 100 - 100;
      return <PortfolioValueChange change={change} />;
    }
  }
};

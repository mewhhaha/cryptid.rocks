import { useSimplePriceQuery } from "~/queries";
import { PortfolioCoin } from "~/types";
import React from "react";
import { PortfolioValueChange } from "./PortfolioValueChange";

type PortfolioTotalChangeProps = {
  portfolio: PortfolioCoin[];
};

export const PortfolioTotalChange: React.VFC<PortfolioTotalChangeProps> = ({
  portfolio: coins,
}) => {
  const { data } = useSimplePriceQuery(
    coins.map((c) => c.id),
    "sek"
  );

  const lookupQuantity: Record<string, number> = {};
  coins.forEach((c) => {
    lookupQuantity[c.id] = c.quantity;
  });

  switch (data) {
    case undefined:
      return <span className="w-full rounded-xl bg-gray animate-pulse" />;
    default: {
      const total = Object.entries(data).reduce(
        (curr, [id, next]) => next.sek * lookupQuantity[id] + curr,
        0
      );
      const yesterdayTotal = Object.entries(data).reduce(
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

import React from "react";
import { PortfolioValue } from "./PortfolioValue";
import { PortfolioCoin } from "portfolio-worker";
import { usePrice } from "~/contexts/price";

type PortfolioTotalValueProps = {
  portfolio: PortfolioCoin[];
};

export const PortfolioTotalValue: React.VFC<PortfolioTotalValueProps> = ({
  portfolio: coins,
}) => {
  const price = usePrice();

  const lookupQuantity: Record<string, number> = {};
  coins.forEach((c) => {
    lookupQuantity[c.id] = c.quantity;
  });

  switch (price) {
    case undefined:
      return <div className="invisible w-full h-full sr-only">?</div>;
    default: {
      const total = Object.entries(price).reduce(
        (curr, [id, next]) => next.sek * lookupQuantity[id] + curr,
        0
      );
      return <PortfolioValue total={total} />;
    }
  }
};

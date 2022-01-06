import { useSimplePriceQuery } from "~/queries";
import { PortfolioCoin } from "~/types";
import React from "react";
import { PortfolioValue } from "./PortfolioValue";

type PortfolioTotalValueProps = {
  portfolio: PortfolioCoin[];
};

export const PortfolioTotalValue: React.VFC<PortfolioTotalValueProps> = ({
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
      return <PortfolioValue total={total} />;
    }
  }
};

import React, { useEffect } from "react";
import { useSimplePriceQuery } from "~/queries";
import { PortfolioValue } from "./PortfolioValue";
import { PortfolioCoin } from "portfolio-worker";

type PortfolioTotalValueProps = {
  portfolio: PortfolioCoin[];
};

export const PortfolioTotalValue: React.VFC<PortfolioTotalValueProps> = ({
  portfolio: coins,
}) => {
  const { data, mutate } = useSimplePriceQuery(
    coins.map((c) => c.id),
    "sek"
  );

  useEffect(() => {
    mutate();
  }, [coins, mutate]);

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

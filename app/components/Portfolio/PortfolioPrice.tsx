import React from "react";
import { PortfolioCurrencyChip } from "./PortfolioCurrencyChip";

type PortfolioPriceProps = {
  price: number;
};

export const PortfolioPrice: React.VFC<PortfolioPriceProps> = ({ price }) => {
  return (
    <div>
      <span>{price}</span>
      <PortfolioCurrencyChip currency="SEK" />
    </div>
  );
};

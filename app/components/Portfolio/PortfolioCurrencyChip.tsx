import React from "react";

type PortfolioCurrencyChipProps = {
  currency: "SEK";
};

export const PortfolioCurrencyChip: React.VFC<PortfolioCurrencyChipProps> = ({
  currency,
}) => {
  return (
    <span className="px-2 mx-2 text-gray-600 border rounded-full">
      {currency}
    </span>
  );
};

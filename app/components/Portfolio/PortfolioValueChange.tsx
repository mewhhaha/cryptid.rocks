import { ArrowSmUpIcon, ArrowSmDownIcon } from "@heroicons/react/solid";
import React from "react";

const format = (n: number) => (isNaN(n) ? "?" : n.toFixed(3));

type PortfolioValueChangeProps = {
  change: number;
};

export const PortfolioValueChange: React.VFC<PortfolioValueChangeProps> = ({
  change,
}) => {
  if (change < 0) {
    return (
      <span className="flex justify-center flex-none w-32 px-3 text-yellow-800 bg-red-100 rounded-full">
        <ArrowSmDownIcon className="self-center w-5 h-5" />
        {`${format(Math.abs(change))}%`}
      </span>
    );
  } else {
    return (
      <span className="flex justify-center flex-none w-32 px-3 text-green-600 bg-green-100 rounded-full">
        <ArrowSmUpIcon className="self-center w-5 h-5" />
        {`${format(change)}%`}
      </span>
    );
  }
};

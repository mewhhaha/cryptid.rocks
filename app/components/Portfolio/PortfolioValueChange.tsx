import { ArrowSmUpIcon, ArrowSmDownIcon } from "@heroicons/react/solid";
import React from "react";

type PortfolioValueChangeProps = {
  change: number;
};

export const PortfolioValueChange: React.VFC<PortfolioValueChangeProps> = ({
  change,
}) => {
  if (change < 0) {
    return (
      <div className="flex justify-center flex-none w-32 px-3 text-yellow-800 bg-red-100 rounded-full">
        <ArrowSmDownIcon className="self-center w-5 h-5" />
        {`${Math.abs(change).toFixed(3)}%`}
      </div>
    );
  } else {
    return (
      <div className="flex justify-center flex-none w-32 px-3 text-green-600 bg-green-100 rounded-full">
        <ArrowSmUpIcon className="self-center w-5 h-5" />
        {`${change.toFixed(3)}%`}
      </div>
    );
  }
};

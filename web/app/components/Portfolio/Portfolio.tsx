import React from "react";
import cn from "classnames";
import { Setter } from "~/types";
import { PortfolioCoin } from "portfolio-worker";
import { useSimplePriceQuery } from "~/queries";
import { PortfolioTotalChange } from "./PortfolioTotalChange";
import { PortfolioTotalValue } from "./PortfolioTotalValue";
import { PortfolioValueChange } from "./PortfolioValueChange";
import { PortfolioCoinEntryMenu } from "./PortfolioCoinEntryMenu";
import { PortfolioQuantityInput } from "./PortfolioQuantityInput";
import { PortfolioValue } from "./PortfolioValue";
import { PortfolioPrice } from "./PortfolioPrice";

type PortfolioTotalEntryProps = {
  portfolio: PortfolioCoin[];
};

const PortfolioTotalEntry: React.VFC<PortfolioTotalEntryProps> = ({
  portfolio,
}) => {
  return (
    <li className="grid grid-cols-2 pb-6">
      <dl className="flex flex-col items-center border-t border-yellow-200">
        <dt className="font-semibold">Total value</dt>
        <dd>
          <PortfolioTotalValue portfolio={portfolio} />
        </dd>
      </dl>
      <dl className="flex flex-col items-center border-t border-yellow-200">
        <dt className="font-semibold">Total change</dt>
        <dd>
          <PortfolioTotalChange portfolio={portfolio} />
        </dd>
      </dl>
    </li>
  );
};

type PortfolioCoinEntryProps = {
  coin: PortfolioCoin;
  setEntry: (entry: Partial<PortfolioCoin>) => void;
  deleteEntry: () => void;
};

const PortfolioCoinEntry: React.VFC<PortfolioCoinEntryProps> = ({
  coin,
  coin: { id, name, quantity },
  setEntry,
  deleteEntry,
}) => {
  const { data } = useSimplePriceQuery(id, "sek");

  return (
    <li className="flex flex-col w-full max-w-3xl rounded-b shadow-md">
      <div className="flex h-full px-2 border-b border-l border-yellow-200 shadow-md bg-gradient-to-r from-yellow-200 to-yellow-100 col-span-full">
        <label className="flex items-center font-bold text-blue-400 hover:text-blue-500 focus:outline-none focus-visible:ring focus-visible:text-blue-300">
          <a
            href={`https://www.coingecko.com/en/coins/${id}`}
            target="_blank"
            rel="noreferrer"
          >
            {name}
          </a>
        </label>
        <div className="flex-grow h-1" />
        <div className="relative">
          <PortfolioCoinEntryMenu onDelete={deleteEntry} coin={coin} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4 py-3 sm:grid-cols-3 md:grid-cols-4">
        <dl className="flex flex-col px-4">
          <dt className="font-semibold text-gray-500">Quantity</dt>
          <dl className="flex items-center h-full">
            <PortfolioQuantityInput coin={coin} setEntry={setEntry} />
          </dl>
        </dl>
        <dl className="flex flex-col px-4">
          <dt className="font-semibold text-gray-500">Price</dt>
          <dd className="flex items-center h-full">
            {data ? (
              <PortfolioPrice price={data[id].sek} />
            ) : (
              <span className="w-full rounded-xl bg-gray animate-pulse" />
            )}
          </dd>
        </dl>
        <dl className="flex flex-col px-4">
          <dt className="font-semibold text-gray-500">Value</dt>
          <dd className="flex items-center h-full">
            {data ? (
              <PortfolioValue total={data[id].sek * quantity} />
            ) : (
              <span className="w-full rounded-xl bg-gray animate-pulse" />
            )}
          </dd>
        </dl>
        <dl className="flex flex-col px-4">
          <dt className="font-semibold text-gray-500">Change</dt>
          <dd className="flex items-center h-full">
            {data ? (
              <PortfolioValueChange change={data[id].sek_24h_change ?? 0} />
            ) : (
              <span className="w-full rounded-xl bg-gray animate-pulse" />
            )}
          </dd>
        </dl>
      </div>
    </li>
  );
};

type PortfolioProps = {
  portfolio: PortfolioCoin[];
  setPortfolio: Setter<PortfolioCoin[]>;
};

export const Portfolio: React.VFC<PortfolioProps> = ({
  portfolio,
  setPortfolio,
}) => {
  return (
    <div
      className={cn("flex flex-col flex-grow items-center", {
        hidden: portfolio.length === 0,
      })}
    >
      <ul className="w-full max-w-3xl py-2 mt-10 space-y-4">
        <PortfolioTotalEntry portfolio={portfolio} />
        {portfolio.map((coin) => {
          const handleSetEntry = (entry: Partial<PortfolioCoin>) => {
            setPortfolio((prev) => ({
              ...prev,
              updatedAt: new Date(),
              coins: prev.map((x) =>
                x.id === coin.id ? { ...x, ...entry } : x
              ),
            }));
          };

          const handleDeleteEntry = () => {
            setPortfolio((prev) => prev.filter((x) => x.id !== coin.id));
          };

          return (
            <PortfolioCoinEntry
              key={coin.id}
              coin={coin}
              setEntry={handleSetEntry}
              deleteEntry={handleDeleteEntry}
            />
          );
        })}
      </ul>
    </div>
  );
};

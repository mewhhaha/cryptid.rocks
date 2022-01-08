import React, { useCallback, useEffect, useState } from "react";
import {
  Combobox,
  useComboboxState,
  ComboboxPopover,
  ComboboxItem,
} from "ariakit/combobox";
import coinList from "~/data/coins.json";
import cn from "classnames";
import { CoinInfo } from "portfolio-worker";
import { usePortfolio } from "~/contexts/portfolio";

type CoinListQuery = CoinInfo[];

const createCoinDictionary = () => {
  const dictionary: Record<string, CoinInfo[]> = {};

  coinList.forEach((coin) => {
    const symbols = new Set([
      ...coin.symbol.toLocaleLowerCase(),
      ...coin.name.toLocaleLowerCase(),
    ]);
    symbols.forEach((s) => {
      dictionary[s] = dictionary[s] ?? [];
      dictionary[s].push(coin);
    });
  });

  return dictionary;
};

const fullWidth = { className: "w-full" };
const coinDictionary = createCoinDictionary();
const coinListSize = 20;

const useCoinList = (query: string) => {
  const [list, setList] = useState<CoinListQuery>(() =>
    coinList.slice(0, coinListSize)
  );
  const setTruncatedList = useCallback(
    (list: CoinInfo[]) => setList(list.slice(0, coinListSize)),
    []
  );

  useEffect(() => {
    if (query === "") {
      setTruncatedList(coinList);
      return;
    }

    const lowerCaseQuery = query.toLocaleLowerCase();
    const match = (str: string) =>
      str.toLocaleLowerCase().match(lowerCaseQuery);
    const bySymbolThenName = (a: CoinInfo, b: CoinInfo) => {
      const queryIndexOf = (str: string) => str.indexOf(lowerCaseQuery);
      const compare = (field: "name" | "symbol") => {
        const fieldA = a[field].toLocaleLowerCase();
        const fieldB = b[field].toLocaleLowerCase();
        const indexA = queryIndexOf(fieldA);
        const indexB = queryIndexOf(fieldB);
        if (indexA === -1 && indexB !== -1) return 1;
        if (indexA !== -1 && indexB === -1) return -1;
        if (indexA !== -1 && indexB !== -1) {
          if (indexA === indexB) return fieldA < fieldB ? -1 : 1;
          return indexA < indexB ? -1 : 1;
        }
      };

      const symbolComparison = compare("symbol");
      if (symbolComparison !== undefined) return symbolComparison;

      const nameComparison = compare("name");
      if (nameComparison !== undefined) return nameComparison;

      return 0;
    };

    const timeout = setTimeout(() => {
      const lookup = coinDictionary[query[0].toLocaleLowerCase()] ?? [];
      const filteredList = lookup
        .filter((coin) => [coin.id, coin.name, coin.symbol].some(match))
        .sort(bySymbolThenName);
      setTruncatedList(filteredList);
    }, 50);

    return () => {
      clearTimeout(timeout);
    };
  }, [query, setTruncatedList]);

  return list;
};

export const Searchbox: React.VFC = () => {
  const { mutate } = usePortfolio();

  const combobox = useComboboxState();
  const coinList = useCoinList(combobox.value);

  return (
    <div className="relative w-full max-w-2xl mt-1">
      <Combobox
        className="w-full px-8 py-2 text-xl text-left bg-white rounded-full shadow-md outline-none cursor-default sm:text-2xl focus:ring-2 focus:ring-opacity-75 focus:ring-blue-400 focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500"
        state={combobox}
        placeholder="Search for crypto to add"
      />

      <div className="flex">
        <ComboboxPopover
          state={combobox}
          wrapperProps={fullWidth}
          className="relative w-full max-w-2xl py-1 mt-4 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          {coinList.length === 0 ? (
            <div className="w-full px-4 py-2">No results</div>
          ) : (
            coinList.map((coin) => {
              const active = coin.name === combobox.activeValue;

              const handleOnClick = () => {
                mutate((portfolio) => {
                  if (portfolio.find((x) => x.id === coin.id)) return portfolio;
                  return [...portfolio, { ...coin, quantity: 0 }];
                });
                combobox.setValue("");
              };

              return (
                <ComboboxItem
                  key={coin.name}
                  onClick={handleOnClick}
                  className={cn(
                    active ? "text-yellow-900 bg-yellow-100" : "text-gray-900",
                    "cursor-default select-none relative py-2 px-4 hover:bg-gray-200 w-full"
                  )}
                  value={coin.name}
                >
                  <div className="flex w-full">
                    <span className="flex-grow min-w-0 truncate">
                      {coin.name}
                    </span>
                    <span
                      className={cn(
                        active ? "text-yellow-600" : "text-gray-400",
                        "self-end text-right items-center pr-3"
                      )}
                    >
                      {coin.symbol.toLocaleUpperCase()}
                    </span>
                  </div>
                </ComboboxItem>
              );
            })
          )}
        </ComboboxPopover>
      </div>
    </div>
  );
};

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import {
  Combobox,
  ComboboxInput,
  useComboboxContext,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import coinList from "~/data/coins.json";
import cn from "classnames";
import { Setter } from "~/types";
import { CoinInfo, PortfolioCoin } from "portfolio-worker";

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

const createCoinLookup = () => {
  const lookup: Record<string, CoinInfo> = {};

  coinList.forEach((coin) => {
    lookup[coin.name] = coin;
  });

  return lookup;
};

const coinDictionary = createCoinDictionary();
const coinLookup = createCoinLookup();
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

const isVisible = (el: HTMLElement, container: HTMLElement) => {
  const elTop = el.offsetTop;
  const elBottom = elTop + el.clientHeight;

  const containerTop = container.scrollTop;
  const containerBottom = containerTop + container.clientHeight;

  return (
    (elTop >= containerTop && elBottom <= containerBottom) ||
    (elTop < containerTop && containerTop < elBottom) ||
    (elTop < containerBottom && containerBottom < elBottom)
  );
};

type SearchboxContentProps = {
  coinList: CoinInfo[];
  search: string;
  setSearch: Setter<string>;
};

const SearchboxContent: React.VFC<SearchboxContentProps> = ({
  coinList,
  search,
  setSearch,
}) => {
  const { navigationValue } = useComboboxContext();
  const [focus, setFocus] = useState(false);

  const activeRef = useRef<HTMLLIElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (
      !activeRef.current ||
      !listRef.current ||
      isVisible(activeRef.current, listRef.current)
    )
      return;

    const el = activeRef.current;
    const container = listRef.current;
    const isAbove = el.offsetTop + el.clientHeight <= container.scrollTop;
    activeRef.current.scrollIntoView(isAbove);
  }, [navigationValue]);

  return (
    <div className="relative mt-1">
      <ComboboxInput
        className="relative w-full px-8 py-2 text-xl text-left bg-white rounded-full shadow-md outline-none cursor-default sm:text-2xl focus:ring-2 focus:ring-opacity-75 focus:ring-blue-400 focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500"
        value={search}
        placeholder="Search for crypto to add"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(e) => setSearch(() => e.target.value)}
      />

      <Transition
        show={focus}
        as="div"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ComboboxPopover>
          <ComboboxList
            ref={listRef}
            className="absolute w-full py-1 mt-4 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {coinList.length === 0 ? (
              <li className="px-4 py-2">No results</li>
            ) : (
              coinList.map((coin, index) => {
                const active = coin.name === navigationValue;
                return (
                  <ComboboxOption
                    key={index}
                    ref={active ? activeRef : undefined}
                    className={cn(
                      active
                        ? "text-yellow-900 bg-yellow-100"
                        : "text-gray-900",
                      "cursor-default select-none relative py-2 px-4 hover:bg-gray-200"
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
                  </ComboboxOption>
                );
              })
            )}
          </ComboboxList>
        </ComboboxPopover>
      </Transition>
    </div>
  );
};

type SearchboxProps = {
  setPortfolio: Setter<PortfolioCoin[]>;
};

export const Searchbox: React.VFC<SearchboxProps> = ({ setPortfolio }) => {
  const [search, setSearch] = useState("");
  const coinList = useCoinList(search);

  const handleSelect = (coinName: string) => {
    const coin = coinLookup[coinName];
    setPortfolio((portfolio) => {
      if (portfolio.find((x) => x.id === coin.id)) return portfolio;
      return [...portfolio, { ...coin, quantity: 0 }];
    });
    setSearch("");
  };
  return (
    <Combobox as="div" className="w-full max-w-xl" onSelect={handleSelect}>
      <SearchboxContent
        coinList={coinList}
        search={search}
        setSearch={setSearch}
      />
    </Combobox>
  );
};

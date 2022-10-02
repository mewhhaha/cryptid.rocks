import { escapeRegex } from "app/helpers";
import { Coin } from "app/types";
import { useState, useEffect, useId } from "react";
import { Input, InputProps } from "../atoms/Input";

export type CoinInputProps = InputProps;

export const CoinInput = (props: CoinInputProps) => {
  const listId = useId();

  const { coins, query, setQuery } = useCoins();
  const coin = coins.find((c) => c.name === query);

  return (
    <>
      <Input
        {...props}
        list={listId}
        pattern={coin ? `^${escapeRegex(coin.name)}$` : "^[]"}
        onChange={(event) => {
          setQuery(event.currentTarget.value);
        }}
        onInvalid={(event) => {
          event.currentTarget.setCustomValidity("Pick coin from list");
        }}
      />
      <datalist id={listId}>
        {coins.map((c) => {
          return (
            <option value={c.name} key={c.id}>
              {c.symbol}
            </option>
          );
        })}
      </datalist>
    </>
  );
};

const useCoins = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const f = async () => {
      const searchParams = new URLSearchParams({
        search: query.toLocaleLowerCase(),
      });
      const response = await fetch(`/api/coins?${searchParams.toString()}`, {
        signal: controller.signal,
      });
      const coins: Coin[] = await response.json();
      setCoins(coins);
    };

    f();

    return () => {
      controller.abort();
    };
  }, [query]);

  return { coins, query, setQuery };
};

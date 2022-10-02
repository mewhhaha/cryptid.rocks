import {
  Link,
  Outlet,
  ShouldReloadFunction,
  useLoaderData,
} from "@remix-run/react";
import { cx, sumTotal, withAbort, formatAmount } from "app/helpers";
import { useAppear } from "app/hooks";
import {
  ArrowLeftOnRectangleIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import S3600 from "../images/splash_3600.jpg";
import S1800 from "../images/splash_1800.jpg";
import S900 from "../images/splash_900.jpg";
import S450 from "../images/splash_450.jpg";
import S225 from "../images/splash_225.jpg";
import { Amount, isVs, Prices, validVs, Vs } from "app/types";
import { LoaderFunction } from "@remix-run/cloudflare";
import { Fragment, useEffect, useMemo, useState } from "react";
import { SerializedPoint } from "portfolio";
import Coingecko from "../images/coingecko.svg";
import { loadPortfolio } from "app/helpers/loader.server";

type LoaderData = {
  portfolio: SerializedPoint;
  amount: Amount;
  prices: Prices<Vs>;
};

export type OutletData<T extends Vs> = {
  portfolio: SerializedPoint;
  amount: Amount;
  prices: Prices<T>;
};

export const loader: LoaderFunction = async ({
  request,
  context,
}): Promise<LoaderData> => {
  const sub = context.JWT.payload.sub;
  const cachedPrices = await context.PRICES_KV.get<Prices<Vs>>(
    `${sub}-latest`,
    "json"
  );
  const defaultPrices: Prices<Vs> = { coins: {}, vs: "usd" };
  const prices = cachedPrices ?? defaultPrices;

  const portfolio = await loadPortfolio(sub, request, context);

  const amount = { value: sumTotal(prices, portfolio), vs: prices.vs };

  return { amount, portfolio, prices };
};

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) =>
  submission !== undefined;

export default function Page<T extends Vs>() {
  const {
    amount: defaultAmount,
    portfolio,
    prices: defaultPrices,
  } = useLoaderData<LoaderData>();

  const [amount, setAmount] = useState(defaultAmount);
  const [vs, setVs] = useState(defaultPrices.vs);

  const prices = usePrices<T>(vs as T, portfolio, defaultPrices as Prices<T>);

  useEffect(() => {
    if (prices === undefined) return;
    const amount = {
      value: sumTotal(prices, portfolio),
      vs: prices?.vs,
      updatedAt: new Date().toISOString(),
    };
    setAmount(amount);
  }, [portfolio, prices]);

  useEffect(() => {
    if (prices === undefined) return;

    return withAbort((signal) => {
      fetch("/api/sync-prices", {
        method: "post",
        body: JSON.stringify(prices),
        signal,
      });
    });
  }, [prices]);

  const formattedAmount = formatAmount(amount.value, amount.vs);

  return (
    <>
      <div className="sticky -top-[20.5rem] z-10 flex h-96 w-full flex-none items-center justify-center overflow-hidden">
        <img
          srcSet={`${S225} 225w, ${S450} 450w, ${S900} 900w, ${S1800} 1800w, ${S3600} 3600w`}
          src={S225}
          className="absolute inset-0 h-full w-full object-cover"
          alt="nebula with tiny astronaut and tiny rocket"
        />
        <AmountTitle key={formattedAmount} text={formattedAmount} />
      </div>
      <header className="sticky top-0 left-0 right-0 z-10 -mt-14 flex h-14 flex-none items-end justify-between bg-transparent px-4 py-2 text-white shadow-md backdrop-blur-sm">
        <h1 className="text-3xl">
          <span className="hidden sm:inline">🍌</span>
          <span className="font-bold">Cryptid</span>{" "}
          <span className="hidden text-gray-200 sm:inline">portfolio</span>
        </h1>

        <div className="flex space-x-6">
          <SelectVs value={amount.vs} onChange={setVs} />
          <HeaderNav to="/coins/new" icon={<PlusCircleIcon />}>
            Add coin
          </HeaderNav>
          <HeaderNav to="/auth/logout" icon={<ArrowLeftOnRectangleIcon />}>
            Logout
          </HeaderNav>
        </div>
      </header>
      <main className="relative flex flex-grow flex-col">
        <Outlet
          context={useMemo(
            (): OutletData<T> => ({ amount, portfolio, prices }),
            [amount, portfolio, prices]
          )}
        />
      </main>

      <footer className="bg-slate-800">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <div className="flex items-center">
              Powered by{" "}
              <img
                src={Coingecko}
                alt="coingecko"
                className="mr-1 ml-2 h-8 w-8"
              />{" "}
              Coingecko
            </div>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-base text-gray-400">
              &copy; 2020 Jacob Torrång. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

type AmountTitleProps = {
  text: string;
};
const AmountTitle = ({ text }: AmountTitleProps) => {
  const characters = text.split("");

  return (
    <span className="relative z-10 rounded-xl bg-black/10 px-4 text-center text-6xl font-bold backdrop-blur-[1px] sm:text-7xl lg:text-9xl">
      {characters.map((d, i) => {
        if (isDigit(d)) {
          return <DigitAppear key={i} digit={d} />;
        } else {
          const charCode = d.charCodeAt(0);
          return (
            <Fragment key={i}>
              <LetterAppear letter={d} />
              {charCode === 32 ||
                (charCode === 160 && <br className="sm:hidden" />)}
            </Fragment>
          );
        }
      })}
    </span>
  );
};

type SelectVsProps = {
  value: Vs;
  onChange: (vs: Vs) => void;
};

const SelectVs = ({ onChange, value }: SelectVsProps) => {
  return (
    <select
      className="rounded-md bg-white/30 px-2 font-bold text-white"
      value={value}
      onChange={(event) => {
        const value = event.currentTarget.value;
        if (isVs(value)) {
          onChange(value);
        }
      }}
    >
      {validVs.map((v) => {
        return (
          <option key={v} value={v} className="text-black">
            {v.toUpperCase()}
          </option>
        );
      })}
    </select>
  );
};

type HeaderNavProps = {
  to: string;
  icon: React.ReactNode;
  children: string;
};

const HeaderNav = ({ to, icon, children }: HeaderNavProps) => {
  return (
    <button>
      <Link
        tabIndex={-1}
        to={to}
        replace
        className="flex transform items-center transition-transform hover:scale-105 hover:text-orange-400"
      >
        <span className="mr-1 inline h-6 w-6">{icon}</span>
        <span className="hidden sm:inline">{children}</span>
      </Link>
    </button>
  );
};

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type DigitAppearProps = {
  digit: Digit;
};

const DigitAppear = ({ digit }: DigitAppearProps) => {
  const appear = useAppear();

  const digits = [...new Array(10).keys()];

  const i = Number.parseInt(digit) + 1;
  const reordered = digits.slice(i).concat(digits.slice(0, i));

  return (
    <div
      className={cx(
        "relative inline-block overflow-hidden transition-[filter,opacity] duration-[2400ms] ease-out",
        appear ? "opacity-100 blur-none" : "opacity-0 blur-xl"
      )}
    >
      <div className="invisible" aria-hidden={true}>
        0
      </div>
      <div
        className={cx(
          "absolute inset-0 flex transform flex-col transition-transform duration-[2400ms] ease-out",
          appear ? "-translate-y-[900%]" : "translate-y-0"
        )}
      >
        {reordered.map((n) => {
          const inactive = digit !== n.toString();
          return (
            <span
              key={n}
              aria-hidden={inactive}
              className={cx(inactive && "select-none")}
            >
              {n}
            </span>
          );
        })}
      </div>
    </div>
  );
};

type WordAppearProps = {
  letter: string;
};

const LetterAppear = ({ letter }: WordAppearProps) => {
  const appear = useAppear();

  return (
    <div
      className={cx(
        "relative inline-block overflow-hidden transition-[filter,opacity] duration-[2400ms] ease-out",
        appear ? "opacity-100 blur-none" : "opacity-0 blur-xl"
      )}
    >
      <div className="invisible" aria-hidden={true}>
        {letter}
      </div>
      <div
        className={cx(
          "absolute inset-0 transform transition-transform duration-[2400ms] ease-out",
          appear ? "translate-y-0" : "translate-y-full"
        )}
      >
        {letter}
      </div>
    </div>
  );
};

const usePrices = <T extends Vs>(
  vs: T,
  portfolio: SerializedPoint,
  defaultPrices: Prices<T>
) => {
  const [prices, setPrices] = useState<Prices<T>>(defaultPrices);

  useEffect(() => {
    return withAbort(async (signal) => {
      const url = new URL("https://api.coingecko.com/api/v3/simple/price");
      const ids = portfolio.list.map((c) => c.id).join();

      url.searchParams.set("ids", ids);
      url.searchParams.set("vs_currencies", vs);
      url.searchParams.set("include_24hr_vol", "true");
      url.searchParams.set("include_24hr_change", "true");
      url.searchParams.set("include_last_updated_at", "true");
      url.searchParams.set("include_market_cap", "true");

      const response = await fetch(url, { signal });
      const coins: Prices<T>["coins"] = await response.json();

      setPrices({ vs, coins });
    });
  }, [portfolio, vs]);

  return prices;
};

const digits = new Set([...new Array(10).keys()].map((k) => k.toString()));
const isDigit = (s: string): s is Digit => {
  return digits.has(s);
};

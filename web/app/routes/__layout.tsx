import { Link, Outlet, useLoaderData, useSubmit } from "@remix-run/react";
import { cx } from "app/helpers/cx";
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
import { Amount } from "app/types";
import { LoaderFunction } from "@remix-run/cloudflare";
import { useEffect, useState } from "react";
import { SerializedPoint } from "portfolio";
import { isVs, validVs, Vs } from "../data/vs";
import { call, client } from "ditty";
import { makeAmountFormData } from "./api/amount";

type Rates<T extends Vs> = {
  vs: T;
  coins: Record<string, { [key in T]: number }>;
};

type LoaderData = {
  portfolio: SerializedPoint;
  amount: Amount;
};

export type OutletData = LoaderData;

const mockedList = [
  { id: "polkadot", name: "Polkadot", symbol: "dot", amount: 845 },
  { id: "nano", name: "Nano", symbol: "xno", amount: 4776 },
  { id: "ethereum", name: "Ethereum", symbol: "eth", amount: 1.7114 },
  { id: "moonbeam", name: "Moonbeam", symbol: "glmr", amount: 201.1747 },
  { id: "matic-network", name: "Polygon", symbol: "matic", amount: 13173 },
  { id: "adex", name: "Ambire AdEx", symbol: "adx", amount: 15870 },
];

export const loader: LoaderFunction = async ({
  request,
  context,
}): Promise<LoaderData> => {
  if (process.env.NODE_ENV !== "production") {
    const now = new Date().toISOString();
    return {
      portfolio: {
        updatedAt: now,
        list: mockedList.map((p) => ({ ...p, updatedAt: now })),
      },
      amount: {
        value: 70000,
        vs: "usd",
        updatedAt: now,
      },
    };
  }
  const sub = context.JWT.payload.sub;
  const p = client(request, context.PORTFOLIO_DO, sub);
  const portfolio = await call(p, "latest");

  const amount = await context.AMOUNT_KV.get<Amount>(`${sub}-latest`, "json");

  if (amount === null) {
    return {
      portfolio,
      amount: { value: 0, vs: "usd", updatedAt: new Date().toISOString() },
    };
  }

  return { amount, portfolio };
};

export default function Page() {
  const data = useLoaderData<LoaderData>();
  const { amount: defaultAmount, portfolio } = data;

  const [amount, setAmount] = useState(defaultAmount);
  const [vs, setVs] = useState(amount.vs);

  const rates = useRates(vs, portfolio);
  const submit = useSubmit();

  useEffect(() => {
    if (rates === undefined) return;
    const amount = {
      value: sumTotal(rates, portfolio),
      vs: rates?.vs,
      updatedAt: new Date().toISOString(),
    };
    setAmount(amount);
    const formData = makeAmountFormData(amount);

    const controller = new AbortController();

    const f = async () => {
      const response = await fetch("/api/amount", {
        method: "post",
        body: formData,
      });
      await response.json<Amount>();
    };

    f();

    return () => {
      controller.abort();
    };
  }, [portfolio, rates, submit]);

  const formattedAmount = formatAmount(amount.value, amount.vs);

  return (
    <section className="flex flex-col text-white">
      <div className="sticky -top-[20.5rem] flex h-96 w-full items-center justify-center overflow-hidden">
        <img
          srcSet={`${S225} 225w, ${S450} 450w, ${S900} 900w, ${S1800} 1800w, ${S3600} 3600w`}
          src={S225}
          className="absolute inset-0 h-full w-full object-cover"
          alt="nebula with tiny astronaut and tiny rocket"
        />
        <AmountTitle key={formattedAmount} text={formattedAmount} />
      </div>
      <header className="from to sticky top-0 left-0 right-0 -mt-14 flex h-14 items-end justify-between bg-transparent px-4 py-2 text-white shadow-md backdrop-blur-sm">
        <h1 className="text-3xl">
          🍌<span className="font-bold">Cryptid</span>{" "}
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
      <main className="flex-grow bg-slate-600">
        <Outlet context={data} />
      </main>
    </section>
  );
}

type AmountTitleProps = {
  text: string;
};
const AmountTitle = ({ text }: AmountTitleProps) => {
  const characters = text.split("");

  return (
    <span className="relative z-10 text-center text-6xl font-bold sm:text-7xl lg:text-9xl">
      {characters.map((d, i) => {
        if (isDigit(d)) {
          return <DigitAppear key={i} digit={d} />;
        } else {
          const charCode = d.charCodeAt(0);
          return (
            <>
              <LetterAppear key={i} letter={d} />
              {charCode === 32 ||
                (charCode === 160 && <br className="sm:hidden" />)}
            </>
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
      className="rounded-md bg-white/90 px-2 font-bold text-black"
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
          <option key={v} value={v}>
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

const useRates = <T extends Vs>(vs: T, portfolio: SerializedPoint) => {
  const [rates, setRates] = useState<Rates<T>>();

  useEffect(() => {
    const controller = new AbortController();
    const f = async () => {
      const url = new URL("https://api.coingecko.com/api/v3/simple/price");
      const ids = portfolio.list.map((c) => c.id).join();

      url.searchParams.set("ids", ids);
      url.searchParams.set("vs_currencies", vs);

      const response = await fetch(url, { signal: controller.signal });
      const coins: Record<string, { [key in T]: number }> =
        await response.json();

      setRates({ vs, coins });
    };

    f();

    return () => {
      controller.abort();
    };
  }, [portfolio, vs]);

  return rates;
};

const formatAmount = (n: number, vs: Vs) => {
  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: vs,
    minimumFractionDigits: 0,
  });
  return formatter.format(Math.floor(n));
};

const sumTotal = <T extends Vs>(
  rates: Rates<T>,
  portfolio: SerializedPoint
) => {
  return portfolio.list.reduce(
    (acc, c) => rates.coins[c.id][rates.vs] * c.amount + acc,
    0
  );
};

const digits = new Set([...new Array(10).keys()].map((k) => k.toString()));
const isDigit = (s: string): s is Digit => {
  return digits.has(s);
};

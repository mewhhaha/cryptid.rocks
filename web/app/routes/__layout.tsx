import { Link, Outlet } from "@remix-run/react";
import { cx } from "app/helpers/cx";
import { useAppear } from "app/hooks";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import Splash from "../images/splash.png";

const backgroundImage = { backgroundImage: `url("${Splash}")` };

export default function Page() {
  const amount = 700000;
  const digits = parseDigits(amount);
  const currency = parseLetters("USD");

  return (
    <section className="flex flex-col text-white">
      <div
        style={backgroundImage}
        className="flex h-72 w-full items-center justify-center bg-cover bg-center"
      >
        <span className="text-center text-6xl font-bold sm:text-7xl lg:text-9xl">
          {digits.map((d, i) => {
            return <DigitAppear key={i} digit={d} />;
          })}{" "}
          <div className="inline-block whitespace-nowrap">
            {currency.map((w, i) => {
              return <WordAppear key={i} word={w} />;
            })}
          </div>
        </span>
      </div>
      <header
        className="sticky top-0 left-0 right-0 flex items-end justify-between bg-slate-700 bg-cover bg-bottom px-4 py-2 shadow-md"
        style={backgroundImage}
      >
        <h1 className="text-3xl font-bold">🍌Cryptid</h1>

        <Link to="/auth/logout">
          <span>
            <ArrowLeftOnRectangleIcon />
            Logout
          </span>
        </Link>
      </header>
      <main className="flex-grow bg-slate-600">
        <Outlet />
      </main>
    </section>
  );
}

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

const parseDigits = (n: number) =>
  Math.floor(n).toString().split("") as Digit[];

const parseLetters = (s: string) => s.split("");

type WordAppearProps = {
  word: string;
};

const WordAppear = ({ word }: WordAppearProps) => {
  const appear = useAppear();

  return (
    <div
      className={cx(
        "relative inline-block overflow-hidden transition-[filter,opacity] duration-[2400ms] ease-out",
        appear ? "opacity-100 blur-none" : "opacity-0 blur-xl"
      )}
    >
      <div className="invisible" aria-hidden={true}>
        O
      </div>
      <div
        className={cx(
          "absolute inset-0 transform transition-transform duration-[2400ms] ease-out",
          appear ? "translate-y-0" : "translate-y-full"
        )}
      >
        {word}
      </div>
    </div>
  );
};

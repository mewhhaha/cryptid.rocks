import { CurrencyYenIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { Link, Outlet, useOutletContext } from "@remix-run/react";
import { ChartPortfolio, ChartPriceHistory } from "app/components";
import { PointStarsBackground } from "app/components/PointStarsSvg";
import { cx, formatAmount, formatPercentage, getPrice } from "app/helpers";
import { Vs } from "app/types";
import { OutletData } from "../__layout";

export default function Page<T extends Vs>() {
  const { prices, portfolio } = useOutletContext<OutletData<T>>();

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center p-4">
      <Outlet />

      <PointStarsBackground className="pointer-events-none absolute inset-0" />
      <div
        className={cx(
          "absolute inset-0 transform bg-gradient-to-r from-black to-black/0"
        )}
      />

      {portfolio.list.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {Object.keys(prices.coins).length > 0 && (
            <div className="relative h-96 w-full max-w-4xl rounded-md bg-black/70">
              <span className="hidden sm:inline">
                <ChartPortfolio
                  prices={prices}
                  portfolio={portfolio}
                  direction="horizontal"
                />
              </span>
              <span className="sm:hidden">
                <ChartPortfolio
                  prices={prices}
                  portfolio={portfolio}
                  direction="vertical"
                />
              </span>
            </div>
          )}

          <ul className="relative mb-12 w-full max-w-4xl space-y-10">
            {portfolio.list.map((c) => {
              const { value, change24h } = getPrice(prices, c.id);

              return (
                <li key={c.id}>
                  <section>
                    <h1 className="mb-4 text-6xl font-bold">
                      {c.name}{" "}
                      <span
                        className={cx(
                          "block whitespace-nowrap text-base sm:inline",
                          change24h > 0 ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {`24h ${formatPercentage(change24h / 100, true)}`}
                      </span>
                    </h1>

                    <div className="rounded-md bg-black shadow-md">
                      <div className="rounded-md border bg-gradient-to-r from-blue-600/50 via-orange-600/10 to-transparent p-4 text-2xl">
                        Your{" "}
                        <Tag className="text-green-300">
                          {c.amount} {c.symbol}
                        </Tag>{" "}
                        is valued at{" "}
                        <Tag className="text-blue-300">
                          {formatAmount(value, prices.vs, 2)}
                        </Tag>
                        . The total value comes out to{" "}
                        <Tag className="text-red-300">
                          {formatAmount(c.amount * value, prices.vs)}
                        </Tag>
                        .
                        <div className="h-96 w-full">
                          <ChartPriceHistory coin={c} vs={prices.vs} />
                        </div>
                      </div>
                    </div>
                  </section>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

type TagProps = {
  children: React.ReactNode;
  className?: string;
};

const Tag = ({ children, className }: TagProps) => {
  return (
    <span
      className={cx(
        "rounded-md border bg-black px-1 text-xl font-bold",
        className
      )}
    >
      {children}
    </span>
  );
};

const EmptyState = () => {
  return (
    <div className="relative rounded-md border bg-black/80 py-4 px-12 text-center">
      <PlusCircleIcon className="mx-auto h-12 w-12 text-gray-100" />

      <h3 className="mt-2 text-sm font-medium text-gray-100">
        This portfolio is empty
      </h3>
      <p className="mt-1 text-sm text-gray-300">
        Get started by adding a coin.
      </p>
      <div className="mt-6">
        <Link to="/coins/new">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <CurrencyYenIcon
              className="-ml-1 mr-2 h-5 w-5"
              aria-hidden="true"
            />
            Add coin
          </button>
        </Link>
      </div>
    </div>
  );
};

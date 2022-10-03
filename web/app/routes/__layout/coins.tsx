import {
  ArrowTopRightOnSquareIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { CurrencyYenIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { Link, Outlet, useOutletContext } from "@remix-run/react";
import { ChartPortfolio, Menu } from "app/components";
import { PointStarsBackground } from "app/components/PointStarsSvg";
import { cx, formatAmount, formatPercentage, getPrice } from "app/helpers";
import { useAppear } from "app/hooks";
import { Vs } from "app/types";
import { OutletData } from "../__layout";

export default function CoinOptions<T extends Vs>() {
  const { prices, portfolio } = useOutletContext<OutletData<T>>();

  const sortedAscending = portfolio.list
    .map(
      (c) =>
        [
          c.name,
          formatAmount(c.amount, prices.vs),
          getPrice(prices, c.id).change24h,
        ] as const
    )
    .sort(([, , a], [, , b]) => a - b);

  const lowest = sortedAscending[0];
  const highest = sortedAscending[sortedAscending.length - 1];
  const appear = useAppear();

  return (
    <div className="relative flex flex-grow flex-col items-center justify-center p-4">
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
        <div className="w-full max-w-4xl">
          <div
            className={cx(
              "relative grid w-full gap-6",
              highest[0] === lowest[0] ? "grid-cols-1" : "grid-cols-2"
            )}
          >
            <TrendingTag
              name={highest[0]}
              value={highest[1]}
              percentage={highest[2] / 100}
            />
            {highest[0] !== lowest[0] && (
              <TrendingTag
                name={lowest[0]}
                value={lowest[1]}
                percentage={lowest[2] / 100}
              />
            )}
          </div>

          {Object.keys(prices.coins).length > 0 && (
            <div
              className={cx(
                "relative h-96 w-full rounded-md bg-black/70 transition-[filter] duration-300 ease-in-out",
                appear ? "blur-none" : "blur-lg"
              )}
            >
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

          <ul className="relative mb-12 w-full divide-y">
            {portfolio.list.map((c) => {
              const { change24h } = getPrice(prices, c.id);

              return (
                <li key={c.id}>
                  <section className="pt-2 pb-4">
                    <div className="flex items-center space-x-2">
                      <div className="group">
                        <Menu
                          button={
                            <div className="rounded-md p-1 text-orange-200 hover:bg-white/10 hover:text-orange-100 group-focus-within:bg-white/10">
                              <EllipsisVerticalIcon
                                aria-hidden="true"
                                className="block h-5 w-5"
                              />
                            </div>
                          }
                        >
                          <Link tabIndex={-1} to={`/coins/${c.id}/edit`}>
                            <Menu.Item icon={<PencilIcon />}>Edit</Menu.Item>
                          </Link>
                          <Link tabIndex={-1} to={`/coins/${c.id}/delete`}>
                            <Menu.Item icon={<TrashIcon />}>Delete</Menu.Item>
                          </Link>
                          <a
                            tabIndex={-1}
                            href={`https://www.coingecko.com/en/coins/${c.id}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Menu.Item icon={<ArrowTopRightOnSquareIcon />}>
                              Coingecko
                            </Menu.Item>
                          </a>
                        </Menu>
                      </div>
                      <div className="grid w-full grid-cols-3 gap-4 ">
                        <h1 className="my-auto text-base font-bold sm:text-xl lg:text-3xl">
                          {c.name}
                        </h1>
                        <div className="my-auto text-base sm:text-lg lg:text-2xl">
                          {`${c.amount} ${c.symbol}`}
                        </div>
                        <div
                          className={cx(
                            "my-auto text-base sm:text-lg lg:text-2xl",
                            change24h < 0 ? "text-pink-600" : "text-green-600"
                          )}
                        >
                          24h
                          <span className="inline-block h-5 w-5 text-base">
                            {change24h < 0 ? (
                              <ArrowTrendingDownIcon />
                            ) : (
                              <ArrowTrendingUpIcon />
                            )}
                          </span>
                          {formatPercentage(change24h / 100, true)}
                        </div>
                      </div>
                    </div>
                  </section>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

type TrendingTagProps = {
  name: string;
  value: string;
  percentage: number;
};

const TrendingTag = ({ name, value, percentage }: TrendingTagProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border bg-black px-4 py-2 sm:flex-row sm:items-end">
      <span className="mr-2 text-base text-white sm:text-xl md:text-2xl">
        {name}
      </span>
      <span className="mr-2 hidden text-base font-bold sm:text-xl md:text-2xl lg:inline">
        {value}
      </span>
      <span
        className={cx(
          "flex min-w-0 flex-wrap text-base sm:text-lg md:text-xl",
          percentage < 0 ? "text-pink-600" : "text-green-600"
        )}
      >
        <div>
          24h
          <span className="inline-block h-5 w-5">
            {percentage < 0 ? (
              <ArrowTrendingDownIcon />
            ) : (
              <ArrowTrendingUpIcon />
            )}
          </span>
        </div>
        <div>{formatPercentage(percentage)}</div>
      </span>
    </div>
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
        <Link to="/coins/new" replace>
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

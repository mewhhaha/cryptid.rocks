import { CurrencyYenIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { Link, Outlet, useOutletContext } from "@remix-run/react";
import { PointStarsBackground } from "app/components/PointStarsSvg";
import { Vs } from "app/data/vs";
import { cx, formatAmount } from "app/helpers";
import { OutletData } from "../__layout";

export default function Page<T extends Vs>() {
  const {
    rates,
    portfolio: { list },
  } = useOutletContext<OutletData<T>>();

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center p-4">
      <Outlet />

      <PointStarsBackground className="pointer-events-none absolute inset-0" />
      <div
        className={cx(
          "absolute inset-0 transform bg-gradient-to-r from-black to-black/0"
        )}
      />

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="relative w-full space-y-4">
          {list.map((c) => {
            const rate = rates?.coins[c.id][rates.vs];
            return (
              <li
                key={c.id}
                className="flex w-full flex-wrap rounded-md border p-4"
              >
                <div className="flex w-96 items-center">
                  <h1 className="text-6xl font-bold">{c.name}</h1>
                </div>
                <dl className="grid grid-rows-2 gap-4">
                  <dt className="text-gray-400">Last updated</dt>
                  <dd>{formatter.format(new Date(c.updatedAt))}</dd>
                  <dt className="text-gray-400">Symbol</dt>
                  <dd>{c.symbol}</dd>
                </dl>
                <dl className="grid grid-rows-2 gap-4">
                  <dt className="text-gray-400">Amount</dt>
                  <dd>{c.amount}</dd>
                  <dt className="text-gray-400">Per</dt>
                  <dd>{rate ? formatAmount(rate, rates.vs) : "loading"}</dd>
                  <dt className="text-gray-400">Value</dt>
                  <dd>
                    {rate ? formatAmount(c.amount * rate, rates.vs) : "loading"}
                  </dd>
                </dl>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

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

const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

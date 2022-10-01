import { Outlet, useOutletContext } from "@remix-run/react";
import Coingecko from "../../images/coingecko.svg";
import { OutletData } from "../__layout";

export default function Page() {
  const {
    portfolio: { list },
  } = useOutletContext<OutletData>();

  return (
    <div className="flex flex-col justify-center p-4">
      <Outlet />
      <div className="flex items-center">
        Powered by{" "}
        <img src={Coingecko} alt="coingecko" className="mr-1 ml-2 h-8 w-8" />{" "}
        Coingecko
      </div>

      <ul className="space-y-4">
        {list.map((c) => {
          return (
            <li key={c.id} className="grid grid-cols-3 rounded-md border p-4">
              <div className="flex items-center">
                <h1 className="text-6xl font-bold">{c.name}</h1>
              </div>
              <dl className="grid grid-rows-2 gap-4">
                <dt className="text-gray-400">Last updated</dt>
                <dd>{formatter.format(new Date(c.updatedAt))}</dd>
                <dt>Symbol</dt>
                <dd>{c.symbol}</dd>
              </dl>
              <dl className="grid grid-rows-2 gap-4">
                <dt>Amount</dt>
                <dd>{c.amount}</dd>
              </dl>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

import { LoaderFunction } from "@remix-run/cloudflare";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { call, client } from "ditty";
import type { SerializedPoint } from "portfolio";
import Coingecko from "../../images/coingecko.svg";

type LoaderData = { portfolio: SerializedPoint };

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
    };
  }

  const sub = context.JWT.payload.sub;
  const p = client(request, context.PORTFOLIO_DO, sub);
  const portfolio = await call(p, "latest");

  return { portfolio };
};

export default function Page() {
  const {
    portfolio: { list },
  } = useLoaderData<LoaderData>();

  return (
    <div className="flex flex-col justify-center p-4">
      <Outlet />
      <div className="flex items-center">
        Powered by{" "}
        <img src={Coingecko} alt="coingecko" className="mr-1 ml-2 h-8 w-8" />{" "}
        Coingecko
      </div>
      <button>
        <Link to="/coins/new">add coin</Link>
      </button>
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

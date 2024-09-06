import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import {
  Form,
  ShouldRevalidateFunction,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { type } from "arktype";
import { useState, useEffect } from "react";
import { Field } from "~/components/atoms/Field";
import { Input } from "~/components/atoms/Input";
import { Modal } from "~/components/molecules/Modal";
import { authenticate } from "~/helpers/auth.server";
import { Table } from "~/helpers/db.server";
import { escapeRegex } from "~/helpers/regex";
import { Coin } from "~/types";

const parseFormData = type({
  amount: "string.numeric.parse >= 0",
  coinId: "string",
});

export const action = async ({
  request,
  context: { cloudflare: cf },
}: ActionFunctionArgs) => {
  const user = await authenticate(cf, request);

  const formData = parseFormData(
    Object.fromEntries((await request.formData()).entries()),
  );
  if (formData instanceof type.errors) {
    return new Response(formData.summary, { status: 422 });
  }

  const date = new Date().toISOString();

  const coin = await cf.env.DB.prepare("SELECT * FROM coins WHERE id = ?")
    .bind(formData.coinId)
    .first<Table["coins"]>();

  if (!coin) {
    return new Response("Coin not found", { status: 404 });
  }

  const increment = cf.env.DB.prepare(
    "UPDATE portfolio SET order = order + 1 WHERE user_id = ?",
  ).bind(user.id);

  const values = (n: number) => new Array(n).fill("?");

  const id = crypto.randomUUID();
  const insert = cf.env.DB.prepare(
    `
INSERT INTO portfolio 
(id, priority, amount, coin_id, symbol, name, user_id, created_at, updated_at) 
VALUES 
(${values(9).join(", ")})`,
  ).bind(
    id,
    0,
    formData.amount,
    coin.id,
    coin.symbol,
    coin.name,
    user.id,
    date,
    date,
  );

  const result = await cf.env.DB.batch([increment, insert]);

  if (!result.every((r) => r.success)) {
    return new Response("missing metadata", { status: 422 });
  }

  throw redirect("/coins");
};

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

export default function Page() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const { coins, query, setQuery } = useCoins();
  const onClose = () => navigate("/coins", { replace: true });

  const currentCoin = coins.find((c) => c.name === query);

  return (
    <Modal title="Pick a coin to add" onClose={onClose}>
      <Form
        method="post"
        onChange={(event) => {
          const formData = new FormData(event.currentTarget);
          const coin = formData.get("coin")?.toString() ?? "";
          const amount = formData.get("amount")?.toString() ?? "0";
          setParams({ coin, amount }, { replace: true });
        }}
      >
        <div className="mt-2 space-y-2">
          <p className="text-sm text-gray-500">
            Fill in the form to add a new coin to your portfolio.
          </p>
          <Field title="Coin" htmlFor="coin">
            <Input
              required
              list="coin-data-list"
              pattern={
                currentCoin ? `^${escapeRegex(currentCoin.name)}$` : "^[]"
              }
              onChange={(event) => {
                setQuery(event.currentTarget.value);
              }}
              onInvalid={(event) => {
                event.currentTarget.setCustomValidity("Pick coin from list");
              }}
              defaultValue={params.get("coin") ?? ""}
            />
            <datalist id="coin-data-list">
              {coins.map((c) => {
                return (
                  <option value={c.name} key={c.id}>
                    {c.symbol}
                  </option>
                );
              })}
            </datalist>
          </Field>

          <Field title="Amount" htmlFor="amount">
            <Input
              id="amount"
              required
              type="number"
              step="0.000001"
              name="amount"
              defaultValue={params.get("amount") ?? 0}
              min={0}
            />
          </Field>

          <input name="coin" type="hidden" value={currentCoin?.id} />
          <input name="name" type="hidden" value={currentCoin?.name} />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-orange-100 px-4 py-2 text-sm font-medium text-orange-900 hover:bg-orange-200"
          >
            Got it, thanks!
          </button>
        </div>
      </Form>
    </Modal>
  );
}

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

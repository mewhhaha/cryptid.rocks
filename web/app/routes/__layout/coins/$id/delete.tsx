import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/cloudflare";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { Field } from "app/components/atoms/Field";
import { Input } from "app/components/atoms/Input";
import { loadPortfolio } from "app/helpers/loader.server";
import { call, client } from "ditty";
import { SerializedCoin } from "portfolio";
import invariant from "invariant";
import { escapeRegex } from "app/helpers";
import { Modal } from "app/components";

export const action: ActionFunction = async ({ request, context, params }) => {
  const id = params["id"];
  invariant(id, "part of route");

  const sub = context.JWT.payload.sub;

  const p = client(request, context.PORTFOLIO_DO, sub);
  await call(p, "remove", id);
  return redirect("/coins");
};

export const loader: LoaderFunction = async ({ context, request, params }) => {
  const id = params["id"];
  const sub = context.JWT.payload.sub;

  const portfolio = await loadPortfolio(sub, request, context);

  const coin = portfolio.list.find((c) => c.id === id);
  if (coin === undefined) return redirect("/coins");
  return coin;
};

export default function Page() {
  const navigate = useNavigate();
  const coin = useLoaderData<SerializedCoin>();
  const onClose = () => navigate("/coins", { replace: true });

  return (
    <Modal title={`Delete ${coin.name}`} onClose={onClose}>
      <Form method="post">
        <div className="mt-2 space-y-2">
          <p className="text-sm text-gray-500">
            Fill in the form with{" "}
            <span className="text-red-600">`{coin.name}`</span> to delete
          </p>
          <Field title="Confirmation" htmlFor="confirmation">
            <Input
              id="amount"
              required
              pattern={`^${escapeRegex(coin.name)}$`}
              type="text"
              placeholder={coin.name}
              min={0}
            />
          </Field>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </Form>
    </Modal>
  );
}

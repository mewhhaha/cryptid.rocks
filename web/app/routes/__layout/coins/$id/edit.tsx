import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/cloudflare";
import {
  Form,
  ShouldReloadFunction,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { loadPortfolio } from "app/helpers";
import { call, client } from "ditty";
import { SerializedCoin } from "portfolio";
import invariant from "invariant";
import { Modal, Field, Input } from "app/components";

export const action: ActionFunction = async ({ request, context, params }) => {
  const id = params["id"];
  invariant(id, "part of route");

  const formData = await request.formData();
  const amount = formData.get("amount")?.toString();

  if (amount === undefined) {
    return new Response("missing form values", { status: 422 });
  }

  if (Number.parseFloat(amount) < 0) {
    return new Response("amount is negative", { status: 422 });
  }

  const sub = context.JWT.payload.sub;

  const p = client(request, context.PORTFOLIO_DO, sub);
  await call(p, "update", id, Number.parseFloat(amount));
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

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) =>
  submission !== undefined;

export default function Page() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const coin = useLoaderData<SerializedCoin>();
  const onClose = () => navigate("/coins", { replace: true });

  return (
    <Modal title={`Edit ${coin.name}`} onClose={onClose}>
      <Form
        method="post"
        onChange={(event) => {
          const formData = new FormData(event.currentTarget);
          const amount = formData.get("amount")?.toString() ?? "0";
          setParams({ amount }, { replace: true });
        }}
      >
        <div className="mt-2 space-y-2">
          <p className="text-sm text-gray-500">
            Fill in the form to edit the amount
          </p>
          <Field title="Amount" htmlFor="amount">
            <Input
              id="amount"
              required
              type="number"
              step="0.000001"
              name="amount"
              defaultValue={params.get("amount") ?? coin.amount}
              min={0}
            />
          </Field>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-orange-100 px-4 py-2 text-sm font-medium text-orange-900 hover:bg-orange-200"
          >
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
}

import { ActionFunction, redirect } from "@remix-run/cloudflare";
import {
  Form,
  ShouldReloadFunction,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { Modal, Field, Input, CoinInput } from "app/components";
import { call, client } from "ditty";

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const id = formData.get("coin")?.toString();
  const amount = formData.get("amount")?.toString();

  if (amount === undefined || id === undefined) {
    return new Response("missing form values", { status: 422 });
  }

  if (Number.parseFloat(amount) < 0) {
    return new Response("amount is negative", { status: 422 });
  }

  const { metadata } = await context.COINS_KV.getWithMetadata<{
    id: string;
    symbol: string;
    name: string;
  }>(id);

  if (metadata === null) {
    return new Response("missing metadata", { status: 422 });
  }

  const sub = context.JWT.payload.sub;

  const p = client(request, context.PORTFOLIO_DO, sub);
  await call(p, "set", { ...metadata, amount: Number.parseFloat(amount) });
  return redirect("/coins");
};

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) =>
  submission !== undefined;

export default function Page() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const onClose = () => navigate("/coins", { replace: true });

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
            <CoinInput
              required
              id="coin"
              name="coin"
              defaultValue={params.get("coin") ?? ""}
            />
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

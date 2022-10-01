import { Dialog, Transition } from "@headlessui/react";
import { ActionFunction, redirect } from "@remix-run/cloudflare";
import { Form, useNavigate, useSearchParams } from "@remix-run/react";
import { Field } from "app/components/atoms/Field";
import { Input } from "app/components/atoms/Input";
import { CoinInput } from "app/components/molecules/CoinInput";
import { call, client } from "ditty";
import { Fragment } from "react";

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const name = formData.get("coin")?.toString();
  const amount = formData.get("amount")?.toString();

  if (amount === undefined || name === undefined) {
    return new Response("missing form values", { status: 422 });
  }

  if (Number.parseFloat(amount) < 0) {
    return new Response("amount is negative", { status: 422 });
  }

  const { metadata } = await context.COINS_KV.getWithMetadata<{
    id: string;
    symbol: string;
    name: string;
  }>(name);

  if (metadata === null) {
    return new Response("missing metadata", { status: 422 });
  }

  const sub = context.JWT.payload.sub;

  try {
    const p = client(request, context.PORTFOLIO_DO, sub);
    await call(p, "set", { ...metadata, amount: Number.parseFloat(amount) });
    return redirect("/coins");
  } catch (err) {
    console.error(err);
    return new Response(err instanceof Error ? err.message : "", {
      status: 500,
    });
  }
};

export default function Page() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const onClose = () => navigate("..", { replace: true });

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <Form
            method="post"
            className="flex min-h-full items-center justify-center p-4 text-center"
            onChange={(event) => {
              const formData = new FormData(event.currentTarget);
              const coin = formData.get("coin")?.toString() ?? "";
              const amount = formData.get("amount")?.toString() ?? "0";
              setParams({ coin, amount }, { replace: true });
            }}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Pick a coin to add
                </Dialog.Title>
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
              </Dialog.Panel>
            </Transition.Child>
          </Form>
        </div>
      </Dialog>
    </Transition>
  );
}

import { Dialog, Transition } from "@headlessui/react";
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
import { Fragment } from "react";
import invariant from "invariant";
import { escapeRegex } from "app/helpers";

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
                  Delete {coin.name}
                </Dialog.Title>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-500">
                    Fill in the form with{" "}
                    <span className="text-red-600">`{coin.name}`</span> to
                    delete
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
              </Dialog.Panel>
            </Transition.Child>
          </Form>
        </div>
      </Dialog>
    </Transition>
  );
}

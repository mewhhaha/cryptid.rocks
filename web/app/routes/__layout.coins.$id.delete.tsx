import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { Field } from "app/components/atoms/Field";
import { Input } from "app/components/atoms/Input";
import { Modal } from "~/components/molecules/Modal";
import { authenticate } from "~/helpers/auth.server";
import { Table } from "~/helpers/db.server";
import { invariant } from "~/helpers/invariant";
import { escapeRegex } from "~/helpers/regex";

export const action = async ({
  request,
  context: { cloudflare: cf },
  params: { id },
}: ActionFunctionArgs) => {
  const user = await authenticate(cf, request);
  invariant(id, "part of route");

  const result = await cf.env.DB.prepare(
    "DELETE FROM coins WHERE id = ? AND user_id = ?",
  )
    .bind(id, user.id)
    .run();

  if (result.success) {
    return redirect("/coins");
  } else {
    return { success: false, message: "Failed to delete coin" };
  }
};

export const loader = async ({
  context: { cloudflare: cf },
  request,
  params: { id },
}: LoaderFunctionArgs) => {
  const user = await authenticate(cf, request);
  invariant(id, "part of route");

  const coin = await cf.env.DB.prepare(
    "SELECT (id, name) FROM portfolio WHERE id = ? AND user_id = ?",
  )
    .bind(id, user.id)
    .first<Pick<Table["portfolio"], "id" | "name">>();

  if (coin === null) throw redirect("/coins");
  return coin;
};

export default function Page() {
  const navigate = useNavigate();
  const coin = useLoaderData<typeof loader>();
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

import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import {
  Form,
  ShouldRevalidateFunction,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { type } from "arktype";
import { authenticate } from "~/helpers/auth.server";
import { invariant } from "~/helpers/invariant";
import { Table } from "~/helpers/db.server";
import { Modal } from "~/components/molecules/Modal";
import { Field } from "~/components/atoms/Field";
import { Input } from "~/components/atoms/Input";

const parseFormData = type({
  amount: "string.numeric.parse >= 0",
});

export const action = async ({
  request,
  context: { cloudflare: cf },
  params: { id },
}: ActionFunctionArgs) => {
  const user = await authenticate(cf, request);
  invariant(id, "part of route");

  const formData = parseFormData(
    Object.fromEntries((await request.formData()).entries()),
  );
  if (formData instanceof type.errors) {
    return new Response(formData.summary, { status: 422 });
  }

  const date = new Date().toISOString();

  const result = await cf.env.DB.prepare(
    "UPDATE portfolio SET amount = ?, updated_at = ? WHERE id = ? AND user_id = ?",
  )
    .bind(formData.amount, date, id, user.id)
    .run();

  if (!result.success) {
    return { success: false, message: "Failed to update coin" };
  }

  throw redirect("/coins");
};

export const loader = async ({
  context: { cloudflare: cf },
  request,
  params: { id },
}: LoaderFunctionArgs) => {
  const user = await authenticate(cf, request);
  invariant(id, "part of route");

  const coin = await cf.env.DB.prepare(
    "SELECT id, amount FROM portfolio WHERE id = ? AND user_id = ?",
  )
    .bind(id, user.id)
    .first<Pick<Table["portfolio"], "id" | "amount" | "name">>();

  if (coin === null) return redirect("/coins");
  return coin;
};

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

export default function Page() {
  const navigate = useNavigate();
  const coin = useLoaderData<typeof loader>();
  const onClose = () => navigate("/coins", { replace: true });

  return (
    <Modal title={`Edit ${coin.name}`} onClose={onClose}>
      <Form method="post">
        <div className="mt-2 space-y-2">
          <h3 className="text-sm text-gray-500">
            Fill in the form to edit the amount
          </h3>
          <Field title="Amount" htmlFor="amount">
            <Input
              id="amount"
              required
              type="number"
              step="0.000001"
              name="amount"
              defaultValue={coin.amount}
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

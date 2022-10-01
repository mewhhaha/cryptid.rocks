import { ActionFunction } from "@remix-run/cloudflare";
import { isVs } from "app/data/vs";
import { Amount } from "app/types";

const VALUE_NAME = "value";
const VS_NAME = "vs";

export const makeAmountFormData = (amount: Amount) => {
  const formData = new FormData();
  formData.set(VALUE_NAME, amount.value.toString());
  formData.set(VS_NAME, amount.vs);

  return formData;
};

export const action: ActionFunction = async ({ request, context }) => {
  try {
    const formData = await request.formData();

    const value = formData.get(VALUE_NAME)?.toString();
    const vs = formData.get(VS_NAME)?.toString();

    if (value === undefined) throw new Error("missing value");
    if (vs === undefined) throw new Error("missing value");
    if (!isVs(vs)) throw new Error("invalid vs");

    let parsed;
    try {
      parsed = Number.parseFloat(value);
    } catch {
      throw new Error("could not parse value");
    }

    if (isNaN(parsed)) throw new Error("value is NaN");
    if (!isFinite(parsed)) throw new Error("value is infinite");

    const sub = context.JWT.payload.sub;

    const now = new Date();

    const amount = { value, vs, updatedAt: now };

    context.AMOUNT_KV.put(`${sub}-latest`, JSON.stringify(amount));
    context.AMOUNT_KV.put(
      `${sub}-date-${descendingDate(now)}`,
      JSON.stringify(amount)
    );

    return amount;
  } catch (error) {
    if (error instanceof Error) new Response(error.message, { status: 322 });
    return new Response("unknown error", { status: 322 });
  }
};

const descendingDate = (date: Date) => Number.MAX_SAFE_INTEGER - date.getTime();

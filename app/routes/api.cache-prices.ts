import { LoaderFunction } from "@remix-run/cloudflare";
import { type } from "arktype";
import { authenticate } from "~/helpers/auth.server";
import { createPricesCacheKey } from "~/helpers/prices";

const parseFormData = type({
  vs: "string",
  coins: type("string.json.parse").to("Record<string,Record<string,number>>"),
});

export const action: LoaderFunction = async ({
  request,
  context: { cloudflare: cf },
}) => {
  const user = await authenticate(cf, request);

  const formData = parseFormData(
    Object.fromEntries((await request.formData()).entries()),
  );

  if (formData instanceof type.errors) {
    throw new Response(formData.summary, { status: 422 });
  }

  const now = new Date();
  const expires = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );

  const cache = await cf.caches.open("prices");
  const cacheKey = createPricesCacheKey(user.id, request);
  const response = new Response(JSON.stringify(formData), {
    status: 200,
    headers: { Expires: expires.toUTCString() },
  });
  await cache.put(cacheKey, response);

  return null;
};

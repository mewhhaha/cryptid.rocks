import { LoaderFunction } from "@remix-run/cloudflare";
import { type } from "arktype";
import { authenticate } from "~/helpers/auth.server";
import { createUserCacheKey } from "~/helpers/prices";

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
  const pricesExpires = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );
  const currencyExpires = new Date(now.getFullYear() + 1, now.getMonth(), 1);

  const pricesCache = await cf.caches.open("prices");
  const currencyCache = await cf.caches.open("currency");
  const cacheKey = createUserCacheKey(user.id, request);
  const response = new Response(JSON.stringify(formData), {
    status: 200,
    headers: { Expires: pricesExpires.toUTCString() },
  });
  await Promise.all([
    pricesCache.put(cacheKey, response),
    currencyCache.put(
      cacheKey,
      new Response(JSON.stringify({ vs: formData.vs }), {
        status: 200,
        headers: { Expires: currencyExpires.toUTCString() },
      }),
    ),
  ]);

  return null;
};

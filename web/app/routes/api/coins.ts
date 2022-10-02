import { LoaderFunction } from "@remix-run/cloudflare";

export const loader: LoaderFunction = async ({ request, context }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? "";

  const list = await context.COINS_KV.list({ limit: 50, prefix: search });

  return list.keys.map((c) => c.metadata).filter((x) => !!x);
};

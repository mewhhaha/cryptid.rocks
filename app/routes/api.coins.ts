import { LoaderFunction } from "@remix-run/cloudflare";
import { authenticate } from "~/helpers/auth.server";
import { camelCaseKeysFromSnakeCase, Table } from "~/helpers/db.server";
import { distance } from "fastest-levenshtein";

export const loader: LoaderFunction = async ({
  request,
  context: { cloudflare: cf },
}) => {
  const _ = authenticate(cf, request);
  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? "";

  const result = await cf.env.DB.prepare(
    `SELECT * FROM coins WHERE name LIKE ?1 OR symbol LIKE ?1 LIMIT 10`,
  )
    .bind(`%${search}%`)
    .all<Table["coins"]>();

  return result.results.map(camelCaseKeysFromSnakeCase).sort((a, b) => {
    const distanceA = Math.min(
      distance(search, a.id),
      distance(search, a.name),
      distance(search, a.symbol),
    );
    const distanceB = Math.min(
      distance(search, b.id),
      distance(search, b.name),
      distance(search, b.symbol),
    );

    return distanceA - distanceB;
  });
};

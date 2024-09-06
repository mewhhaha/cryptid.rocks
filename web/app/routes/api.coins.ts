import { LoaderFunction } from "@remix-run/cloudflare";
import { authenticate } from "~/helpers/auth.server";
import { camelCaseKeysFromSnakeCase, Table } from "~/helpers/db.server";

export const loader: LoaderFunction = async ({
  request,
  context: { cloudflare: cf },
}) => {
  const _ = authenticate(cf, request);
  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? "";

  const result = await cf.env.DB.prepare(
    `SELECT * FROM coins WHERE name LIKE ?1 OR symbol LIKE ?1 LIMIT 50`,
  )
    .bind(`%${search}%`)
    .all<Table["coins"]>();

  return result.results.map(camelCaseKeysFromSnakeCase);
};

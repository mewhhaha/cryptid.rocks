import { LoaderFunction } from "remix";
import { auth } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request, context }) => {
  await auth(context).logout(request, { redirectTo: "/login" });
};

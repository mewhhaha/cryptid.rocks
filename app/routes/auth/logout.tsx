import { auth } from "~/services/auth.server";
import { LoaderFunction } from "~/types";

export const loader: LoaderFunction = async ({ request, context }) => {
  await auth(context).logout(request, { redirectTo: "/login" });
};

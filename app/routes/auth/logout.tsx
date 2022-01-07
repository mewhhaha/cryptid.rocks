import { LoaderFunction } from "remix";
import { auth } from "~/services/auth.server";

export const loader: LoaderFunction = ({ request, context }) => {
  return auth(context).logout(request, { redirectTo: "/login" });
};

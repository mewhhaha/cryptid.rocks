import { auth } from "~/services/auth.server";
import { fetchPortfolio } from "~/services/portfolio.server";
import { LoaderFunction } from "~/types";

export const loader: LoaderFunction = async ({ request, context }) => {
  const user = await auth(context).isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return await fetchPortfolio(context, user.id, "/websocket");
};

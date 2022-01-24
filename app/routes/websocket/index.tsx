import { isAuthenticated } from "~/services/auth.server";
import { fetchPortfolio } from "~/services/portfolio.server";
import { LoaderFunction } from "~/types";

export const loader: LoaderFunction = async ({ context }) => {
  const user = await isAuthenticated(context, {
    failureRedirect: "/login",
  });

  return await fetchPortfolio(context, user.id, "/websocket");
};

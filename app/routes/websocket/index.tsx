import { LoaderFunction } from "remix";
import { authenticator } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request, context }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const id = context.PORTFOLIO.idFromName(user.id);
  const roomObject = context.PORTFOLIO.get(id);
  const newUrl = new URL(request.url);

  newUrl.pathname = "/websocket";

  return roomObject.fetch(newUrl.toString(), request);
};

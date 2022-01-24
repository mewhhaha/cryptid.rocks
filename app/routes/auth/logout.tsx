import { logout } from "~/services/auth.server";
import { ActionFunction } from "~/types";

export const action: ActionFunction = async ({ context }) => {
  const url = new URL(`https://${context.env.AUTH0_DOMAIN}/v2/logout`);
  url.searchParams.set("client_id", context.env.AUTH0_CLIENT_ID);
  url.searchParams.set(
    "returnTo",
    `${new URL(context.request.url).origin}/login`
  );

  return await logout(context, {
    redirectTo: url.toString(),
  });
};

import { logout } from "~/services/auth.server";
import { ActionFunction } from "~/types";

export const action: ActionFunction = async ({ context }) => {
  await logout(context, {
    redirectTo: `https://${context.env.AUTH0_DOMAIN}/v2/logout?client_id=${context.env.AUTH0_CLIENT_ID}`,
  });
};

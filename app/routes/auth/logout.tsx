import { logout } from "~/services/auth.server";
import { ActionFunction } from "~/types";

export const action: ActionFunction = async ({ context }) => {
  await logout(context, { redirectTo: "/login" });
};

import { auth } from "~/services/auth.server";
import { ActionFunction } from "~/types";

export const action: ActionFunction = async ({ request, context }) => {
  await auth(context).logout(request, { redirectTo: "/login" });
};

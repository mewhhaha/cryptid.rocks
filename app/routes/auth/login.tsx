import { auth } from "~/services/auth.server";
import { ActionFunction } from "~/types";

export const action: ActionFunction = async ({ request, context }) => {
  await auth(context).authenticate("auth0", request);
};

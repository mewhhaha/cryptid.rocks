import { ActionFunction, LoaderFunction } from "remix";
import { auth } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request, context }) => {
  await auth(context).authenticate("auth0", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};

export const action: ActionFunction = async ({ request, context }) => {
  await auth(context).authenticate("auth0", request);
};

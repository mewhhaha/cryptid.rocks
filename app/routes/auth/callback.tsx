import { auth } from "~/services/auth.server";
import { ActionFunction, LoaderFunction } from "~/types";

export const loader: LoaderFunction = async ({ request, context }) => {
  await auth(context).authenticate("auth0", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};

export const action: ActionFunction = async ({ request, context }) => {
  await auth(context).authenticate("auth0", request);
};

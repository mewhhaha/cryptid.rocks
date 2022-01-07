import { ActionFunction, LoaderFunction } from "remix";
import { auth } from "~/services/auth.server";

export const loader: LoaderFunction = ({ request, context }) => {
  return auth(context).authenticate("auth0", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};

export const action: ActionFunction = ({ request, context }) => {
  return auth(context).authenticate("auth0", request);
};

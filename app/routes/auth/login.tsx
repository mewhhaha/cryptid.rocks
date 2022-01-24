import { authenticate } from "~/services/auth.server";
import { ActionFunction } from "~/types";

export const action: ActionFunction = async ({ context }) => {
  await authenticate(context, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};

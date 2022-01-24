import { authenticate } from "~/services/auth.server";
import { LoaderFunction } from "~/types";

export const loader: LoaderFunction = async ({ context }) => {
  await authenticate(context, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};

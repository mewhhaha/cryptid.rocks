import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { logout } from "~/helpers/auth.server";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  return logout(context.cloudflare, "/");
};

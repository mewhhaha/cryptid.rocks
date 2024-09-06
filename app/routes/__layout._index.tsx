import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { authenticate } from "~/helpers/auth.server";

export const loader = ({
  request,
  context: { cloudflare: cf },
}: LoaderFunctionArgs) => {
  const _ = authenticate(cf, request);
  return redirect("/coins");
};

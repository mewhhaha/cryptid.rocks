import { generateLogoutURL } from "@cloudflare/pages-plugin-cloudflare-access/api";
import { LoaderFunction } from "@remix-run/cloudflare";

export const loader: LoaderFunction = () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: generateLogoutURL({
        domain: "https://jkot.cloudflareaccess.com",
      }),
    },
  });
};

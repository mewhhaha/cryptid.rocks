import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "../build";

const handleRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => context,
});

export function onRequest(context) {
  return handleRequest(context);
}

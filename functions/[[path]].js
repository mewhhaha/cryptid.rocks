import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "../web/build";

const handleRequest = createPagesFunctionHandler({
  build,
});

export function onRequest(context) {
  return handleRequest(context);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "../build";

const handleRequest = createPagesFunctionHandler({
  build: build as any,
  getLoadContext: (context) => context,
});

export function onRequest(context: EventContext<any, any, any>) {
  return handleRequest(context);
}

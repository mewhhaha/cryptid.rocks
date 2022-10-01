/// <reference types="@remix-run/dev" />
import type { PluginData } from "@cloudflare/pages-plugin-cloudflare-access";
import { DurableObjectNamespaceIs } from "ditty";
import { Portfolio } from "portfolio";

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    JWT: PluginData["cloudflareAccess"]["JWT"];
    COINS_KV: KVNamespace;
    AMOUNT_KV: KVNamespace;
    PORTFOLIO_DO: DurableObjectNamespaceIs<Portfolio>;
  }
}

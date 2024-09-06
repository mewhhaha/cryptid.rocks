import { type PlatformProxy } from "wrangler";

interface Env {
  DB: D1Database;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  AUTH_SECRET: string;
}

export type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}

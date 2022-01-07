import { Authenticator } from "remix-auth";
import { Auth0Profile, Auth0Strategy } from "remix-auth-auth0";
import { createCookie, createCloudflareKVSessionStorage } from "remix";
import { WorkerContext } from "~/types";


export const auth = ({ env, request }: WorkerContext) => {
  const sessionCookie = createCookie("_session", {
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [env.SESSION_SECRET], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  });

  const sessionStorage = createCloudflareKVSessionStorage({
    kv: env.AUTH0_KV,
    cookie: sessionCookie,
  });

  const authenticator = new Authenticator<Auth0Profile>(sessionStorage);

  const url = new URL(request.url);
  url.pathname = env.AUTH0_CALLBACK_URL

  const auth0Strategy = new Auth0Strategy(
    {
      callbackURL: "/auth/callback",
      clientID: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      domain: env.AUTH0_DOMAIN,
    },
    async ({ profile }) => {
      return profile;
    }
  );

  authenticator.use(auth0Strategy);

  return authenticator;
};

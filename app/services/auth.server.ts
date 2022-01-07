import { Authenticator } from "remix-auth";
import { Auth0Profile, Auth0Strategy } from "remix-auth-auth0";
import { createCookie, createCloudflareKVSessionStorage } from "remix";

// const { SESSION_SECRET, AUTH0_CALLBACK_URL, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_DOMAIN, NODE_ENV } = process.env

// if (SESSION_SECRET === undefined) throw new Error("SESSION_SECRET is not defined")
// if (AUTH0_CALLBACK_URL === undefined) throw new Error("AUTH0_CALLBACK_URL is not defined")
// if (AUTH0_CLIENT_ID === undefined) throw new Error("AUTH0_CLIENT_ID is not defined")
// if (AUTH0_CLIENT_SECRET === undefined) throw new Error("AUTH0_CLIENT_SECRET is not defined")
// if (AUTH0_DOMAIN === undefined) throw new Error("AUTH0_DOMAIN is not defined")

// export the whole sessionStorage object

type Env = {
  SESSION_SECRET: string;
  AUTH0_KV: KVNamespace;
  AUTH0_CALLBACK_URL: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  AUTH0_DOMAIN: string;
};

let singleton: Authenticator<Auth0Profile>;

export const auth = ({ env, request }: EventContext<Env, '', unknown>) => {
  if (singleton !== undefined) return singleton;

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

  // Create an instance of the authenticator, pass a generic with what your
  // strategies will return and will be stored in the session
  const authenticator = new Authenticator<Auth0Profile>(sessionStorage);

  const url = new URL(request.url);
  url.pathname = env.AUTH0_CALLBACK_URL

  const auth0Strategy = new Auth0Strategy(
    {
      callbackURL: url.toString(),
      clientID: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      domain: env.AUTH0_DOMAIN,
    },
    async ({ profile }) => {
      return profile;
    }
  );

  authenticator.use(auth0Strategy);

  singleton = authenticator;
  return authenticator;
};

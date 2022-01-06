import { Authenticator } from "remix-auth";
import { Auth0Profile, Auth0Strategy } from "remix-auth-auth0";
import { createCookieSessionStorage } from "remix";

declare global {
  const SESSION_SECRET: string;
  const AUTH0_CALLBACK_URL: string;
  const AUTH0_CLIENT_ID: string;
  const AUTH0_CLIENT_SECRET: string;
  const AUTH0_DOMAIN: string;
  const NODE_ENV: string;
}

// const { SESSION_SECRET, AUTH0_CALLBACK_URL, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_DOMAIN, NODE_ENV } = process.env

// if (SESSION_SECRET === undefined) throw new Error("SESSION_SECRET is not defined")
// if (AUTH0_CALLBACK_URL === undefined) throw new Error("AUTH0_CALLBACK_URL is not defined")
// if (AUTH0_CLIENT_ID === undefined) throw new Error("AUTH0_CLIENT_ID is not defined")
// if (AUTH0_CLIENT_SECRET === undefined) throw new Error("AUTH0_CLIENT_SECRET is not defined")
// if (AUTH0_DOMAIN === undefined) throw new Error("AUTH0_DOMAIN is not defined")


// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [SESSION_SECRET], // replace this with an actual secret
    secure: NODE_ENV === "production", // enable this in prod only
  },
});

// Create an instance of the authenticator, pass a generic with what your
// strategies will return and will be stored in the session
export const authenticator = new Authenticator<Auth0Profile>(sessionStorage);

const auth0Strategy = new Auth0Strategy(
  {
    callbackURL: AUTH0_CALLBACK_URL,
    clientID: AUTH0_CLIENT_ID,
    clientSecret: AUTH0_CLIENT_SECRET,
    domain: AUTH0_DOMAIN,
  },
  async ({ profile }) => {
    return profile;
  }
);

authenticator.use(auth0Strategy);
import { Authenticator } from "remix-auth";
import { Auth0Profile, Auth0Strategy } from "remix-auth-auth0";
import { createCookieSessionStorage } from "remix";

declare global {
  const SESSION_SECRET: string;
  const AUTH0_CALLBACK_URL: string;
  const AUTH0_CLIENT_ID: string;
  const AUTH0_CLIENT_SECRET: string;
  const AUTH0_DOMAIN: string;
}

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [SESSION_SECRET], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

// Create an instance of the authenticator, pass a generic with what your
// strategies will return and will be stored in the session
export const authenticator = new Authenticator<Auth0Profile>(sessionStorage);

console.log(process.env.AUTH0_CALLBACK_URL)
console.log(process.env.AUTH0_CLIENT_ID)
console.log(process.env.AUTH0_CLIENT_SECRET)
console.log(process.env.AUTH0_DOMAIN)

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
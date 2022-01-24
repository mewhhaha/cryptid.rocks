import { AuthenticateOptions, Authenticator } from "remix-auth";
import { Auth0Profile, Auth0Strategy } from "remix-auth-auth0";
import { createCookie, createCookieSessionStorage } from "remix";
import { WorkerContext } from "~/types";


const auth = ({ env, request }: WorkerContext) => {
  const sessionCookie = createCookie("_session", {
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [env.SESSION_SECRET], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  });

  const sessionStorage = createCookieSessionStorage({
    cookie: sessionCookie,
  });

  const authenticator = new Authenticator<Auth0Profile>(sessionStorage);


  const auth0Strategy = new Auth0Strategy(
    {
      callbackURL: new URL(request.url).origin + env.AUTH0_CALLBACK_URL,
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

export function isAuthenticated
  (context: WorkerContext, options?: {
    successRedirect?: undefined;
    failureRedirect?: undefined;
  }): Promise<Auth0Profile | null>;
export function isAuthenticated
  (context: WorkerContext, options: {
    successRedirect: string;
    failureRedirect?: undefined;
  }): Promise<null>;
export function isAuthenticated
  (context: WorkerContext, options: {
    successRedirect?: undefined;
    failureRedirect: string;
  }): Promise<Auth0Profile>;


export function isAuthenticated(context: WorkerContext, options?: {
  successRedirect?: string;
  failureRedirect?: string;
} | undefined): Promise<Auth0Profile | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return auth(context).isAuthenticated(context.request, options as any);
}

export const authenticate = (context: WorkerContext, options?: Pick<AuthenticateOptions, "successRedirect" | "failureRedirect" | "throwOnError" | "context"> | undefined) => {
  return auth(context).authenticate("auth0", context.request, options)
}

export const logout = async (context: WorkerContext, options: {
  redirectTo: string;
}) => {
  await fetch(`${context.env.AUTH0_DOMAIN}/v2/logout?client_id=${context.env.AUTH0_CLIENT_ID}`)
  await auth(context).logout(context.request, options)
}
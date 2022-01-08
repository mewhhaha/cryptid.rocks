import { createContext, useContext } from "react";
import { Auth0Profile } from "remix-auth-auth0";

const Context = createContext<Auth0Profile | undefined>(undefined)

export const ProfileProvider = Context.Provider

export const useProfile = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("Expected ProfileProvider to wrap useProfile hook")
  }

  return context;
}
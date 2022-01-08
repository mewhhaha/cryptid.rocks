import { createContext, useContext } from "react";
import { SimplePrice } from "~/queries";

const Context = createContext<SimplePrice<"sek"> | undefined>(undefined)

export const PriceProvider = Context.Provider

export const usePrice = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("Expected PriceProvider to wrap usePrice hook")
  }

  return context;
}
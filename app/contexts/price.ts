import { createContext, useContext } from "react";
import { SimplePrice } from "~/queries";

const Context = createContext<SimplePrice<"sek"> | undefined>(undefined)

export const PriceProvider = Context.Provider

export const usePrice = () => {
  return useContext(Context);
}
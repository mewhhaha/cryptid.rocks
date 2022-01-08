import { createContext, useContext } from "react";
import { PortfolioCoin } from "workers/portfolio/portfolio";
import { Setter } from "~/types";

const Context = createContext<{ data: PortfolioCoin[], mutate: Setter<PortfolioCoin[]>, status: 'open' | 'closed' } | undefined>(undefined)

export const PortfolioProvider = Context.Provider

export const usePortfolio = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("Expected PortfolioProvider to wrap usePortfolio hook")
  }

  return context;
}
import { WorkerContext } from "~/types";

export const fetchPortfolio = async (context: WorkerContext, name: string, pathname: string) => {
  const request = context.request;
  const id = context.env.PORTFOLIO.idFromName(name);
  const durableObject = context.env.PORTFOLIO.get(id);

  const newUrl = new URL(request.url);
  newUrl.pathname = pathname;

  return await durableObject.fetch(newUrl.toString(), request);
};
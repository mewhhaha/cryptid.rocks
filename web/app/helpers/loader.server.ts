import { AppLoadContext } from "@remix-run/cloudflare";
import { call, client } from "ditty";
import { SerializedPoint } from "portfolio";
import { mockedList } from "./mocks";

export const loadPortfolio = async (
  sub: string,
  request: Request,
  context: AppLoadContext
): Promise<SerializedPoint> => {
  if (process.env.NODE_ENV !== "production") {
    return { list: mockedList, updatedAt: new Date().toISOString() };
  }
  const p = client(request, context.PORTFOLIO_DO, sub);
  return await call(p, "latest");
};

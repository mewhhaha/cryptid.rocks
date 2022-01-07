import { useLoaderData } from "remix";
import React, { useEffect, useState } from "react";
import { Portfolio } from "~/components/Portfolio";
import { Searchbox } from "~/components/Searchbox";
import { Account } from "~/components/Account";
import { auth } from "~/services/auth.server";
import { Auth0Profile } from "remix-auth-auth0";
import { PortfolioCoin } from "portfolio-worker";
import { LoaderFunction } from "~/types";

type LoaderData = { user: Auth0Profile; portfolio: PortfolioCoin[] };

export const loader: LoaderFunction = async ({
  request,
  context,
}): Promise<LoaderData> => {
  const user = await auth(context).isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const id = context.env.PORTFOLIO.idFromName(user.id);
  const roomObject = context.env.PORTFOLIO.get(id);
  const newUrl = new URL(request.url);

  newUrl.pathname = "/coins";

  const response = await roomObject.fetch(newUrl.toString(), request);
  const portfolio = (await response.json()) as PortfolioCoin[];

  return { user, portfolio };
};

const usePortfolioSubscription = (initial: PortfolioCoin[]) => {
  const [portfolio, setPortfolio] = useState(initial);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const host = window.location.host;

    const onchange = () => {
      if (document.visibilityState === "hidden") {
        if (socket?.OPEN) {
          socket?.close();
        }
      } else {
        const s = new WebSocket(`wss://${host}/websocket`);
        s.onmessage = (message) => {
          const data: PortfolioCoin[] = JSON.parse(message.data);
          if (JSON.stringify(portfolio) === JSON.stringify(data)) return;

          setPortfolio(data);
        };

        setSocket(new WebSocket(`wss://${window.location.host}/websocket`));
      }
    };

    document.addEventListener("visibilitychange", onchange);

    return () => {
      document.removeEventListener("visibilitychange", onchange);
    };
  }, [portfolio, socket]);

  useEffect(() => {
    if (!socket) return;

    if (socket.OPEN) {
      socket.send(JSON.stringify(portfolio));
    }
  }, [portfolio, socket]);

  return [portfolio, setPortfolio] as const;
};

const Index: React.VFC = () => {
  const { user, portfolio: initial } = useLoaderData<LoaderData>();

  const [portfolio, setPortfolio] = usePortfolioSubscription(initial);

  return (
    <main className="flex flex-col items-center w-screen h-screen">
      <header className="flex items-center justify-center w-full py-8">
        <Account user={user} />
      </header>
      <div className="flex-none w-full h-4 sm:h-10" />
      <div className="flex items-center justify-center w-full px-4">
        <Searchbox setPortfolio={setPortfolio} />
      </div>
      <div className="flex justify-center w-full">
        <Portfolio portfolio={portfolio} setPortfolio={setPortfolio} />
      </div>
    </main>
  );
};

export default Index;

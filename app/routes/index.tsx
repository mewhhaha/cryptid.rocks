import { useLoaderData } from "remix";
import React, { useEffect, useState } from "react";
import { Portfolio } from "~/components/Portfolio";
import { Searchbox } from "~/components/Searchbox";
import { Account } from "~/components/Account";
import { auth } from "~/services/auth.server";
import { Auth0Profile } from "remix-auth-auth0";
import { isPortfolioCoins, PortfolioCoin } from "portfolio-worker";
import { LoaderFunction } from "~/types";
import { fetchPortfolio } from "~/services/portfolio.server";

type LoaderData = { user: Auth0Profile; portfolio: PortfolioCoin[] };

export const loader: LoaderFunction = async ({
  request,
  context,
}): Promise<LoaderData> => {
  const user = await auth(context).isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const response = await fetchPortfolio(context, user.id, "/coins");
  const coins = await response.json();

  return { user, portfolio: coins as PortfolioCoin[] };
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
        const ws = new WebSocket(`wss://${host}/websocket`);
        ws.onmessage = (msg) => {
          const data = JSON.parse(msg.data);

          if (isPortfolioCoins(data)) {
            if (JSON.stringify(portfolio) === JSON.stringify(data)) return;
            console.log(data);
            setPortfolio(data);
          } else {
            console.log(data);
          }
        };

        setSocket(ws);
      }
    };

    document.addEventListener("visibilitychange", onchange);

    return () => {
      document.removeEventListener("visibilitychange", onchange);
    };
  }, [portfolio, socket]);

  useEffect(() => {
    if (!socket) return;
    socket.onopen = () => {
      console.log("open");
    };

    socket.onclose = () => {
      console.log("close");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    if (socket.OPEN && !socket.CONNECTING) {
      socket.send(JSON.stringify(portfolio));
      console.log(portfolio);
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

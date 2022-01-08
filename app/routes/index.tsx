import { useLoaderData } from "remix";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

const useVisibility = () => {
  const [visibility, setVisibility] = useState<VisibilityState>("visible");

  useEffect(() => {
    const onchange = () => {
      setVisibility(document.visibilityState);
    };

    document.addEventListener("visibilitychange", onchange);

    return () => {
      document.removeEventListener("visibilitychange", onchange);
    };
  }, []);

  return visibility;
};

const usePortfolioSubscription = (initial: PortfolioCoin[]) => {
  const [status, setStatus] = useState<"open" | "closed">("closed");
  const [portfolio, setPortfolio] = useState(initial);
  const [socket, setSocket] = useState<WebSocket>();
  const visibility = useVisibility();

  const { current: startSocket } = useRef(() => {
    const ws = new WebSocket(`wss://${window.location.host}/websocket`);
    ws.onmessage = (msg: MessageEvent<string>) => {
      const data = JSON.parse(msg.data);

      if (isPortfolioCoins(data)) {
        setPortfolio(data);
      } else {
        console.log(data);
      }
    };
    ws.onopen = () => {
      setStatus("open");
    };
    ws.onclose = () => {
      setStatus("closed");
    };

    setSocket(ws);

    return ws;
  });

  useEffect(() => {
    if (visibility === "hidden") return;

    const ws = startSocket();
    return () => {
      ws.close();
    };
  }, [startSocket, visibility]);

  return {
    value: portfolio,
    status,
    mutate: useCallback(
      (f: (prev: PortfolioCoin[]) => PortfolioCoin[]) => {
        const value = f(portfolio);

        setPortfolio(value);
        if (socket && socket.OPEN && !socket.CONNECTING) {
          socket.send(JSON.stringify(value));
        }
      },
      [portfolio, socket]
    ),
  };
};

const Index: React.VFC = () => {
  const { user, portfolio: initial } = useLoaderData<LoaderData>();

  const { value, status, mutate } = usePortfolioSubscription(initial);

  return (
    <main className="flex flex-col items-center w-screen h-screen">
      <header className="flex items-center justify-center w-full py-8">
        <Account user={user} status={status} />
      </header>
      <div className="flex-none w-full h-4 sm:h-10" />
      <div className="flex items-center justify-center w-full px-4">
        <Searchbox setPortfolio={mutate} />
      </div>
      <div className="flex justify-center w-full">
        <Portfolio portfolio={value} setPortfolio={mutate} />
      </div>
    </main>
  );
};

export default Index;

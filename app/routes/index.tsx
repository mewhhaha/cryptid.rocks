import { useLoaderData } from "remix";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Portfolio } from "~/components/Portfolio";
import { Searchbox } from "~/components/Searchbox";
import { Account } from "~/components/Account";
import { Auth0Profile } from "remix-auth-auth0";
import { isPortfolioCoins, PortfolioCoin } from "portfolio-do";
import { LoaderFunction } from "~/types";
import { fetchPortfolio } from "~/services/portfolio.server";
import { PortfolioProvider } from "~/contexts/portfolio";
import { PriceProvider } from "~/contexts/price";
import { useSimplePriceQuery } from "~/queries";
import { ProfileProvider } from "~/contexts/profile";
import { isAuthenticated } from "~/services/auth.server";

type LoaderData = {
  user: Auth0Profile;
  portfolio: PortfolioCoin[];
};

export const loader: LoaderFunction = async ({
  context,
}): Promise<LoaderData> => {
  const user = await isAuthenticated(context, {
    failureRedirect: "/login",
  });

  const portfolio = await fetchPortfolio(context, user.id, "/coins").then((r) =>
    r.json<PortfolioCoin[]>()
  );

  return { user, portfolio };
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

  const mutate = useCallback(
    (f: (prev: PortfolioCoin[]) => PortfolioCoin[]) => {
      const value = f(portfolio);

      setPortfolio(value);
      if (socket && socket.OPEN && !socket.CONNECTING) {
        socket.send(JSON.stringify(value));
      }
    },
    [portfolio, socket]
  );

  return useMemo(
    () => ({
      data: portfolio,
      status,
      mutate,
    }),
    [mutate, portfolio, status]
  );
};

const Index: React.VFC = () => {
  const { user, portfolio: initialPortfolio } = useLoaderData<LoaderData>();

  const portfolio = usePortfolioSubscription(initialPortfolio);
  const price = useSimplePriceQuery(
    portfolio.data.map((c) => c.id),
    "sek"
  );

  return (
    <ProfileProvider value={user}>
      <PortfolioProvider value={portfolio}>
        <PriceProvider value={price}>
          <main className="flex flex-col items-center w-screen h-screen">
            <header className="flex items-center justify-center w-full py-8">
              <Account />
            </header>
            <div className="flex-none w-full h-4 sm:h-10" />
            <div className="flex items-center justify-center w-full px-4">
              <Searchbox />
            </div>
            <div className="flex justify-center w-full">
              <Portfolio />
            </div>
          </main>
        </PriceProvider>
      </PortfolioProvider>
    </ProfileProvider>
  );
};

export default Index;

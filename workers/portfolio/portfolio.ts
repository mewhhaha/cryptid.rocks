
export default {
  async fetch() {
    return new Response(null, { status: 404 })
  }
}

export type CoinInfo = {
  id: string
  symbol: string
  name: string
}

export type PortfolioCoin = CoinInfo & {
  quantity: number
}

const isCoin = (data: unknown | PortfolioCoin): data is PortfolioCoin => {
  if (typeof data !== 'object') return false;
  if (data === null) return false;
  if (!('id' in data)) return false;
  if (!('symbol' in data)) return false;
  if (!('quantity' in data)) return false;

  if (!('id' in data) || typeof (data as { id: string }).id !== 'string') return false;

  if (!('symbol' in data) || typeof (data as { symbol: string }).symbol !== 'string') return false;

  if (!('name' in data) || typeof (data as { name: string }).name !== 'string') return false;

  if (!('quantity' in data) || typeof (data as { quantity: number }).quantity !== 'number') return false;

  return true;
}

const isPortfolioCoins = (data: unknown): data is PortfolioCoin[] => {
  if (!Array.isArray(data)) return false;
  if (!data.every(isCoin)) return false;

  return true;
}

export class Portfolio implements DurableObject {
  storage: DurableObjectStorage;
  latest: PortfolioCoin[];
  sessions: WebSocket[];

  constructor(controller: DurableObjectState) {
    this.storage = controller.storage;
    this.sessions = [];
    this.latest = []

    controller.blockConcurrencyWhile(async () => {
      const stored = await this.storage.get<PortfolioCoin[]>("latest");
      if (stored) {
        this.latest = stored;
      }
    });
  }

  async fetch(request: Request) {

    const url = new URL(request.url);

    switch (url.pathname) {
      case "/websocket": {
        if (request.headers.get("Upgrade") != "websocket") {
          return new Response("expected websocket", { status: 400 });
        }
        const pair = new WebSocketPair();
        await this.handleSession(pair[1]);

        return new Response(null, { status: 101, webSocket: pair[0] });
      }

      case "/coins": {
        const stored = await this.storage.get<PortfolioCoin[]>("latest");
        return new Response(JSON.stringify(stored ?? []), { status: 200 })
      }

      default:
        return new Response("Not found", { status: 404 });
    }
  }

  async handleSession(webSocket: WebSocket) {
    webSocket.accept();

    this.sessions.push(webSocket);

    webSocket.addEventListener("message", async (msg) => {
      try {
        const data = JSON.parse(msg.data as string)

        if (isPortfolioCoins(data)) {
          this.broadcast(data)

          await this.storage.put("latest", data);
        }

      } catch (err) {
        if (err instanceof Error) {
          webSocket.send(JSON.stringify({ error: err.stack }));
        }
      }
    });

    const closeOrErrorHandler = () => {
      this.sessions = this.sessions.filter((member) => member !== webSocket);
    };

    webSocket.addEventListener("close", closeOrErrorHandler);
    webSocket.addEventListener("error", closeOrErrorHandler);
  }

  broadcast(payload: unknown) {
    let message = "";
    if (typeof payload !== "string") {
      message = JSON.stringify(message);
    } else {
      message = payload;
    }

    this.sessions = this.sessions.filter((session) => {
      try {
        session.send(message);
        return true;
      } catch (err) {
        return false;
      }
    });
  }
}


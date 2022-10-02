import { DurableObjectNamespaceIs, serialize } from "ditty";
import { CallableDurableObject } from "ditty";

type Coin = {
  updatedAt: Date;
  id: string;
  name: string;
  symbol: string;
  amount: number;
};

export type SerializedCoin = {
  updatedAt: string;
  id: string;
  name: string;
  symbol: string;
  amount: number;
};

type Point = {
  updatedAt: Date;
  list: Coin[];
};

export type SerializedPoint = {
  updatedAt: string;
  list: SerializedCoin[];
};

export type Env = {
  COUNTER_DO: DurableObjectNamespaceIs<Portfolio>;
};

export class Portfolio extends CallableDurableObject {
  private storage: DurableObjectStorage;
  private current: Point = { updatedAt: new Date(), list: [] };

  constructor(state: DurableObjectState) {
    super();

    this.storage = state.storage;
    state.blockConcurrencyWhile(async () => {
      const value = await this.storage.get<Point>("latest");
      if (value) {
        this.current = value;
      }
    });
  }

  set(coin: Omit<Coin, "updatedAt">) {
    const { list } = this.current;

    const now = new Date();
    const exists = list.find((c) => c.id === coin.id);
    const updated = { ...coin, updatedAt: now };

    this.current = {
      updatedAt: now,
      list: exists
        ? list.map((c) => (c.id === updated.id ? updated : c))
        : [...list, updated],
    };

    this.storage.put("latest", this.current);
    this.storage.put(dateKey(now), this.current);

    return serialize(this.current);
  }

  update(id: string, amount: number) {
    const now = new Date();

    this.current.list = this.current.list.map((c) =>
      c.id === id ? { ...c, amount, updatedAt: now } : c
    );

    this.storage.put("latest", this.current);
    this.storage.put(dateKey(now), this.current);

    return serialize(this.current);
  }

  remove(id: string) {
    const { list } = this.current;

    const now = new Date();
    this.current = {
      updatedAt: now,
      list: list.filter((c) => c.id !== id),
    };

    this.storage.put("latest", this.current);
    this.storage.put(dateKey(now), this.current);

    return serialize(this.current);
  }

  latest() {
    return serialize(this.current);
  }
}

export default {
  fetch: () => {
    return new Response("not found", { status: 404 });
  },
};

const dateKey = (date: Date) => {
  return `date-${date.getTime().toString()}`;
};

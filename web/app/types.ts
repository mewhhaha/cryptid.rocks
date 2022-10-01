import { Vs } from "./data/vs";

export type Coin = { id: string; name: string; symbol: string };

export type Amount = { value: number; vs: Vs; updatedAt: string };

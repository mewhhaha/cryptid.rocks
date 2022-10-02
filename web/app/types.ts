export type Coin = { id: string; name: string; symbol: string };

export type Amount = { value: number; vs: Vs };

export type Price<T extends Vs> = {
  [key in
    | T
    | `${T}_market_cap`
    | `${T}_24h_vol`
    | `${T}_24h_change`
    | "last_updated_at"]: number;
};

export type Prices<T extends Vs> = {
  vs: T;
  coins: Record<string, Price<Vs>>;
};

export type Vs = typeof validVs[number];

export const isVs = (s: string): s is Vs => {
  return validVsSet.has(s as Vs);
};

export const validVs = [
  "btc",
  "eth",
  "ltc",
  "bch",
  "bnb",
  "eos",
  "xrp",
  "xlm",
  "link",
  "dot",
  "yfi",
  "usd",
  "aed",
  "ars",
  "aud",
  "bdt",
  "bhd",
  "bmd",
  "brl",
  "cad",
  "chf",
  "clp",
  "cny",
  "czk",
  "dkk",
  "eur",
  "gbp",
  "hkd",
  "huf",
  "idr",
  "ils",
  "inr",
  "jpy",
  "krw",
  "kwd",
  "lkr",
  "mmk",
  "mxn",
  "myr",
  "ngn",
  "nok",
  "nzd",
  "php",
  "pkr",
  "pln",
  "rub",
  "sar",
  "sek",
  "sgd",
  "thb",
  "try",
  "twd",
  "uah",
  "vef",
  "vnd",
  "zar",
  "xdr",
  "xag",
  "xau",
  "bits",
  "sats",
] as const;

const validVsSet = new Set(validVs);

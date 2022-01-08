import useQuery from "swr";

export const createPriceUrl = <Vs extends string>(ids: string[], vs: string extends Vs ? never : Vs) => {
  return `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join()}&vs_currencies=${vs}&include_24hr_change=true`;
}

export type SimplePrice<
  Vs extends string
  > = Record<
    string,
    Record<Vs, number> & Record<`${Vs}_24h_change`, number | null>
  >;

export const useSimplePriceQuery = <Vs extends string>(
  ids: string[],
  vs: string extends Vs ? never : Vs,
) => {

  return useQuery<SimplePrice<Vs>>(
    createPriceUrl(ids, vs),
    (url) => fetch(url).then((r) => r.json()),
  ).data;
};

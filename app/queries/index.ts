import useQuery from "swr";

export const createPriceUrl = <Vs extends string>(id: string | string[], vs: string extends Vs ? never : Vs) => {
  const ids = [id].flat().join();
  return `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vs}&include_24hr_change=true`;
}


export type SimplePrice<
  Vs extends string
  > = Record<
    string,
    Record<Vs, number> & Record<`${Vs}_24h_change`, number | null>
  >;

export const useSimplePriceQuery = <Vs extends string>(
  id: string | string[],
  vs: string extends Vs ? never : Vs,
  initial: SimplePrice<Vs>
) => {

  return useQuery<SimplePrice<Vs>>(
    createPriceUrl(id, vs),
    (url) => fetch(url).then((r) => r.json()),
    { fallbackData: initial }
  );
};

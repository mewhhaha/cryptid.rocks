import { Vs } from "app/data/vs";

export const formatAmount = (n: number, vs: Vs) => {
  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: vs,
    minimumFractionDigits: 0,
  });
  return formatter.format(Math.floor(n));
};

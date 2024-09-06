import { Vs } from "app/types";

export const formatAmount = (n: number, vs: Vs, maximumFractionDigits = 0) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: vs,
    maximumFractionDigits,
  });
  return formatter.format(n);
};

export const formatPercentage = (n: number, direction = false) =>
  `${direction && n > 0 ? "+" : ""}${(n * 100).toFixed(2)}%`;

const longFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const shortFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "numeric",
});

export const formatDate = (date: Date, format: "long" | "short") => {
  switch (format) {
    case "long":
      return longFormatter.format(date);
    case "short":
      return shortFormatter.format(date);
  }
};

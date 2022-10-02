import { LineSvgProps, ResponsiveLine, PointTooltip } from "@nivo/line";
import { formatAmount, formatDate, withAbort } from "app/helpers";
import { Coin, Vs } from "app/types";
import { useState, useEffect } from "react";
import { ChartColorLabel } from "./ChartColorLabel";
import { ChartTooltip } from "./ChartTooltip";

type PriceHistory = {
  prices: [time: number, price: number][];
};

type PriceChartProps = {
  coin: Coin;
  vs: Vs;
};

export const ChartPriceHistory = ({ coin, vs }: PriceChartProps) => {
  const [history, setHistory] = useState<PriceHistory>();

  useEffect(() => {
    return withAbort(async (signal) => {
      const url = new URL(
        `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart`
      );
      url.searchParams.set("vs_currency", vs);
      url.searchParams.set("days", "4");
      url.searchParams.set("interval", "daily");

      const response = await fetch(url, { signal });
      const priceHistory = await response.json<PriceHistory>();
      setHistory(priceHistory);
    });
  }, [coin.id, vs]);

  return history === undefined ? (
    <></>
  ) : (
    <ResponsiveLine
      data={[
        {
          id: coin.name,
          color: "green",
          data: history.prices.map(([time, price]) => ({
            vs,
            x: formatDate(new Date(time), "short"),
            y: price,
          })),
        },
      ]}
      tooltip={Tooltip}
      {...lineConfig}
    />
  );
};

const lineConfig: Omit<LineSvgProps, "data"> = {
  colors: () => "rgb(249 115 22)",
  margin: { top: 50, right: 10, bottom: 50, left: 60 },
  xScale: { type: "point" },
  yScale: {
    type: "linear",
    min: "auto",
    max: "auto",
    stacked: true,
    reverse: false,
  },
  lineWidth: 8,
  yFormat: " >-.2f",
  axisTop: null,
  axisRight: null,
  axisBottom: {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
  },
  axisLeft: {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
  },
  pointSize: 16,
  pointColor: "white",
  pointBorderWidth: 2,
  pointBorderColor: { from: "serieColor" },
  pointLabelYOffset: -12,
  useMesh: true,
  theme: {
    textColor: "white",
    axis: {
      ticks: { text: { fontSize: 16 } },
    },
  },
};

const Tooltip: PointTooltip = ({ point }) => {
  // @ts-expect-error No type built in for passing this dat
  const vs: Vs = point.data.vs;
  return (
    <ChartTooltip>
      <div>
        <ChartColorLabel color={point.serieColor}>
          {point.serieId}
        </ChartColorLabel>
      </div>
      <div className="text-xl sm:text-2xl">
        {formatAmount(Number.parseFloat(point.data.y.toString()), vs, 2)}
      </div>
    </ChartTooltip>
  );
};

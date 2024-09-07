import {
  DefaultLink,
  DefaultNode,
  ResponsiveSankey,
  SankeyLinkDatum,
  SankeyNodeDatum,
  SankeySvgProps,
} from "@nivo/sankey";
import { Prices, Vs } from "app/types";
import { ChartColorLabel } from "./ChartColorLabel";
import { Portfolio } from "~/helpers/db.server";
import { formatAmount, formatPercentage } from "~/helpers/format";
import { getValuedAt } from "~/helpers/math";

type ChartPortfolioProps<T extends Vs> = {
  prices: Prices<T>;
  portfolios: Portfolio[];
  direction: "horizontal" | "vertical";
};

export const ChartPortfolio = <T extends Vs>({
  prices,
  portfolios,
  direction,
}: ChartPortfolioProps<T>) => {
  return (
    <ResponsiveSankey
      data={makeSankeyData(prices, portfolios)}
      labelOrientation={direction}
      linkTooltip={LinkTooltip}
      nodeTooltip={NodeTooltip}
      margin={
        direction === "horizontal"
          ? { top: 40, right: 140, bottom: 40, left: 100 }
          : { top: 100, right: 0, bottom: 140, left: 0 }
      }
      layout={direction}
      {...sankeyConfig}
    />
  );
};

const sankeyConfig: Omit<
  SankeySvgProps<DefaultNode, DefaultLink>,
  "width" | "height" | "data" | "linkTooltip" | "nodeTooltip"
> = {
  align: "justify",
  colors: { scheme: "set1" },
  nodeOpacity: 1,
  nodeHoverOthersOpacity: 0.35,
  nodeThickness: 18,
  nodeSpacing: 24,
  nodeBorderWidth: 0,
  nodeBorderColor: {
    from: "color",
    modifiers: [["brighter", 0.8]],
  },
  nodeBorderRadius: 3,
  linkOpacity: 0.5,
  linkHoverOthersOpacity: 0.1,
  linkContract: 3,
  enableLinkGradient: true,
  labelPosition: "outside",
  linkBlendMode: "lighten",
  labelPadding: 16,
  theme: {
    labels: { text: { fontWeight: "bold", fontSize: "16px" } },
  },
  labelTextColor: {
    from: "color",
    modifiers: [["darker", 1]],
  },
};

type SankeyNodeData = DefaultNode & {
  vs: Vs;
};

type SankeyLinkData = DefaultLink & {
  vs: Vs;
};

const LinkTooltip = ({
  link,
}: {
  link: SankeyLinkDatum<SankeyNodeData, SankeyLinkData>;
}) => {
  return (
    <Tooltip>
      <div className="flex flex-col space-x-0 sm:flex-row sm:items-center sm:space-x-4">
        <ChartColorLabel color={link.source.color}>
          {link.source.id}
        </ChartColorLabel>
        <span>~</span>
        <ChartColorLabel color={link.target.color}>
          {link.target.id}
        </ChartColorLabel>
      </div>
      <div className="flex flex-col space-x-0 text-xl sm:flex-row sm:items-end sm:space-x-1 sm:text-2xl">
        <span>{formatAmount(link.target.value, link.vs)}</span>
        <span className="text-lg text-gray-700">
          ({formatPercentage(link.target.value / link.source.value)})
        </span>
      </div>
    </Tooltip>
  );
};

const NodeTooltip = ({
  node,
}: {
  node: SankeyNodeDatum<SankeyNodeData, SankeyLinkData>;
}) => {
  return (
    <Tooltip>
      <div>
        <ChartColorLabel color={node.color}>{node.id}</ChartColorLabel>
      </div>
      <div className="text-xl sm:text-2xl">
        {formatAmount(node.value, node.vs)}
      </div>
    </Tooltip>
  );
};

type TooltipProps = { children: React.ReactNode };
const Tooltip = ({ children }: TooltipProps) => {
  return (
    <div className="rounded-md border bg-white p-4 text-2xl text-black">
      {children}
    </div>
  );
};

const makeSankeyData = <T extends Vs>(
  prices: Prices<T>,
  list: Portfolio[],
): { nodes: SankeyNodeData[]; links: SankeyLinkData[] } => {
  const nodes = [
    { id: "Portfolio", vs: prices.vs },
    ...list.map((c) => ({ id: c.name, vs: prices.vs })),
  ];
  const links = list
    .map((c) => {
      return {
        source: "Portfolio",
        target: c.name,
        value: getValuedAt(prices, c.coinId) * c.amount,
        vs: prices.vs,
      };
    })
    .filter((l) => l.value > 0);

  return { nodes, links };
};

type ChartTooltipProps = { children: React.ReactNode };
export const ChartTooltip = ({ children }: ChartTooltipProps) => {
  return (
    <div className="rounded-md border bg-white px-4 py-2 text-2xl text-black">
      {children}
    </div>
  );
};

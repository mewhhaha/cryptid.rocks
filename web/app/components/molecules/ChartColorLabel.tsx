type CharColorLabelProps = {
  color: string;
  children: React.ReactNode;
};

export const ChartColorLabel = ({ color, children }: CharColorLabelProps) => {
  return (
    <span className="text-lg">
      <span
        className="mr-1 inline-block h-4 w-4 rounded-sm"
        style={{ backgroundColor: color }}
      />

      {children}
    </span>
  );
};

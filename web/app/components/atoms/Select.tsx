import { cx } from "app/helpers/cx";

type SelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;

export const Select = (props: SelectProps) => {
  return (
    <select
      {...props}
      className={cx(
        "w-full border-none py-2 pl-3 pr-10 text-sm rounded-lg leading-5 text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300",
        props.className
      )}
    />
  );
};

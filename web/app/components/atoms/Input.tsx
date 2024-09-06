import { cx } from "app/helpers/cx";

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const Input = (props: InputProps) => {
  return (
    <input
      {...props}
      className={cx(
        "w-full rounded-lg border px-3 py-2 text-sm leading-5 text-gray-900",
        props.className,
      )}
    />
  );
};

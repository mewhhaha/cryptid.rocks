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
        "w-full border py-2 px-3 text-sm rounded-lg leading-5 text-gray-900",
        props.className
      )}
    />
  );
};

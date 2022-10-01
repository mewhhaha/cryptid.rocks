type FieldProps = {
  title: string;
  htmlFor: string;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const Field = ({ title, children, htmlFor, ...rest }: FieldProps) => {
  return (
    <div {...rest}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700"
      >
        {title}
      </label>
      {children}
    </div>
  );
};

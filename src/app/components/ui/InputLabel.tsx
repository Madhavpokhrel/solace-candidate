import { twMerge } from "tailwind-merge";

type Props = React.ComponentPropsWithoutRef<"label">;

const InputLabel = ({ htmlFor, className, children }: Props) => {
  return (
    <label
      htmlFor={htmlFor}
      className={twMerge(
        "mb-2 block text-sm font-medium text-gray-900",
        className
      )}
    >
      {children}
    </label>
  );
};

export default InputLabel;

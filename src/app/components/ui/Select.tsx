import { twMerge } from "tailwind-merge";

type Props = React.ComponentPropsWithoutRef<"select"> & {
  showLabel?: boolean;
  defaultLabel?: string;
};

const Select = ({
  showLabel = true,
  defaultLabel = "Select Option",
  className,
  children,
  ...props
}: Props) => {
  return (
    <select
      className={twMerge(
        "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500",
        className
      )}
      {...props}
    >
      {showLabel && <option value="">{defaultLabel}</option>}

      {children}
    </select>
  );
};

export default Select;

import { twMerge } from "tailwind-merge";

type ButtonProps = React.ComponentPropsWithoutRef<"button">;

const Button = ({
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={twMerge(
        "flex justify-center rounded-md bg-blue-700 px-2 pb-1.5 pt-2 text-sm font-medium text-white transition duration-300 hover:cursor-pointer hover:bg-blue-800",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

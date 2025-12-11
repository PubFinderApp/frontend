import { cn } from "@/lib/utils";

export type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "destructive";
};

export const Alert = ({ className, variant = "default", ...props }: AlertProps) => (
  <div
    role="alert"
    className={cn(
      "rounded-2xl border p-4 text-sm",
      variant === "default" && "border-stone-200 bg-stone-50 text-stone-700",
      variant === "destructive" && "border-red-200 bg-red-50 text-red-700",
      className
    )}
    {...props}
  />
);

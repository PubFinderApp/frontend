import * as React from "react";
import { cn } from "@/lib/utils";

export type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
};

export const Slot = React.forwardRef<HTMLElement, SlotProps>(({ children, className, ...props }, ref) => {
  if (!React.isValidElement(children)) {
    return null;
  }

  return React.cloneElement(children as React.ReactElement, {
    ...props,
    ref,
    className: cn((children.props as { className?: string }).className, className),
  });
});
Slot.displayName = "Slot";

import * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  onIconClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, onIconClick, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            ` flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${icon ? "pr-10" : ""}`,
            className,
          )}
          ref={ref}
          {...props}
        />
        <div>
          {icon && (
            <div className={`absolute item right-3 top-1/2 -translate-y-1/2 ${onIconClick ? "cursor-pointer" : ""}`} onClick={onIconClick}>
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };

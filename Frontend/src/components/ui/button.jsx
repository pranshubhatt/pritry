import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Button = forwardRef(({ className, type = "button", disabled, children, ...props }, ref) => {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        "h-9 px-4 py-2",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button }; 
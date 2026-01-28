import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:flex-none [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-button-background text-button-foreground border border-button-border shadow hover:opacity-90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-button-border bg-background text-foreground-primary shadow-sm hover:bg-accent hover:text-background",
        secondary:
          "bg-card text-card-foreground border border-card-border shadow-sm hover:bg-card/80",
        ghost: "hover:bg-accent hover:text-background",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "px-6 py-3 font-semibold [&_svg]:h-6 [&_svg]:w-6",
        sm: "h-8 rounded-md px-3 text-sm [&_svg]:h-4 [&_svg]:w-4",
        lg: "h-10 rounded-md px-8 py-4 text-md font-semibold [&_svg]:h-6 [&_svg]:w-6",
        icon: "h-9 w-9 [&_svg]:h-5 [&_svg]:w-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

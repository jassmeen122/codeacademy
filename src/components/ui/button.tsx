
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium font-heading ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "edu-btn-primary",
        destructive:
          "bg-destructive text-destructive-foreground shadow-edu-sm hover:bg-destructive/90 hover:shadow-edu-md",
        outline:
          "border border-primary bg-background text-primary shadow-edu-sm hover:bg-primary hover:text-primary-foreground hover:shadow-edu-md",
        secondary:
          "bg-secondary text-secondary-foreground shadow-edu-sm hover:bg-secondary/80 hover:shadow-edu-md",
        ghost: "hover:bg-accent/10 hover:text-accent transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline font-medium",
        accent: "edu-btn-accent",
        success: "bg-success text-success-foreground shadow-edu-sm hover:bg-success/90 hover:shadow-edu-md",
        warning: "bg-warning text-warning-foreground shadow-edu-sm hover:bg-warning/90 hover:shadow-edu-md",
        info: "bg-info text-info-foreground shadow-edu-sm hover:bg-info/90 hover:shadow-edu-md",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
        xs: "h-8 px-3 text-xs",
        xl: "h-14 px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

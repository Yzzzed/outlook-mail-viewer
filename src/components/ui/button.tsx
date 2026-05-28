import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border-0 text-label-md font-medium whitespace-nowrap transition-all duration-300 ease-md-standard outline-none select-none focus-visible:ring-2 focus-visible:ring-md-primary focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-md-primary text-md-on-primary hover:bg-md-primary/90 active:bg-md-primary/80 md-elevation-0 hover:md-elevation-2",
        tonal: "bg-md-secondary-container text-md-on-secondary-container hover:bg-md-secondary-container/90 active:bg-md-secondary-container/80 md-elevation-0 hover:md-elevation-1",
        outline:
          "border border-md-outline text-md-primary hover:bg-md-primary/5 active:bg-md-primary/10",
        ghost:
          "text-md-primary hover:bg-md-primary/10 active:bg-md-primary/5",
        destructive:
          "bg-md-error text-md-on-error hover:bg-md-error/90 active:bg-md-error/80 md-elevation-0 hover:md-elevation-2",
        link: "text-md-primary underline-offset-4 hover:underline rounded-none",
      },
      size: {
        default: "h-10 gap-2 px-6",
        xs: "h-8 gap-1.5 px-4 text-xs",
        sm: "h-9 gap-1.5 px-5 text-sm",
        lg: "h-12 gap-2 px-8 text-base",
        icon: "size-10",
        "icon-xs": "size-8",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

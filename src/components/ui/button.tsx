import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-accent text-white hover:bg-accent/90',
        ghost: 'text-sub hover:bg-panel2 hover:text-ink',
        outline: 'border border-line bg-transparent text-sub hover:bg-panel2 hover:text-ink',
        subtle: 'bg-panel2 text-sub hover:text-ink',
      },
      size: { default: 'h-9 px-3', sm: 'h-8 px-2.5 text-xs', icon: 'h-8 w-8' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
})
Button.displayName = 'Button'

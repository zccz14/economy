import * as React from 'react'
import { cn } from '@/lib/utils'
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...p }, ref) => (
  <input ref={ref} className={cn('h-9 w-full rounded-md border border-line bg-panel2 px-3 text-sm text-ink placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-accent/50', className)} {...p} />
))
Input.displayName = 'Input'

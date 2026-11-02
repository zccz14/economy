import * as React from 'react'
import * as DM from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'
export const DropdownMenu = DM.Root
export const DropdownMenuTrigger = DM.Trigger
export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DM.Content>,
  React.ComponentPropsWithoutRef<typeof DM.Content>
>(({ className, sideOffset = 6, ...p }, ref) => (
  <DM.Portal>
    <DM.Content ref={ref} sideOffset={sideOffset} className={cn('z-50 min-w-[8rem] rounded-md border border-line bg-panel2 p-1 shadow-xl', className)} {...p} />
  </DM.Portal>
))
DropdownMenuContent.displayName = 'DropdownMenuContent'
export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DM.Item>,
  React.ComponentPropsWithoutRef<typeof DM.Item>
>(({ className, ...p }, ref) => (
  <DM.Item ref={ref} className={cn('cursor-pointer rounded-sm px-3 py-1.5 text-sm text-sub outline-none data-[highlighted]:bg-panel data-[highlighted]:text-ink', className)} {...p} />
))
DropdownMenuItem.displayName = 'DropdownMenuItem'

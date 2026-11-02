import * as React from 'react'
import { cn } from '@/lib/utils'
export function Badge({ className, tone = 'default', ...p }: React.HTMLAttributes<HTMLSpanElement> & { tone?: 'default' | 'high' | 'mid' | 'low' }) {
  const tones = { default: 'border-line text-sub', high: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10', mid: 'border-amber-500/40 text-amber-300 bg-amber-500/10', low: 'border-rose-500/40 text-rose-300 bg-rose-500/10' }
  return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] leading-4', tones[tone], className)} {...p} />
}

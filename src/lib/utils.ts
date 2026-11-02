import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

export function fmt(n: number | null | undefined, digits = 2, suffix = ''): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  return n.toFixed(digits) + suffix
}
export function fmtPct(n: number | null | undefined, digits = 1): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  return (n * 100).toFixed(digits) + '%'
}
export function fmtCap(bn: number | null | undefined): string {
  if (bn === null || bn === undefined) return '—'
  if (bn >= 1000) return (bn / 1000).toFixed(2) + 'T'
  return bn.toFixed(0) + 'B'
}
export function relTone(v: number | null | undefined) {
  if (v === null || v === undefined) return 'text-dim'
  if (v < 0.6) return 'text-emerald-400'
  if (v < 0.95) return 'text-sky-300'
  if (v <= 1.15) return 'text-ink'
  if (v <= 2) return 'text-amber-300'
  return 'text-rose-300'
}

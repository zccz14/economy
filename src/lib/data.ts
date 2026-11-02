import { useQuery } from '@tanstack/react-query'
import type { EcoData } from './types'

export async function fetchEco(): Promise<EcoData> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/eco.json`, { cache: 'no-cache' })
  if (!res.ok) throw new Error(`failed to load data: ${res.status}`)
  return (await res.json()) as EcoData
}

export function useEco() {
  return useQuery({ queryKey: ['eco'], queryFn: fetchEco, staleTime: 5 * 60 * 1000 })
}

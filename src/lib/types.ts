export type Lang = 'zh' | 'en'

export interface NodeStats {
  companies: number
  mcap_usd_bn?: number | null
  leader_ticker?: string | null
  leader_name?: string | null
  leader_share?: number | null
  pe_median?: number | null
  pe_weighted?: number | null
  ps_weighted?: number | null
}

export interface EcoNode {
  code: string
  name_zh: string
  name_en: string
  level: string
  parent: string | null
  def_zh: string
  stats: NodeStats
}

export interface LinkW { node: string; w: number }
export interface Segment { name: string; pct: number | null }

export interface Company {
  ticker: string
  name_zh: string
  name_en: string
  node: string | null
  node2: string | null
  sector_zh: string
  sector_en: string
  country_zh: string
  country_en: string
  exchange: string | null
  isin: string | null
  currency: string
  industry: string | null
  employees: string | null
  founded: string | null
  mcap_usd_bn: number
  pe: number | null
  ps: number | null
  ev_ebitda: number | null
  pb: number | null
  roe: number | null
  beta: number | null
  rel_leader_pe: number | null
  rel_node_pe: number | null
  rel_market_pe: number | null
  leader_pe: number | null
  gross_margin: number | null
  cogs_ratio: number | null
  capex_ratio: number | null
  asset_mix: {
    financial: number | null
    ppe: number | null
    goodwill_intangible: number | null
    inventory: number | null
  }
  revenue_segments: Segment[]
  downstream: LinkW[]
  upstream: LinkW[]
  biz_zh: string
  asset_note_zh: string
  expense_note_zh: string
  confidence: string
  revenue_cur_m: number | null
  assets_cur_m: number | null
  fy_end: string | null
}

export interface EcoEdge { from: string; to: string; type: 'supply' | 'demand'; usd_bn: number }

export interface EcoMeta {
  version: string
  as_of: string
  universe_zh: string
  universe_en: string
  market_anchor: { pe_weighted: number; pe_median: number; ps_median: number; ev_ebitda_median: number }
  fx: Record<string, number>
  fx_date: string
  sources_zh: string[]
  notes_zh: string
}

export interface EcoData {
  meta: EcoMeta
  nodes: EcoNode[]
  companies: Company[]
  edges: EcoEdge[]
}

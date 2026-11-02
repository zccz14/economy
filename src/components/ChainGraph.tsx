import { useMemo, useState } from 'react'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useI18n } from '@/lib/i18n'
import { fmtCap } from '@/lib/utils'
import type { EcoData, EcoEdge, EcoNode, Lang } from '@/lib/types'

const SECTOR_COLOR: Record<string, string> = {
  TEC: '#2f6fdb', COM: '#7c5cd6', HLT: '#2f9e8f', FIN: '#c9a227', ENE: '#b45309',
  CON: '#c4527f', STP: '#8a6d3b', IND: '#4a8fa8', MAT: '#35946e', UTL: '#7a5cc4',
  RES: '#6b7280', DEM: '#c8822b',
}
const GAP_X = 46, GAP_Y = 16, PAD = 28, BOX_H = 54

interface Props {
  data: EcoData
  lang: Lang
  selectedNode: string | null
  onSelectNode: (code: string | null) => void
}

export function ChainGraph({ data, lang, selectedNode, onSelectNode }: Props) {
  const { t } = useI18n()
  const [sector, setSector] = useState<string>('TEC')
  const [onlyCovered, setOnlyCovered] = useState(true)
  const [minFlow, setMinFlow] = useState(5)
  const [zoom, setZoom] = useState(1)
  const [hover, setHover] = useState<string | null>(null)

  const nodeMap = useMemo(() => new Map(data.nodes.map((n) => [n.code, n])), [data.nodes])
  const l2 = useMemo(() => data.nodes.filter((n) => n.level === 'L2'), [data.nodes])
  const sectors = useMemo(() => {
    const s = new Set<string>()
    l2.forEach((n) => { if (n.parent && n.parent !== 'DEM') s.add(n.parent) })
    return Array.from(s).sort()
  }, [l2])

  const nm = (n: EcoNode) => (lang === 'zh' ? n.name_zh : n.name_en)

  const { visibleNodes, visibleEdges, layout } = useMemo(() => {
    const vis = l2.filter((n) => {
      const inSector = sector === 'ALL' ? true : n.parent === sector || n.parent === 'DEM'
      // 最终需求节点是产业链终点锚，不持有公司也必须显示
      const covered = onlyCovered ? (n.stats.companies > 0 || n.parent === 'DEM') : true
      return inSector && covered
    })
    const codes = new Set(vis.map((n) => n.code))
    const edges = data.edges.filter((e) => codes.has(e.from) && codes.has(e.to) && e.usd_bn >= minFlow && e.from !== e.to)
    // 最长路径分层（环安全：迭代上限 = 节点数）
    const depth = new Map<string, number>(vis.map((n) => [n.code, 0]))
    for (let i = 0; i < vis.length; i++) {
      let changed = false
      for (const e of edges) {
        const cand = (depth.get(e.from) ?? 0) + 1
        if (cand > (depth.get(e.to) ?? 0) && cand <= vis.length) { depth.set(e.to, cand); changed = true }
      }
      if (!changed) break
    }
    const maxDepth = Math.max(0, ...Array.from(depth.values()))
    const cols: EcoNode[][] = Array.from({ length: maxDepth + 1 }, () => [])
    vis.forEach((n) => cols[depth.get(n.code) ?? 0].push(n))
    const maxCap = Math.max(1, ...vis.map((n) => n.stats.mcap_usd_bn ?? 0))
    const boxW = (n: EcoNode) => Math.round(128 + 92 * Math.sqrt((n.stats.mcap_usd_bn ?? 0) / maxCap))
    cols.forEach((col) => col.sort((a, b) => (a.parent === 'DEM' ? 1 : 0) - (b.parent === 'DEM' ? 1 : 0) || (b.stats.mcap_usd_bn ?? 0) - (a.stats.mcap_usd_bn ?? 0)))
    const colW = cols.map((c) => Math.max(120, ...c.map(boxW)))
    const colH = cols.map((c) => c.length * (BOX_H + GAP_Y) - GAP_Y)
    const H = Math.max(...colH, 120) + PAD * 2
    const pos = new Map<string, { x: number; y: number; w: number; h: number; col: number }>()
    let x = PAD
    cols.forEach((col, ci) => {
      const startY = PAD + (H - PAD * 2 - colH[ci]) / 2
      col.forEach((n, i) => {
        pos.set(n.code, { x, y: startY + i * (BOX_H + GAP_Y), w: boxW(n), h: BOX_H, col: ci })
      })
      x += colW[ci] + GAP_X
    })
    return { visibleNodes: vis, visibleEdges: edges, layout: { pos, W: x - GAP_X + PAD, H, cols } }
  }, [data.edges, l2, sector, onlyCovered, minFlow])

  const { pos, W, H } = layout
  const active = hover ?? selectedNode
  const maxFlow = Math.max(1, ...visibleEdges.map((e) => e.usd_bn))
  const stroke = (e: EcoEdge) => 0.8 + 6.4 * Math.sqrt(e.usd_bn / maxFlow)

  const edgePath = (e: EcoEdge) => {
    const a = pos.get(e.from), b = pos.get(e.to)
    if (!a || !b) return ''
    if (a.col === b.col) {
      const y = Math.max(a.y + a.h, b.y + b.h) + 12
      return `M${a.x + a.w / 2},${a.y + a.h} C${a.x + a.w / 2},${y} ${b.x + b.w / 2},${y} ${b.x + b.w / 2},${b.y + b.h}`
    }
    const sx = a.x + a.w, sy = a.y + a.h / 2, ex = b.x, ey = b.y + b.h / 2
    const mx = (sx + ex) / 2
    return `M${sx},${sy} C${mx},${sy} ${mx},${ey} ${ex},${ey}`
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{t('chain.title')}</h2>
          <p className="mt-0.5 text-xs text-dim">{t('chain.desc')} · {t('chain.note')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger className="w-[11rem]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t('chain.all')}</SelectItem>
              {sectors.map((s) => (
                <SelectItem key={s} value={s}>{nodeMap.get(s)?.[lang === 'zh' ? 'name_zh' : 'name_en'] ?? s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(minFlow)} onValueChange={(v) => setMinFlow(Number(v))}>
            <SelectTrigger className="w-[10rem]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[0, 5, 20, 50, 100].map((v) => <SelectItem key={v} value={String(v)}>{`${t('chain.minFlow')} ≥ ${v}B`}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant={onlyCovered ? 'default' : 'outline'} size="sm" onClick={() => setOnlyCovered((v) => !v)}>
            {t('chain.onlyCovered')}
          </Button>
          <div className="flex items-center gap-1 rounded-md border border-line">
            <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.15).toFixed(2)))} aria-label={t('chain.zoomOut')}><Minus className="h-4 w-4" /></Button>
            <span className="num w-10 text-center text-xs text-dim">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.min(2, +(z + 0.15).toFixed(2)))} aria-label={t('chain.zoomIn')}><Plus className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => setZoom(1)} aria-label={t('chain.reset')}><RotateCcw className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </div>

      <div className="overflow-auto rounded-xl border border-line bg-panel">
        {visibleNodes.length === 0 ? (
          <div className="p-10 text-center text-sm text-dim">{t('chain.empty')}</div>
        ) : (
          <svg width={W * zoom} height={H * zoom} viewBox={`0 0 ${W} ${H}`} className="block">
            {visibleEdges.map((e, i) => {
              const isActive = active && (e.from === active || e.to === active)
              return (
                <path
                  key={i}
                  d={edgePath(e)}
                  fill="none"
                  stroke={e.type === 'supply' ? '#4b6ea8' : '#8a6fb0'}
                  strokeWidth={stroke(e)}
                  opacity={active ? (isActive ? 0.85 : 0.08) : 0.34}
                />
              )
            })}
            {visibleNodes.map((n) => {
              const p = pos.get(n.code)
              if (!p) return null
              const color = SECTOR_COLOR[n.parent ?? ''] ?? '#3b4a66'
              const isSel = selectedNode === n.code
              const lead = n.stats.leader_name ?? '—'
              const sub = `${lead} · ${fmtCap(n.stats.mcap_usd_bn)} · ${n.stats.companies} ${lang === 'zh' ? '家' : 'co.'}`
              const maxChars = Math.floor((p.w - 20) / (lang === 'zh' ? 7.6 : 6.6))
              const clipped = sub.length > maxChars ? sub.slice(0, maxChars - 1) + '…' : sub
              return (
                <g key={n.code} onMouseEnter={() => setHover(n.code)} onMouseLeave={() => setHover(null)}
                   onClick={() => onSelectNode(isSel ? null : n.code)} className="cursor-pointer">
                  <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={9}
                        fill={color} opacity={isSel ? 0.3 : 0.16}
                        stroke={isSel ? '#e8eefc' : color} strokeWidth={isSel ? 2 : 1.5} />
                  <text x={p.x + 10} y={p.y + 21} fill="#e8eefc" fontSize={13} fontWeight={600}>{nm(n)}</text>
                  <text x={p.x + 10} y={p.y + 39} fill="#9db2d6" fontSize={10.5}>{clipped}</text>
                  <text x={p.x + 10} y={p.y + 50} fill="#6d80a3" fontSize={9.5}>
                    PE {n.stats.pe_weighted ?? '—'} · {n.code}
                  </text>
                </g>
              )
            })}
          </svg>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-[11px] text-dim">
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-6 bg-[#4b6ea8]" />{t('chain.legend.supply')}</span>
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-6 bg-[#8a6fb0]" />{t('chain.legend.demand')}</span>
        {Object.entries(SECTOR_COLOR).filter(([k]) => k !== 'DEM').map(([k, v]) => (
          <span key={k} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: v, opacity: 0.6 }} />
            {nodeMap.get(k)?.[lang === 'zh' ? 'name_zh' : 'name_en'] ?? k}
          </span>
        ))}
      </div>
    </div>
  )
}

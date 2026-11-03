import { useEffect, useMemo, useState } from 'react'
import {
  createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel,
  useReactTable, type SortingState,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n'
import { fmt, fmtCap, fmtPct, relTone } from '@/lib/utils'
import type { Company, EcoData, Lang } from '@/lib/types'

const h = createColumnHelper<Company>()

export function ComparisonTable({
  data, lang, onSelectCompany, onSelectNode,
}: { data: EcoData; lang: Lang; onSelectCompany: (t: string) => void; onSelectNode: (c: string) => void }) {
  const { t } = useI18n()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'mcap_usd_bn', desc: true }])
  const [q, setQ] = useState('')
  const [sector, setSector] = useState('ALL')
  const [node, setNode] = useState('ALL')

  const nodeMap = useMemo(() => new Map(data.nodes.map((n) => [n.code, n])), [data.nodes])
  const sectors = useMemo(() => {
    const s = new Set(data.companies.map((c) => c.sector_zh))
    return Array.from(s).sort()
  }, [data.companies])
  const nodeOptions = useMemo(() => {
    const codes = new Set(data.companies.map((c) => c.node).filter(Boolean) as string[])
    return Array.from(codes).sort((a, b) => (nodeMap.get(a)?.stats.mcap_usd_bn ?? 0) < (nodeMap.get(b)?.stats.mcap_usd_bn ?? 0) ? 1 : -1)
  }, [data.companies, nodeMap])

  const rows = useMemo(() => data.companies.filter((c) => {
    if (sector !== 'ALL' && c.sector_zh !== sector) return false
    if (node !== 'ALL' && c.node !== node) return false
    if (q) {
      const s = q.toLowerCase()
      return c.name_zh.toLowerCase().includes(s) || c.name_en.toLowerCase().includes(s) || c.ticker.toLowerCase().includes(s)
    }
    return true
  }), [data.companies, sector, node, q])

  const nodeName = (code: string | null) => {
    if (!code) return '—'
    const n = nodeMap.get(code)
    return n ? (lang === 'zh' ? n.name_zh : n.name_en) : code
  }
  const relCell = (v: number | null) => (
    <span className={`num ${relTone(v)}`}>{v === null ? '—' : `${v.toFixed(2)}×`}</span>
  )

  const columns = useMemo(() => [
    h.accessor('name_zh', {
      id: 'name',
      header: t('cmp.col.company'),
      cell: (info) => {
        const c = info.row.original
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-ink">{lang === 'zh' ? c.name_zh : c.name_en}</span>
            <span className="num text-[11px] text-dim">{c.ticker}</span>
          </div>
        )
      },
    }),
    h.accessor('node', {
      id: 'node',
      header: t('cmp.col.node'),
      cell: (info) => (
        <button className="text-left text-sub hover:text-ink" onClick={(e) => { e.stopPropagation(); onSelectNode(info.getValue() ?? '') }}>
          {nodeName(info.getValue())}
        </button>
      ),
    }),
    h.accessor('mcap_usd_bn', { header: t('cmp.col.mcap'), cell: (i) => <span className="num text-sub">{fmtCap(i.getValue())}</span> }),
    h.accessor('pe', { header: t('cmp.col.pe'), cell: (i) => <span className="num">{fmt(i.getValue(), 1)}</span> }),
    h.accessor('ps', { header: t('cmp.col.ps'), cell: (i) => <span className="num">{fmt(i.getValue(), 2)}</span> }),
    h.accessor('ev_ebitda', { header: t('cmp.col.ev'), cell: (i) => <span className="num">{fmt(i.getValue(), 1)}</span> }),
    h.accessor('rel_leader_pe', { header: t('cmp.col.vsLeader'), cell: (i) => relCell(i.getValue()) }),
    h.accessor('rel_node_pe', { header: t('cmp.col.vsNode'), cell: (i) => relCell(i.getValue()) }),
    h.accessor('rel_market_pe', { header: t('cmp.col.vsMarket'), cell: (i) => relCell(i.getValue()) }),
    h.accessor('gross_margin', { header: t('cmp.col.gm'), cell: (i) => <span className="num text-sub">{fmtPct(i.getValue())}</span> }),
    h.accessor('capex_ratio', { header: t('cmp.col.capex'), cell: (i) => <span className="num text-sub">{fmtPct(i.getValue())}</span> }),
    h.accessor('confidence', {
      header: t('cmp.col.confidence'),
      cell: (i) => {
        const v = i.getValue()
        const tone = v === '高' ? 'high' : (v === '中' || v === '模板') ? 'mid' : 'low'
        return <Badge tone={tone}>{v || '—'}</Badge>
      },
      enableSorting: false,
    }),
  ], [lang, nodeMap, t, onSelectNode])

  const [pageSize, setPageSize] = useState(50)
  const table = useReactTable({
    data: rows, columns, state: { sorting },
    onSortingChange: setSorting,
    initialState: { pagination: { pageSize: 50, pageIndex: 0 } },
    getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  useEffect(() => { table.setPageSize(pageSize) }, [pageSize, table])

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{t('cmp.title')}</h2>
          <p className="mt-0.5 text-xs text-dim">{t('cmp.desc')} · {t('cmp.notComparable')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('cmp.search')} className="w-52" />
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger className="w-[9.5rem]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{lang === 'zh' ? '全部板块' : 'All sectors'}</SelectItem>
              {sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={node} onValueChange={setNode}>
            <SelectTrigger className="w-[11rem]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{lang === 'zh' ? '全部节点' : 'All nodes'}</SelectItem>
              {nodeOptions.map((c) => <SelectItem key={c} value={c}>{nodeName(c)}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="num text-xs text-dim">{rows.length} {t('cmp.rows')}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-panel">
        <table className="w-full border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-line">
                {hg.headers.map((header) => {
                  const sorted = header.column.getIsSorted()
                  return (
                    <th key={header.id} className="whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-dim">
                      {header.column.getCanSort() ? (
                        <button className="inline-flex items-center gap-1 hover:text-sub" onClick={header.column.getToggleSortingHandler()}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === 'asc' ? <ArrowUp className="h-3 w-3" /> : sorted === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ChevronsUpDown className="h-3 w-3 opacity-40" />}
                        </button>
                      ) : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-line/60">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} onClick={() => onSelectCompany(row.original.ticker)}
                  className="cursor-pointer transition-colors hover:bg-panel2/70">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="whitespace-nowrap px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-dim">
        <div className="flex items-center gap-2">
          <span className="num">{table.getState().pagination.pageIndex + 1} / {Math.max(1, table.getPageCount())}</span>
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span>{lang === 'zh' ? '每页' : 'per page'}</span>
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="h-8 w-[5.5rem]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[25, 50, 100, 200].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="num">{rows.length} {t('cmp.rows')}</span>
        </div>
      </div>
    </div>
  )
}

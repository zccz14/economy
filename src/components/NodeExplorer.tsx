import { useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { fmt, fmtCap, fmtPct } from '@/lib/utils'
import type { EcoData, Lang } from '@/lib/types'

export function NodeExplorer({ data, lang, onSelectNode }: { data: EcoData; lang: Lang; onSelectNode: (c: string) => void }) {
  const { t } = useI18n()
  const [parent, setParent] = useState('ALL')
  const nodeMap = useMemo(() => new Map(data.nodes.map((n) => [n.code, n])), [data.nodes])
  const parents = useMemo(() => Array.from(new Set(data.nodes.filter((n) => n.level === 'L2').map((n) => n.parent!))), [data.nodes])
  const rows = useMemo(() => data.nodes
    .filter((n) => n.level === 'L2' && (parent === 'ALL' || n.parent === parent))
    .sort((a, b) => (b.stats.mcap_usd_bn ?? 0) - (a.stats.mcap_usd_bn ?? 0)), [data.nodes, parent])

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{t('nodes.title')}</h2>
          <p className="mt-0.5 text-xs text-dim">{t('nodes.desc')}</p>
        </div>
        <Select value={parent} onValueChange={setParent}>
          <SelectTrigger className="w-[11rem]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{lang === 'zh' ? '全部板块' : 'All sectors'}</SelectItem>
            {parents.map((p) => <SelectItem key={p} value={p}>{nodeMap.get(p)?.[lang === 'zh' ? 'name_zh' : 'name_en'] ?? p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-line bg-panel">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wide text-dim">
              <th className="px-3 py-2.5 text-left font-medium">{t('nodes.col.name')}</th>
              <th className="px-3 py-2.5 text-left font-medium">{t('nodes.col.code')}</th>
              <th className="px-3 py-2.5 text-right font-medium">{t('nodes.col.count')}</th>
              <th className="px-3 py-2.5 text-right font-medium">{t('nodes.col.mcap')}</th>
              <th className="px-3 py-2.5 text-left font-medium">{t('nodes.col.leader')}</th>
              <th className="px-3 py-2.5 text-right font-medium">{t('nodes.col.share')}</th>
              <th className="px-3 py-2.5 text-right font-medium">{t('nodes.col.pe')}</th>
              <th className="px-3 py-2.5 text-right font-medium">{t('nodes.col.peMedian')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {rows.map((n) => (
              <tr key={n.code} onClick={() => onSelectNode(n.code)} className="cursor-pointer hover:bg-panel2/70">
                <td className="px-3 py-2 font-medium text-ink">{lang === 'zh' ? n.name_zh : n.name_en}</td>
                <td className="num px-3 py-2 text-[11px] text-dim">{n.code}</td>
                <td className="num px-3 py-2 text-right text-sub">{n.stats.companies || '—'}</td>
                <td className="num px-3 py-2 text-right text-sub">{fmtCap(n.stats.mcap_usd_bn)}</td>
                <td className="px-3 py-2 text-sub">{n.stats.leader_name ?? '—'}</td>
                <td className="num px-3 py-2 text-right text-sub">{fmtPct(n.stats.leader_share, 0)}</td>
                <td className="num px-3 py-2 text-right">{fmt(n.stats.pe_weighted, 1)}</td>
                <td className="num px-3 py-2 text-right text-dim">{fmt(n.stats.pe_median, 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

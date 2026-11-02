import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { fmt, fmtCap, fmtPct, relTone } from '@/lib/utils'
import type { Company, EcoData, Lang } from '@/lib/types'

function Bar({ label, value, max = 1, tone = '#2f6fdb', right }: { label: string; value: number | null; max?: number; tone?: string; right?: string }) {
  const w = value === null ? 0 : Math.max(0, Math.min(1, value / max)) * 100
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2 text-[11.5px]">
        <span className="truncate text-sub">{label}</span>
        <span className="num shrink-0 text-dim">{right ?? fmtPct(value)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-panel2">
        <div className="h-full rounded-full" style={{ width: `${w}%`, background: tone }} />
      </div>
    </div>
  )
}
function RelRow({ label, v }: { label: string; v: number | null }) {
  const w = v === null ? 0 : Math.min(1, v / 3) * 100
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between text-[11.5px]">
        <span className="text-sub">{label}</span>
        <span className={`num ${relTone(v)}`}>{v === null ? '—' : `${v.toFixed(2)}×`}</span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-panel2">
        <div className="h-full rounded-full bg-current opacity-70" style={{ width: `${w}%`, color: v && v < 1 ? '#34d399' : v && v > 1.15 ? '#fb923c' : '#7dd3fc' }} />
        <div className="absolute inset-y-0 w-px bg-ink/50" style={{ left: '33.3%' }} title="1.0×" />
      </div>
    </div>
  )
}

export function CompanyPanel({
  data, company, lang, onClose, onSelectNode,
}: { data: EcoData; company: Company; lang: Lang; onClose: () => void; onSelectNode: (c: string) => void }) {
  const { t } = useI18n()
  const nodeMap = new Map(data.nodes.map((n) => [n.code, n]))
  const nname = (code: string) => {
    const n = nodeMap.get(code)
    return n ? (lang === 'zh' ? n.name_zh : n.name_en) : code
  }
  const tone = company.confidence === '高' ? 'high' : company.confidence === '中' ? 'mid' : 'low'
  const cur = company.currency

  return (
    <aside className="fixed right-0 top-0 z-40 h-full w-[440px] max-w-[92vw] overflow-y-auto border-l border-line bg-panel/98 backdrop-blur">
      <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-line bg-panel/95 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">{lang === 'zh' ? company.name_zh : company.name_en}</h3>
            <span className="num text-xs text-dim">{company.ticker}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-dim">
            <span>{company.exchange}</span><span>·</span>
            <span>{lang === 'zh' ? company.country_zh : company.country_en}</span><span>·</span>
            <span className="num">{fmtCap(company.mcap_usd_bn)}</span>
            <button className="chip ml-1 hover:text-ink" onClick={() => company.node && onSelectNode(company.node)}>{nname(company.node ?? '')}</button>
            {company.node2 && <button className="chip hover:text-ink" onClick={() => onSelectNode(company.node2!)}>{nname(company.node2)}</button>}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label={t('node.close')}><X className="h-4 w-4" /></Button>
      </div>

      <div className="space-y-5 px-5 py-4">
        <section>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-dim">{t('co.valuation')}</div>
          <div className="grid grid-cols-4 gap-2">
            {[['PE', company.pe], ['PS', company.ps], ['EV/EBITDA', company.ev_ebitda], ['PB', company.pb]].map(([k, v]) => (
              <div key={k as string} className="rounded-lg border border-line bg-panel2 px-2 py-1.5">
                <div className="text-[10px] text-dim">{k as string}</div>
                <div className="num text-sm">{fmt(v as number | null, 1)}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-2.5">
            <RelRow label={`${t('cmp.col.vsLeader')} · PE`} v={company.rel_leader_pe} />
            <RelRow label={`${t('cmp.col.vsNode')} · PE`} v={company.rel_node_pe} />
            <RelRow label={`${t('cmp.col.vsMarket')} · PE`} v={company.rel_market_pe} />
          </div>
        </section>

        <section>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-dim">{t('co.revenue')}</div>
          <div className="space-y-2">
            {company.revenue_segments.slice(0, 7).map((s) => (
              <Bar key={s.name} label={s.name} value={s.pct} tone="#3b82f6" right={fmtPct(s.pct)} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-dim">{t('co.downstream')} / {t('co.upstream')}</div>
          <div className="space-y-2 text-[12px]">
            <div className="flex flex-wrap gap-1.5">
              {company.downstream.map((d) => (
                <button key={d.node} className="chip hover:text-ink" onClick={() => onSelectNode(d.node)}>
                  {nname(d.node)} <span className="num text-dim">{Math.round(d.w * 100)}%</span>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {company.upstream.map((d) => (
                <button key={d.node} className="chip border-dashed hover:text-ink" onClick={() => onSelectNode(d.node)}>
                  {nname(d.node)} <span className="num text-dim">{Math.round(d.w * 100)}%</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-dim">{t('co.assets')}</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <Bar label={lang === 'zh' ? '金融资产' : 'Financial'} value={company.asset_mix.financial} tone="#35946e" />
            <Bar label={lang === 'zh' ? '固定资产' : 'PP&E'} value={company.asset_mix.ppe} tone="#4a8fa8" />
            <Bar label={lang === 'zh' ? '商誉+无形' : 'Goodwill+IP'} value={company.asset_mix.goodwill_intangible} tone="#7a5cc4" />
            <Bar label={lang === 'zh' ? '存货' : 'Inventory'} value={company.asset_mix.inventory} tone="#c8822b" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-dim">
            <div>{lang === 'zh' ? '毛利率' : 'Gross margin'} <span className="num text-ink">{fmtPct(company.gross_margin)}</span></div>
            <div>{lang === 'zh' ? '营业成本率' : 'COGS/Rev'} <span className="num text-ink">{fmtPct(company.cogs_ratio)}</span></div>
            <div>CapEx/Rev <span className="num text-ink">{fmtPct(company.capex_ratio)}</span></div>
          </div>
        </section>

        <section className="space-y-2 text-[12.5px] leading-relaxed">
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-dim">{t('co.business')}</div>
            <p className="text-sub">{company.biz_zh || '—'}</p>
          </div>
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-dim">{t('co.expense')}</div>
            <p className="text-sub">{company.expense_note_zh || '—'}</p>
          </div>
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-dim">{t('co.assets')}</div>
            <p className="text-sub">{company.asset_note_zh || '—'}</p>
          </div>
        </section>

        <section className="flex flex-wrap items-center gap-2 border-t border-line pt-3 text-[11px] text-dim">
          <Badge tone={tone}>{t('co.confidence')} {company.confidence || '—'}</Badge>
          <span>{t('co.currency')} {cur}</span>
          <span>·</span>
          <span>{t('co.fy')} {company.fy_end ?? '—'}</span>
          {company.isin && <><span>·</span><span className="num">ISIN {company.isin}</span></>}
        </section>
      </div>
    </aside>
  )
}

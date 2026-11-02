import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { fmt, fmtCap, fmtPct } from '@/lib/utils'
import type { EcoData, Lang } from '@/lib/types'

export function NodePanel({
  data, code, lang, onClose, onSelectCompany, onSelectNode,
}: { data: EcoData; code: string; lang: Lang; onClose: () => void; onSelectCompany: (t: string) => void; onSelectNode: (c: string) => void }) {
  const { t } = useI18n()
  const node = data.nodes.find((n) => n.code === code)
  if (!node) return null
  const nm = (c: string) => {
    const n = data.nodes.find((x) => x.code === c)
    return n ? (lang === 'zh' ? n.name_zh : n.name_en) : c
  }
  const companies = data.companies.filter((c) => c.node === code || c.node2 === code)
    .sort((a, b) => b.mcap_usd_bn - a.mcap_usd_bn)
  const inflow = data.edges.filter((e) => e.to === code).sort((a, b) => b.usd_bn - a.usd_bn).slice(0, 8)
  const outflow = data.edges.filter((e) => e.from === code).sort((a, b) => b.usd_bn - a.usd_bn).slice(0, 8)

  return (
    <aside className="fixed right-0 top-0 z-40 h-full w-[440px] max-w-[92vw] overflow-y-auto border-l border-line bg-panel/98 backdrop-blur">
      <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-line bg-panel/95 px-5 py-4">
        <div>
          <h3 className="text-base font-semibold">{lang === 'zh' ? node.name_zh : node.name_en}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-dim">
            <span className="num">{node.code}</span><span>·</span>
            <span>{fmtCap(node.stats.mcap_usd_bn)}</span><span>·</span>
            <span>{node.stats.companies} {lang === 'zh' ? '家' : 'companies'}</span>
            {node.stats.pe_weighted !== undefined && <><span>·</span><span>PE {fmt(node.stats.pe_weighted, 1)}</span></>}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label={t('node.close')}><X className="h-4 w-4" /></Button>
      </div>

      <div className="space-y-5 px-5 py-4">
        {node.def_zh && (
          <section>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-dim">{t('node.definition')}</div>
            <p className="text-[12.5px] leading-relaxed text-sub">{node.def_zh}</p>
          </section>
        )}

        <section>
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-dim">
            <span>{t('node.companies')}</span>
            <span>{node.stats.leader_name && `${t('node.leader')} ${node.stats.leader_name} ${fmtPct(node.stats.leader_share, 0)}`}</span>
          </div>
          <div className="space-y-1">
            {companies.length === 0 && <p className="text-xs text-dim">—</p>}
            {companies.map((c) => (
              <button key={c.ticker} onClick={() => onSelectCompany(c.ticker)}
                      className="flex w-full items-center justify-between rounded-lg border border-line bg-panel2/60 px-3 py-2 text-left hover:border-accent/50">
                <span className="flex items-center gap-2">
                  <span className="text-sm">{lang === 'zh' ? c.name_zh : c.name_en}</span>
                  <span className="num text-[11px] text-dim">{c.ticker}</span>
                </span>
                <span className="flex items-center gap-3 text-[11px] text-dim">
                  <span className="num">{fmtCap(c.mcap_usd_bn)}</span>
                  <span className="num">PE {fmt(c.pe, 1)}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {[['upstream', inflow], ['downstream', outflow]].map(([key, list]) => (
          <section key={key as string}>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-dim">
              {t(key === 'upstream' ? 'node.upstream' : 'node.downstream')}
            </div>
            <div className="space-y-1">
              {(list as typeof inflow).map((e) => {
                const other = key === 'upstream' ? e.from : e.to
                return (
                  <button key={other + e.type} onClick={() => onSelectNode(other)}
                          className="flex w-full items-center justify-between rounded-lg border border-line/70 px-3 py-1.5 text-left hover:border-accent/50">
                    <span className="text-[12.5px] text-sub">{nm(other)}</span>
                    <span className="num text-[11px] text-dim">{e.usd_bn.toFixed(1)}B</span>
                  </button>
                )
              })}
              {(list as typeof inflow).length === 0 && <p className="text-xs text-dim">—</p>}
            </div>
          </section>
        ))}
      </div>
    </aside>
  )
}

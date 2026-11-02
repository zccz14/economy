import { useI18n } from '@/lib/i18n'
import type { EcoMeta } from '@/lib/types'

export function About({ meta }: { meta: EcoMeta }) {
  const { t, lang } = useI18n()
  const zh = lang === 'zh'
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{t('about.title')}</h2>
        <p className="mt-1 text-xs text-dim">
          {zh ? '这一页不解释"这家公司值多少钱"，只解释"它该和谁比"。' : 'This page explains not what a company is worth, but who it should be compared with.'}
        </p>
      </div>

      <section className="card-surface p-5">
        <h3 className="text-sm font-semibold">{zh ? '一、比较链：四层锚' : '1. Comparison chain: four anchors'}</h3>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-panel2 p-4 text-[12px] leading-relaxed text-sub">
{zh
 ? `公司  →  行业龙头  →  行业(节点加权)  →  大盘  →  货币/宏观
PE_x     PE_leader      PE_node           PE_market   FX / 利率 / 通胀

相对倍数 = 公司倍数 ÷ 龙头倍数 ÷ 节点加权倍数 ÷ 大盘倍数`
 : `Company → Industry leader → Industry (weighted) → Market → Macro/FX
PE_x        PE_leader          PE_node                PE_market   FX / rates / CPI

Relative = company multiple ÷ leader ÷ node-weighted ÷ market`}
        </pre>
        <p className="mt-3 text-[12.5px] leading-relaxed text-sub">
          {zh
            ? `当前大盘锚用样本市值加权 PE ${meta.market_anchor.pe_weighted.toFixed(1)}（中位 ${meta.market_anchor.pe_median.toFixed(1)}）代理。节点加权 PE 用 Σ市值 ÷ Σ(市值/PE) 计算，避免小公司极值拉偏。`
            : `The market anchor is proxied by the sample's cap-weighted PE ${meta.market_anchor.pe_weighted.toFixed(1)} (median ${meta.market_anchor.pe_median.toFixed(1)}). Node-weighted PE = Σcap ÷ Σ(cap/PE).`}
        </p>
      </section>

      <section className="card-surface p-5">
        <h3 className="text-sm font-semibold">{zh ? '二、公司画像：三个正交维度' : '2. Company profile: three dimensions'}</h3>
        <ul className="mt-3 space-y-2 text-[12.5px] text-sub">
          <li>• <b className="text-ink">{zh ? '收入端（赚什么钱）' : 'Revenue (what it earns)'}</b>：{zh ? '收入结构 → 下游是谁、产业链终端在哪。数据来自公司披露的分部收入。' : 'Revenue mix → who the downstream is. From disclosed segment revenue.'}</li>
          <li>• <b className="text-ink">{zh ? '支出端（买什么）' : 'Cost (what it buys)'}</b>：{zh ? '营业成本率、CapEx 率为硬数据；上游归属为行业知识映射，标注置信度。' : 'COGS ratio and CapEx ratio are hard data; upstream mapping is domain judgement, flagged with confidence.'}</li>
          <li>• <b className="text-ink">{zh ? '资产端（暴露什么）' : 'Assets (what it holds)'}</b>：{zh ? '金融资产/固定资产/商誉无形/存货占比，决定它对利率、产能周期、并购减值的敏感度。' : 'Financial assets / PP&E / goodwill+IP / inventory — exposure to rates, capacity cycles, impairments.'}</li>
        </ul>
      </section>

      <section className="card-surface p-5">
        <h3 className="text-sm font-semibold">{zh ? '三、已知局限' : '3. Known limitations'}</h3>
        <ul className="mt-3 space-y-2 text-[12.5px] text-sub">
          <li>• {zh ? `样本 ${meta.universe_zh}，摊到 30 余个节点后多数节点只有 1–2 家公司，此时"龙头"即唯一公司。` : 'Top-50 universe; most nodes hold only 1–2 companies, so "leader" may be the only member.'}</li>
          <li>• {zh ? '支出端（上游归属）无标准披露数据，为人工映射，已标注置信度。' : 'Upstream attribution is not a standard disclosure; it is a manual mapping with confidence flags.'}</li>
          <li>• {zh ? '资金流为近似值（收入流 + 成本流），用于表达量级与方向，不是会计口径的转移价格。' : 'Money flows are approximations (revenue + cost), indicating magnitude and direction only.'}</li>
          <li>• {zh ? '估值为单时点快照，不做时间序列；产业位置按季度更新。' : 'Valuations are a point-in-time snapshot; industry positions refresh quarterly.'}</li>
        </ul>
      </section>

      <section className="card-surface p-5">
        <h3 className="text-sm font-semibold">{zh ? '四、数据来源' : '4. Sources'}</h3>
        <ul className="mt-3 space-y-1.5 text-[12px] text-dim">
          {meta.sources_zh.map((s) => <li key={s}>• {s}</li>)}
          <li className="num">• FX {Object.entries(meta.fx).map(([k, v]) => `${k} ${v}`).join(' · ')} ({meta.fx_date})</li>
          <li>• {meta.notes_zh}</li>
        </ul>
      </section>
    </div>
  )
}

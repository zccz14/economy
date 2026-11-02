import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { TopBar } from '@/components/TopBar'
import { ChainGraph } from '@/components/ChainGraph'
import { ComparisonTable } from '@/components/ComparisonTable'
import { NodeExplorer } from '@/components/NodeExplorer'
import { CompanyPanel } from '@/components/CompanyPanel'
import { NodePanel } from '@/components/NodePanel'
import { About } from '@/components/About'
import { useEco } from '@/lib/data'
import { DICT, I18nContext } from '@/lib/i18n'
import type { Lang } from '@/lib/types'

export default function App() {
  const [lang, setLangState] = useState<Lang>(() => ((localStorage.getItem('lang') as Lang) || 'zh'))
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem('lang', l) }
  useEffect(() => { document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en' }, [lang])

  const i18n = useMemo(() => ({
    lang,
    setLang,
    t: (k: string) => DICT[k]?.[lang] ?? k,
  }), [lang])

  const { data, isLoading, error } = useEco()
  const [ticker, setTicker] = useState<string | null>(null)
  const [node, setNode] = useState<string | null>(null)

  const company = data?.companies.find((c) => c.ticker === ticker) ?? null

  return (
    <I18nContext.Provider value={i18n}>
      <div className="min-h-full">
        <TopBar meta={data?.meta} />
        <main className="mx-auto max-w-[1680px] px-5 py-6">
          {isLoading && <div className="py-24 text-center text-sm text-dim">{i18n.t('loading')}</div>}
          {error && <div className="py-24 text-center text-sm text-rose-300">{i18n.t('error')}: {String(error)}</div>}
          {data && (
            <Routes>
              <Route path="/" element={<Navigate to="/chain" replace />} />
              <Route path="/chain" element={
                <ChainGraph data={data} lang={lang} selectedNode={node} onSelectNode={setNode} />
              } />
              <Route path="/compare" element={
                <ComparisonTable data={data} lang={lang} onSelectCompany={setTicker} onSelectNode={setNode} />
              } />
              <Route path="/nodes" element={<NodeExplorer data={data} lang={lang} onSelectNode={setNode} />} />
              <Route path="/about" element={<About meta={data.meta} />} />
              <Route path="*" element={<Navigate to="/chain" replace />} />
            </Routes>
          )}
        </main>
        <footer className="mx-auto max-w-[1680px] px-5 pb-8 pt-2 text-[11px] text-dim">
          {data && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-4">
              <span className="num">{i18n.t('meta.version')} {data.meta.version}</span>
              <span className="num">{i18n.t('meta.asof')} {data.meta.as_of}</span>
              <span>{i18n.t('meta.universe')}: {lang === 'zh' ? data.meta.universe_zh : data.meta.universe_en}</span>
              <span className="ml-auto">zccz14/economy</span>
            </div>
          )}
        </footer>
      </div>

      {data && company && (
        <CompanyPanel data={data} company={company} lang={lang} onClose={() => setTicker(null)}
                      onSelectNode={(c) => { setTicker(null); setNode(c) }} />
      )}
      {data && !company && node && (
        <NodePanel data={data} code={node} lang={lang} onClose={() => setNode(null)}
                   onSelectCompany={setTicker} onSelectNode={setNode} />
      )}
    </I18nContext.Provider>
  )
}

import { Globe, Github } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { EcoMeta } from '@/lib/types'

const NAV = [
  { to: '/chain', key: 'nav.chain' },
  { to: '/compare', key: 'nav.compare' },
  { to: '/nodes', key: 'nav.nodes' },
  { to: '/about', key: 'nav.about' },
]

export function TopBar({ meta }: { meta?: EcoMeta }) {
  const { t, lang, setLang } = useI18n()
  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1680px] items-center gap-4 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19V9m5 10V5m5 14v-7m5 7V8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-semibold">{t('app.title')}</div>
            <div className="text-[11px] text-dim">{t('app.subtitle')}</div>
          </div>
        </div>

        <nav className="ml-4 flex items-center gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  isActive ? 'bg-panel2 text-ink' : 'text-sub hover:bg-panel2/60 hover:text-ink',
                )
              }
            >
              {t(n.key)}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 text-[11px] text-dim">
          {meta && (
            <span className="hidden md:inline num">
              {t('meta.asof')} {meta.as_of} · {t('meta.anchor')} {meta.market_anchor.pe_weighted.toFixed(1)}
            </span>
          )}
          <a href="https://github.com/zccz14/economy" target="_blank" rel="noreferrer"
             className="text-dim transition-colors hover:text-sub" aria-label="GitHub">
            <Github className="h-4 w-4" />
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label={t('lang.label')}>
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setLang('zh')} className={lang === 'zh' ? 'text-ink' : ''}>
                中文
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setLang('en')} className={lang === 'en' ? 'text-ink' : ''}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

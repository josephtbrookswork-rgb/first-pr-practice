import { useEffect, useRef, useState } from 'react'
import NavTrigger from './NavTrigger.jsx'
import NavDrawer from './NavDrawer.jsx'
import TopBar from './TopBar.jsx'
import QuickAddFab from './QuickAddFab.jsx'
import { PAGE_BY_ID } from '../../lib/pages.js'
import { PAGE_COLOR } from '../../lib/colors.js'

export default function AppShell({ active, onChange, onQuickAdd, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const mainRef = useRef(null)

  const page = PAGE_BY_ID[active]
  const color = PAGE_COLOR[active]

  // The <main> scroll container persists across page switches, so reset
  // scroll whenever the active page changes — a freshly opened page
  // hasn't been scrolled yet.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
  }, [active])

  function select(id) {
    onChange(id)
    setDrawerOpen(false)
  }

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-neutral-100">
      <TopBar
        title={page.title}
        pageId={active}
        trigger={<NavTrigger page={page} open={drawerOpen} onClick={() => setDrawerOpen(true)} />}
      />
      <main
        ref={mainRef}
        className="scrollbar-none safe-bottom min-h-0 flex-1 overflow-y-auto px-5 py-4"
      >
        {children}
      </main>

      <NavDrawer open={drawerOpen} active={active} onClose={() => setDrawerOpen(false)} onSelect={select} />

      <QuickAddFab activePage={active} onSelect={onQuickAdd} />

      {/* Framing border flush against the true viewport edges. We previously
          tried offsetting this with env(safe-area-inset-*) to dodge the
          notch/home-indicator, but Capacitor's WKWebView already sizes its
          viewport to the safe area itself — layering our own inset on top
          double-counted it and left a visible gap at the top and bottom.
          inset-0 is correct here regardless of what the WebView does with
          safe areas, since it always matches whatever it reports as 0,0.
          Rounded with a fixed radius to match the display's own corner
          mask — iOS rounds every app's screen corners at the system level,
          so hard 90-degree corners visibly clash with that curve. 55px
          approximates the actual display corner radius on Face ID iPhones
          (iPhone 15 included, ~55pt) — the earlier 40px was too small, so
          the leftover straight edge between where our curve finished and
          the true corner was getting clipped by the OS's own mask, which
          read as the border being "cut off" right at the edge. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-50 rounded-[55px] border-[3px] transition-colors duration-200 ${color.screenBorder}`}
      />
    </div>
  )
}

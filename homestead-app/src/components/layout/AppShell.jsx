import { useEffect, useRef, useState } from 'react'
import NavTrigger from './NavTrigger.jsx'
import NavDrawer from './NavDrawer.jsx'
import TopBar from './TopBar.jsx'
import { PAGE_BY_ID } from '../../lib/pages.js'
import { PAGE_COLOR } from '../../lib/colors.js'

const SCROLL_COLLAPSE_THRESHOLD = 8

export default function AppShell({ active, onChange, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [navCollapsed, setNavCollapsed] = useState(false)
  const mainRef = useRef(null)

  const page = PAGE_BY_ID[active]
  const color = PAGE_COLOR[active]

  // The <main> scroll container persists across page switches, so reset
  // scroll and the collapsed nav whenever the active page changes — a
  // freshly opened page hasn't been scrolled yet.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
    setNavCollapsed(false)
  }, [active])

  function handleScroll(e) {
    setNavCollapsed(e.currentTarget.scrollTop > SCROLL_COLLAPSE_THRESHOLD)
  }

  function select(id) {
    onChange(id)
    setDrawerOpen(false)
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-neutral-100">
      <nav
        aria-label="Primary"
        aria-hidden={navCollapsed}
        className={`safe-top safe-left flex shrink-0 flex-col items-center overflow-hidden bg-white pt-3 transition-all duration-200 ${
          navCollapsed ? 'w-0 border-transparent opacity-0' : 'w-16 border-r border-neutral-200 opacity-100'
        }`}
      >
        <NavTrigger
          page={page}
          color={color}
          open={drawerOpen}
          onClick={() => setDrawerOpen(true)}
          tabIndex={navCollapsed ? -1 : 0}
        />
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title={page.title}
          pageId={active}
          trigger={
            navCollapsed ? (
              <NavTrigger page={page} color={color} open={drawerOpen} onClick={() => setDrawerOpen(true)} />
            ) : null
          }
        />
        <main
          ref={mainRef}
          onScroll={handleScroll}
          className="scrollbar-none safe-bottom min-h-0 flex-1 overflow-y-auto px-5 py-4"
        >
          {children}
        </main>
      </div>

      <NavDrawer open={drawerOpen} active={active} onClose={() => setDrawerOpen(false)} onSelect={select} />
    </div>
  )
}

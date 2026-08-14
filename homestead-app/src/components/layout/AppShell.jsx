import { useEffect, useRef, useState } from 'react'
import NavTrigger from './NavTrigger.jsx'
import NavDrawer from './NavDrawer.jsx'
import TopBar from './TopBar.jsx'
import { PAGE_BY_ID } from '../../lib/pages.js'
import { PAGE_COLOR } from '../../lib/colors.js'

export default function AppShell({ active, onChange, children }) {
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
    <div
      className={`flex h-dvh w-full flex-col overflow-hidden border-[3px] bg-neutral-100 transition-colors duration-200 ${color.screenBorder}`}
    >
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
    </div>
  )
}

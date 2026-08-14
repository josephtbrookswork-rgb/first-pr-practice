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

      {/* Framing border pinned to the device's safe-area boundary (not the raw
          viewport edge), so it follows the actual usable screen on notches,
          Dynamic Island, and home-indicator devices instead of cutting across them.
          Rounded to match the display's own corner mask — iOS rounds every
          app's screen corners at the system level, so a hard-cornered
          rectangle here visibly clashes with that curve. There's no CSS API
          for the actual corner radius, so we scale it off the top safe-area
          inset: that's ~0 on square-cornered screens (older iPhones, iPads,
          desktop) and grows with how pronounced the notch/Dynamic Island is
          on newer ones, tracking device curvature closely enough in practice. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed z-50 border-[3px] transition-colors duration-200 ${color.screenBorder}`}
        style={{
          top: 'env(safe-area-inset-top, 0px)',
          right: 'env(safe-area-inset-right, 0px)',
          bottom: 'env(safe-area-inset-bottom, 0px)',
          left: 'env(safe-area-inset-left, 0px)',
          borderRadius: 'env(safe-area-inset-top, 0px)',
        }}
      />
    </div>
  )
}

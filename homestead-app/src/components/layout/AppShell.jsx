import SideRail from './SideRail.jsx'
import TopBar from './TopBar.jsx'
import { PAGE_BY_ID } from '../../lib/pages.js'

export default function AppShell({ active, onChange, children }) {
  const page = PAGE_BY_ID[active]

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-neutral-100">
      <SideRail active={active} onChange={onChange} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={page.title} pageId={active} />
        <main className="scrollbar-none safe-bottom min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {children}
        </main>
      </div>
    </div>
  )
}

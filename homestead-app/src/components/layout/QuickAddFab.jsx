import { useState } from 'react'
import { Plus, ClipboardCheck, ShoppingCart, CalendarDays, LifeBuoy } from 'lucide-react'
import { useFamily } from '../../context/FamilyContext.jsx'
import { PAGE_COLOR } from '../../lib/colors.js'

const OPTIONS = [
  { pageId: 'chores', label: 'Add a chore', icon: ClipboardCheck, managerOnly: true },
  { pageId: 'grocery', label: 'Add to grocery list', icon: ShoppingCart },
  { pageId: 'calendar', label: 'Add to calendar', icon: CalendarDays },
  { pageId: 'hub', label: 'Add to hub', icon: LifeBuoy },
]

export default function QuickAddFab({ activePage, onSelect }) {
  const { viewerIsManager } = useFamily()
  const [open, setOpen] = useState(false)

  // Grocery already has its own always-visible add bar at the bottom of
  // the screen — a second floating control there would just collide with it.
  if (activePage === 'grocery') return null

  const options = OPTIONS.filter((o) => !o.managerOnly || viewerIsManager)

  function choose(pageId) {
    setOpen(false)
    onSelect(pageId)
  }

  return (
    <>
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
        aria-label="Close quick add menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-neutral-900/20 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* pointer-events-none on this wrapper: it's sized to fit the menu
          items even while they're hidden (opacity/translate don't remove
          them from layout), so without this it would block clicks straight
          through to whatever's underneath — like a sheet's submit button —
          any time the menu is closed. Only the actual buttons re-enable it. */}
      <div
        className="pointer-events-none fixed z-50 flex flex-col items-end gap-2"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
          right: 'calc(env(safe-area-inset-right, 0px) + 20px)',
        }}
      >
        <div
          className={`flex flex-col items-end gap-2 transition-all duration-200 ${
            open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
          }`}
        >
          {options.map(({ pageId, label, icon: Icon }) => {
            const color = PAGE_COLOR[pageId]
            return (
              <button
                key={pageId}
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => choose(pageId)}
                className="flex items-center gap-2.5 rounded-[var(--radius-pill)] bg-white py-2 pl-3 pr-4 shadow-[var(--shadow-raised)]"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${color.icon}`}
                >
                  <Icon size={15} />
                </span>
                <span className="text-sm font-semibold text-neutral-800">{label}</span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={open}
          aria-label={open ? 'Close quick add menu' : 'Quick add'}
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-600 text-white shadow-[var(--shadow-raised)] transition-transform duration-200"
          style={{ transform: open ? 'rotate(45deg)' : 'none' }}
        >
          <Plus size={26} />
        </button>
      </div>
    </>
  )
}

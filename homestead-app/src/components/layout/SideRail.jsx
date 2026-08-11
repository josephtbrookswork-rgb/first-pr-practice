import { Home, ClipboardCheck, CalendarDays, ShoppingCart, LifeBuoy } from 'lucide-react'

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'chores', label: 'Chores', icon: ClipboardCheck },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'grocery', label: 'Grocery', icon: ShoppingCart },
  { id: 'hub', label: 'Hub', icon: LifeBuoy },
]

export default function SideRail({ active, onChange }) {
  return (
    <nav
      aria-label="Primary"
      className="safe-top safe-left flex w-[72px] shrink-0 flex-col items-center gap-1 border-r border-neutral-200 bg-white pt-3"
    >
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-[10px] bg-slate-600 text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 11L12 4L20 11V19.5C20 20.05 19.55 20.5 19 20.5H14V14H10V20.5H5C4.45 20.5 4 20.05 4 19.5V11Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-current={isActive ? 'page' : undefined}
            className="flex w-full flex-col items-center gap-1 px-1 py-2.5 text-neutral-500 transition-colors"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-[12px] transition-colors ${
                isActive ? 'bg-slate-600 text-white' : 'text-neutral-500'
              }`}
            >
              <Icon size={19} strokeWidth={isActive ? 2.4 : 2} />
            </span>
            <span
              className={`text-[10px] leading-none ${
                isActive ? 'font-semibold text-slate-700' : 'text-neutral-500'
              }`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

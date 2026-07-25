import { Home, CalendarClock, CalendarDays, Package, User } from 'lucide-react'

const TABS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'schedule', label: 'Schedule', Icon: CalendarClock },
  { id: 'calendar', label: 'Calendar', Icon: CalendarDays },
  { id: 'pantry', label: 'Pantry', Icon: Package },
  { id: 'profile', label: 'Profile', Icon: User },
]

function TabBar({ active, onChange }) {
  return (
    <nav className="floating-nav" aria-label="Primary">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className="floating-nav-btn"
          aria-current={active === id ? 'page' : undefined}
          aria-label={label}
          onClick={() => onChange(id)}
        >
          <Icon size={22} strokeWidth={2.5} aria-hidden="true" />
          <span className="floating-nav-tooltip" aria-hidden="true">
            {label}
          </span>
        </button>
      ))}
    </nav>
  )
}

export default TabBar

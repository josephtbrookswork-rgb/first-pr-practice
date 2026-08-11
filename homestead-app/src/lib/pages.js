import { Home, ClipboardCheck, CalendarDays, ShoppingCart, LifeBuoy } from 'lucide-react'

// Single source of truth for the app's top-level sections — used by the
// nav drawer, the top bar title, and anywhere else that needs to loop
// over pages instead of duplicating this list.
export const PAGES = [
  { id: 'home', label: 'Home', title: 'Home', icon: Home },
  { id: 'chores', label: 'Chores', title: 'Chores', icon: ClipboardCheck },
  { id: 'calendar', label: 'Calendar', title: 'Calendar', icon: CalendarDays },
  { id: 'grocery', label: 'Grocery', title: 'Grocery', icon: ShoppingCart },
  { id: 'hub', label: 'Hub', title: 'Household Hub', icon: LifeBuoy },
]

export const PAGE_BY_ID = Object.fromEntries(PAGES.map((p) => [p.id, p]))

import { Home, ClipboardCheck, CalendarDays, ShoppingCart, LifeBuoy } from 'lucide-react'

// Walks through the same five sections as lib/pages.js, in the same
// order, so the tutorial matches the nav drawer the learner will see
// right after finishing it.
export const TUTORIAL_STEPS = [
  {
    id: 'home',
    icon: Home,
    title: 'Your day at a glance',
    body: "Home shows what's due today, chores waiting on your approval, and what's coming up next.",
    colorKey: 'home',
  },
  {
    id: 'chores',
    icon: ClipboardCheck,
    title: 'Chores, shared fairly',
    body: 'Assign tasks, claim open ones, check off subtasks, and confirm the tricky ones with a photo.',
    colorKey: 'chores',
  },
  {
    id: 'calendar',
    icon: CalendarDays,
    title: 'One calendar for everyone',
    body: 'Browse the week, filter by family member, and see chores linked right to the events they belong to.',
    colorKey: 'calendar',
  },
  {
    id: 'grocery',
    icon: ShoppingCart,
    title: 'Shop as a team',
    body: 'Keep a running list by aisle. Anyone can request an item — managers approve it before it hits the list.',
    colorKey: 'grocery',
  },
  {
    id: 'hub',
    icon: LifeBuoy,
    title: 'Answers when you need them',
    body: 'Wi-Fi password, emergency contacts, pet care, and house-sitter notes — one tap away for anyone looking after the house.',
    colorKey: 'hub',
  },
]

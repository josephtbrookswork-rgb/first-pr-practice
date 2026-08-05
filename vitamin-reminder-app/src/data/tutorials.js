import { Plus, Circle, GripVertical, CalendarDays, Package } from 'lucide-react'

export const TUTORIALS = {
  home: {
    title: 'Your daily routine',
    steps: [
      {
        Icon: Circle,
        text: "Tap the circle next to a vitamin once you've taken it. Tap the X instead if you're skipping it today.",
      },
      {
        Icon: Plus,
        text: 'Tap the + next to Daily routine to build your own checklist, like a face-wash routine or grocery list.',
      },
      {
        Icon: GripVertical,
        text: 'Drag any card by its handle to reorder your whole stack, check-in included.',
      },
    ],
  },
  schedule: {
    title: 'Building your schedule',
    steps: [
      {
        Icon: Plus,
        text: 'Tap + Add supplement under Dawn, Midday, or Dusk to add a vitamin to that part of your day.',
      },
      {
        Icon: Circle,
        text: 'Set a dosage and, if you like, tie it to an anchor habit like breakfast or brushing your teeth.',
      },
    ],
  },
  calendar: {
    title: 'Tracking your history',
    steps: [
      {
        Icon: CalendarDays,
        text: 'Days with a small dot have a logged entry. Tap any day to see what you took, skipped, and how you checked in.',
      },
    ],
  },
  pantry: {
    title: 'Your pantry',
    steps: [
      {
        Icon: Package,
        text: "Supplements you add from Schedule show up here automatically, or tap + to add pantry items directly.",
      },
      {
        Icon: Circle,
        text: 'Each item tracks servings left, so you can see at a glance what needs restocking soon.',
      },
    ],
  },
}

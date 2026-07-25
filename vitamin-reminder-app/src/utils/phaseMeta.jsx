import { Sunrise, Sun, Moon, Coffee, AlarmClock, Dumbbell } from 'lucide-react'

export const PHASES = [
  { id: 'dawn', label: 'Dawn', Icon: Sunrise, iconColor: 'var(--color-accent-700)', iconBg: 'var(--color-accent-100)' },
  { id: 'midday', label: 'Midday', Icon: Sun, iconColor: 'var(--color-accent-700)', iconBg: 'var(--color-accent-200)' },
  { id: 'dusk', label: 'Dusk', Icon: Moon, iconColor: 'var(--color-accent-2-800)', iconBg: 'var(--color-accent-2-100)' },
]

export function getPhaseMeta(phaseId) {
  return PHASES.find((phase) => phase.id === phaseId) ?? PHASES[0]
}

export const ANCHOR_OPTIONS = [
  { id: 'coffee', label: 'Coffee', Icon: Coffee },
  { id: 'wake-up', label: 'Wake-up', Icon: AlarmClock },
  { id: 'workout', label: 'Workout', Icon: Dumbbell },
]

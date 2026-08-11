// Maps a member's brand color key to Tailwind utility classes.
// Kept centralized so the same member always reads the same color across
// avatars, calendar chips, and status tags.
export const MEMBER_COLOR = {
  slate: {
    bg: 'bg-slate-600',
    bgSoft: 'bg-slate-100',
    text: 'text-slate-700',
    ring: 'ring-slate-300',
    dot: 'bg-slate-500',
  },
  sage: {
    bg: 'bg-sage-600',
    bgSoft: 'bg-sage-100',
    text: 'text-sage-700',
    ring: 'ring-sage-200',
    dot: 'bg-sage-500',
  },
  amber: {
    bg: 'bg-amber-600',
    bgSoft: 'bg-amber-100',
    text: 'text-amber-800',
    ring: 'ring-amber-200',
    dot: 'bg-amber-500',
  },
  danger: {
    bg: 'bg-danger-500',
    bgSoft: 'bg-danger-100',
    text: 'text-danger-700',
    ring: 'ring-danger-100',
    dot: 'bg-danger-500',
  },
}

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

// Maps each top-level page (see lib/pages.js) to its own pastel identity
// color — used in the nav drawer and light accents on that page, kept
// separate from MEMBER_COLOR and status tones (sage/amber/danger) so this
// never collides with their existing meanings elsewhere in the app.
export const PAGE_COLOR = {
  home: {
    solid: 'bg-pg-green-600',
    solidText: 'text-white',
    soft: 'bg-pg-green-100',
    text: 'text-pg-green-700',
    icon: 'bg-pg-green-500 text-white',
    titleBg: 'bg-pg-green-700',
    titleBorder: 'border-pg-green-500',
  },
  chores: {
    solid: 'bg-pg-red-600',
    solidText: 'text-white',
    soft: 'bg-pg-red-100',
    text: 'text-pg-red-700',
    icon: 'bg-pg-red-500 text-white',
    titleBg: 'bg-pg-red-700',
    titleBorder: 'border-pg-red-500',
  },
  calendar: {
    solid: 'bg-pg-blue-600',
    solidText: 'text-white',
    soft: 'bg-pg-blue-100',
    text: 'text-pg-blue-700',
    icon: 'bg-pg-blue-500 text-white',
    titleBg: 'bg-pg-blue-700',
    titleBorder: 'border-pg-blue-500',
  },
  grocery: {
    solid: 'bg-pg-yellow-500',
    solidText: 'text-neutral-900',
    soft: 'bg-pg-yellow-100',
    text: 'text-pg-yellow-700',
    icon: 'bg-pg-yellow-500 text-neutral-900',
    titleBg: 'bg-pg-yellow-700',
    titleBorder: 'border-pg-yellow-500',
  },
  hub: {
    solid: 'bg-pg-orange-600',
    solidText: 'text-white',
    soft: 'bg-pg-orange-100',
    text: 'text-pg-orange-700',
    icon: 'bg-pg-orange-500 text-white',
    titleBg: 'bg-pg-orange-700',
    titleBorder: 'border-pg-orange-500',
  },
}

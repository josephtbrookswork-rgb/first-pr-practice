import { ChevronDown } from 'lucide-react'

export default function NavTrigger({ page, color, open, onClick, tabIndex = 0 }) {
  const Icon = page.icon
  return (
    <button
      type="button"
      tabIndex={tabIndex}
      onClick={onClick}
      aria-haspopup="true"
      aria-expanded={open}
      aria-label={`${page.label} — open navigation menu`}
      className="flex shrink-0 flex-col items-center gap-0.5 rounded-[14px] px-1.5 py-1 transition-colors active:bg-neutral-100"
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-[11px] transition-colors ${color.icon}`}
      >
        <Icon size={18} strokeWidth={2.3} />
      </span>
      <ChevronDown size={13} className="text-neutral-400" aria-hidden="true" />
    </button>
  )
}

import { ChevronDown } from 'lucide-react'

export default function NavTrigger({ page, open, onClick }) {
  const Icon = page.icon
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="true"
      aria-expanded={open}
      aria-label={`${page.label} — open navigation menu`}
      className="flex shrink-0 flex-col items-center gap-0.5 rounded-[10px] px-1.5 py-1 text-white transition-colors active:bg-white/15"
    >
      <Icon size={22} strokeWidth={2.3} />
      <ChevronDown size={13} aria-hidden="true" />
    </button>
  )
}

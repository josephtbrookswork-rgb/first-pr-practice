import { useEffect, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { PAGES } from '../../lib/pages.js'
import { PAGE_COLOR } from '../../lib/colors.js'

export default function SideRail({ active, onChange }) {
  const [open, setOpen] = useState(false)
  const activePage = PAGES.find((p) => p.id === active) ?? PAGES[0]
  const ActiveIcon = activePage.icon
  const activeColor = PAGE_COLOR[activePage.id]

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function select(id) {
    onChange(id)
    setOpen(false)
  }

  return (
    <>
      <nav
        aria-label="Primary"
        className="safe-top safe-left flex w-16 shrink-0 flex-col items-center border-r border-neutral-200 bg-white pt-3"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="true"
          aria-expanded={open}
          aria-label={`${activePage.label} — open navigation menu`}
          className="flex flex-col items-center gap-1 rounded-[14px] px-2 py-2.5 transition-colors active:bg-neutral-100"
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-[12px] transition-colors ${activeColor.icon}`}
          >
            <ActiveIcon size={20} strokeWidth={2.3} />
          </span>
          <ChevronDown size={15} className="text-neutral-400" aria-hidden="true" />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-40 flex transition-opacity duration-200 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          aria-label="Close navigation menu"
          className="absolute inset-0 bg-neutral-900/30"
        />

        <div
          className={`safe-top safe-left relative flex h-full w-[230px] flex-col gap-1 bg-white pb-4 pt-3 shadow-[var(--shadow-raised)] transition-transform duration-200 ease-out ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-2 flex items-center justify-between px-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-slate-600 text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 11L12 4L20 11V19.5C20 20.05 19.55 20.5 19 20.5H14V14H10V20.5H5C4.45 20.5 4 20.05 4 19.5V11Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <button
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
              className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 active:bg-neutral-100"
            >
              <X size={16} />
            </button>
          </div>

          {PAGES.map((page) => {
            const isActive = active === page.id
            const color = PAGE_COLOR[page.id]
            const Icon = page.icon
            return (
              <button
                key={page.id}
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => select(page.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`mx-2 flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-left transition-colors ${
                  isActive ? color.soft : 'active:bg-neutral-50'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] transition-colors ${
                    isActive ? color.icon : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
                </span>
                <span
                  className={`text-sm font-semibold ${isActive ? color.text : 'text-neutral-600'}`}
                >
                  {page.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

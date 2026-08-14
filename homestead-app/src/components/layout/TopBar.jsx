import { useState } from 'react'
import Avatar from '../ui/Avatar.jsx'
import ProfileSwitcher from './ProfileSwitcher.jsx'
import { useFamily } from '../../context/FamilyContext.jsx'
import { ROLE_LABEL } from '../../data/mockData.js'
import { PAGE_COLOR } from '../../lib/colors.js'

export default function TopBar({ title, pageId, trigger }) {
  const { viewer } = useFamily()
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const color = PAGE_COLOR[pageId]

  return (
    <header
      className={`safe-top flex items-center justify-between gap-3 px-5 pb-3 pt-4 transition-colors duration-200 ${color.headerBg}`}
    >
      <div className="flex min-w-0 items-center gap-2">
        {trigger}
        <h1 className="truncate text-xl font-bold tracking-tight text-white">{title}</h1>
      </div>
      <button
        type="button"
        onClick={() => setSwitcherOpen(true)}
        className="flex shrink-0 items-center gap-2 rounded-[var(--radius-pill)] bg-white py-1 pl-1 pr-3 shadow-[var(--shadow-card)]"
      >
        <Avatar member={viewer} size="sm" />
        <span className="text-left leading-tight">
          <span className="block text-xs font-semibold text-neutral-900">{viewer.name}</span>
          <span className="block text-[10px] text-neutral-500">{ROLE_LABEL[viewer.role]}</span>
        </span>
      </button>
      <ProfileSwitcher open={switcherOpen} onClose={() => setSwitcherOpen(false)} />
    </header>
  )
}

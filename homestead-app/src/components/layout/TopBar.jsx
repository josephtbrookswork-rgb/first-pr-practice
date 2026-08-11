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
    <header className="safe-top flex items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-100/95 px-5 pb-3 pt-4 backdrop-blur">
      <div className="flex min-w-0 items-center gap-2">
        {trigger}
        <h1
          className={`truncate rounded-[10px] border-b-[3px] px-3 py-1.5 text-xl font-bold tracking-tight text-white ${color.titleBg} ${color.titleBorder}`}
        >
          {title}
        </h1>
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

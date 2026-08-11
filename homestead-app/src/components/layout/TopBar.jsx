import { useState } from 'react'
import Avatar from '../ui/Avatar.jsx'
import ProfileSwitcher from './ProfileSwitcher.jsx'
import { useFamily } from '../../context/FamilyContext.jsx'
import { ROLE_LABEL } from '../../data/mockData.js'

export default function TopBar({ title }) {
  const { viewer } = useFamily()
  const [switcherOpen, setSwitcherOpen] = useState(false)

  return (
    <header className="safe-top flex items-center justify-between border-b border-neutral-200 bg-neutral-100/95 px-5 pb-3 pt-4 backdrop-blur">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
      <button
        type="button"
        onClick={() => setSwitcherOpen(true)}
        className="flex items-center gap-2 rounded-[var(--radius-pill)] bg-white py-1 pl-1 pr-3 shadow-[var(--shadow-card)]"
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

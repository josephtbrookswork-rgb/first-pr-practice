import { useState } from 'react'
import Avatar from '../components/ui/Avatar.jsx'
import { ROLES } from './roles.js'
import { MEMBER_COLOR } from '../lib/colors.js'

const AVATAR_COLORS = [
  { key: 'slate', label: 'Slate Blue' },
  { key: 'sage', label: 'Sage Green' },
  { key: 'amber', label: 'Warm Amber' },
  { key: 'danger', label: 'Terracotta' },
]

function initialsFor(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export default function SignUp({ onContinue }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('slate')
  const [role, setRole] = useState(null)

  const canContinue = name.trim().length > 0 && role !== null
  const previewMember = { name: name.trim() || 'You', initials: initialsFor(name), color }

  function handleSubmit(e) {
    e.preventDefault()
    if (!canContinue) return
    onContinue({
      id: 'me',
      name: name.trim(),
      initials: initialsFor(name),
      color,
      role,
      streak: 0,
      stars: 0,
    })
  }

  return (
    <div className="safe-top safe-bottom flex h-dvh w-full flex-col overflow-y-auto bg-neutral-100 px-6 py-8">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-slate-600 text-white shadow-[var(--shadow-raised)]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 11L12 4L20 11V19.5C20 20.05 19.55 20.5 19 20.5H14V14H10V20.5H5C4.45 20.5 4 20.05 4 19.5V11Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Welcome to Homestead</h1>
            <p className="mt-1 text-sm text-neutral-600">Let's set up your profile.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col items-center gap-3">
            <Avatar member={previewMember} size="lg" />
            <div className="flex gap-2.5">
              {AVATAR_COLORS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setColor(key)}
                  aria-label={label}
                  aria-pressed={color === key}
                  className={`h-8 w-8 rounded-full transition-shadow ${MEMBER_COLOR[key].bg} ${
                    color === key ? 'ring-2 ring-neutral-900 ring-offset-2 ring-offset-neutral-100' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-neutral-700">
            Your name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Joseph"
              autoComplete="given-name"
              autoFocus
              className="rounded-[var(--radius-md)] border border-neutral-200 bg-white px-4 py-3 text-base font-normal text-neutral-900 outline-none focus:border-slate-400"
            />
          </label>

          <div>
            <p className="mb-2 text-sm font-semibold text-neutral-700">Who are you in the household?</p>
            <div className="flex flex-col gap-2">
              {ROLES.map(({ id, label, description, icon: Icon }) => {
                const selected = role === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setRole(id)}
                    aria-pressed={selected}
                    className={`flex items-start gap-3 rounded-[var(--radius-md)] border p-3 text-left transition-colors ${
                      selected ? 'border-slate-500 bg-slate-50' : 'border-neutral-200 bg-white'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] transition-colors ${
                        selected ? 'bg-slate-600 text-white' : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-neutral-900">{label}</span>
                      <span className="block text-xs text-neutral-600">{description}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={!canContinue}
            className="mt-auto rounded-[var(--radius-pill)] bg-slate-600 px-4 py-3.5 text-base font-semibold text-white transition-opacity disabled:opacity-40"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
